import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Link, Navigate } from "react-router-dom";
import { Car, ArrowLeft, Clock, User, CalendarDays, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addHours, isBefore, startOfDay, isToday, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Generate 45-min slots from 9:00 to 20:00
const ALL_SLOTS = (() => {
  const slots: { start: string; end: string }[] = [];
  let hour = 9, min = 0;
  while (true) {
    const startH = String(hour).padStart(2, "0");
    const startM = String(min).padStart(2, "0");
    let endMin = min + 45;
    let endHour = hour;
    if (endMin >= 60) { endHour++; endMin -= 60; }
    if (endHour > 20 || (endHour === 20 && endMin > 0)) break;
    const endH = String(endHour).padStart(2, "0");
    const endM = String(endMin).padStart(2, "0");
    slots.push({ start: `${startH}:${startM}`, end: `${endH}:${endM}` });
    hour = endHour;
    min = endMin;
  }
  return slots;
})();

const TEACHERS = [
  { name: "Valentín", id: "valentin" },
  { name: "Joaquín", id: "joaquin" },
  { name: "Profesora", id: "profesora" },
];

export default function Reservas() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedTeacherName, setSelectedTeacherName] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  // Get student's remaining classes
  const { data: balance = 0 } = useQuery({
    queryKey: ["class-balance", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("payments")
        .select("classes_remaining")
        .eq("user_id", user!.id)
        .eq("status", "completed");
      return (data ?? []).reduce((sum, p) => sum + (p.classes_remaining || 0), 0);
    },
    enabled: !!user,
  });

  // Get bookings for selected teacher + date to know taken slots
  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const { data: takenSlots = [] } = useQuery({
    queryKey: ["taken-slots", selectedTeacherName, dateStr],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("start_time, end_time")
        .eq("booking_date", dateStr!)
        .eq("notes", selectedTeacherName!)
        .in("status", ["confirmed", "pending"]);
      return (data ?? []).map((b) => b.start_time.slice(0, 5));
    },
    enabled: !!selectedTeacherName && !!dateStr,
  });

  // Get student's upcoming bookings
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: myBookings = [] } = useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("student_id", user!.id)
        .gte("booking_date", today)
        .in("status", ["confirmed", "pending"])
        .order("booking_date", { ascending: true })
        .order("start_time", { ascending: true });
      return data ?? [];
    },
    enabled: !!user,
  });

  // Available slots for selected date
  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const now = new Date();
    return ALL_SLOTS.filter((slot) => {
      // Filter out taken slots
      if (takenSlots.includes(slot.start)) return false;
      // Filter out past slots if today
      if (isToday(selectedDate)) {
        const [h, m] = slot.start.split(":").map(Number);
        const slotTime = new Date(selectedDate);
        slotTime.setHours(h, m, 0, 0);
        if (isBefore(slotTime, now)) return false;
      }
      return true;
    });
  }, [selectedDate, takenSlots]);

  // Handle slot selection (max 2 consecutive)
  const handleSlotToggle = (slotStart: string) => {
    if (selectedSlots.includes(slotStart)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slotStart));
      return;
    }
    if (selectedSlots.length >= 2) {
      toast({ title: "Máximo 2 clases seguidas", variant: "destructive" });
      return;
    }
    const newSlots = [...selectedSlots, slotStart].sort();
    // Check consecutiveness if 2 slots
    if (newSlots.length === 2) {
      const idx0 = ALL_SLOTS.findIndex((s) => s.start === newSlots[0]);
      const idx1 = ALL_SLOTS.findIndex((s) => s.start === newSlots[1]);
      if (idx1 !== idx0 + 1) {
        toast({ title: "Las clases deben ser consecutivas", variant: "destructive" });
        return;
      }
    }
    setSelectedSlots(newSlots);
  };

  // Book mutation
  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedDate || !selectedTeacherName || selectedSlots.length === 0) throw new Error("Datos incompletos");
      if (balance < selectedSlots.length) throw new Error("Saldo insuficiente");

      const bookings = selectedSlots.map((startTime) => {
        const slot = ALL_SLOTS.find((s) => s.start === startTime)!;
        return {
          student_id: user.id,
          teacher_id: user.id, // We store teacher name in notes since we don't have teacher user IDs
          booking_date: format(selectedDate, "yyyy-MM-dd"),
          start_time: slot.start,
          end_time: slot.end,
          status: "confirmed",
          notes: selectedTeacherName,
        };
      });

      // Insert bookings
      const { error: bookError } = await supabase.from("bookings").insert(bookings);
      if (bookError) throw bookError;

      // Deduct from balance - find payments with remaining classes and deduct
      let classesToDeduct = selectedSlots.length;
      const { data: payments } = await supabase
        .from("payments")
        .select("id, classes_remaining")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .gt("classes_remaining", 0)
        .order("created_at", { ascending: true });

      for (const payment of payments ?? []) {
        if (classesToDeduct <= 0) break;
        const deduct = Math.min(classesToDeduct, payment.classes_remaining);
        await supabase
          .from("payments")
          .update({ classes_remaining: payment.classes_remaining - deduct })
          .eq("id", payment.id);
        classesToDeduct -= deduct;
      }
    },
    onSuccess: () => {
      toast({ title: "¡Clase reservada!", description: "Tu reserva se ha confirmado correctamente." });
      setSelectedSlots([]);
      queryClient.invalidateQueries({ queryKey: ["taken-slots"] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["class-balance"] });
    },
    onError: (err: Error) => {
      toast({ title: "Error al reservar", description: err.message, variant: "destructive" });
    },
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const booking = myBookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Reserva no encontrada");

      // Check 24h rule
      const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
      const hoursUntil = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursUntil < 24) throw new Error("Solo puedes cancelar con 24 horas de antelación");

      // Cancel booking
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);
      if (error) throw error;

      // Refund 1 class to the most recent payment
      const { data: payments } = await supabase
        .from("payments")
        .select("id, classes_remaining")
        .eq("user_id", user!.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1);

      if (payments && payments.length > 0) {
        await supabase
          .from("payments")
          .update({ classes_remaining: payments[0].classes_remaining + 1 })
          .eq("id", payments[0].id);
      }
    },
    onSuccess: () => {
      toast({ title: "Clase cancelada", description: "Se ha devuelto la clase a tu saldo." });
      setCancelBookingId(null);
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["class-balance"] });
      queryClient.invalidateQueries({ queryKey: ["taken-slots"] });
    },
    onError: (err: Error) => {
      toast({ title: "Error al cancelar", description: err.message, variant: "destructive" });
      setCancelBookingId(null);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const canCancel = (booking: typeof myBookings[0]) => {
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    return (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60) >= 24;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary-foreground hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <span className="font-bold font-['Space_Grotesk']">AutoescuelaGO</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="bg-primary-foreground/20 px-3 py-1 rounded-full font-medium">
              Saldo: {balance} {balance === 1 ? "clase" : "clases"}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Mis Reservas</h1>
          <p className="text-muted-foreground mb-8">Reserva tus clases prácticas</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: Booking flow */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Choose teacher */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> 1. Elige tu profesor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {TEACHERS.map((t) => (
                    <Button
                      key={t.id}
                      variant={selectedTeacherName === t.name ? "default" : "outline"}
                      className="h-auto py-3 flex flex-col gap-1"
                      onClick={() => {
                        setSelectedTeacherName(t.name);
                        setSelectedDate(undefined);
                        setSelectedSlots([]);
                      }}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm font-medium">{t.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Choose date */}
            <AnimatePresence>
              {selectedTeacherName && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-primary" /> 2. Elige el día
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setSelectedSlots([]);
                        }}
                        locale={es}
                        disabled={(date) => {
                          const day = date.getDay();
                          return day === 0 || day === 6 || isBefore(startOfDay(date), startOfDay(new Date()));
                        }}
                        className="p-3 pointer-events-auto"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Choose time */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" /> 3. Elige la hora
                        <span className="ml-auto text-sm font-normal text-muted-foreground">
                          {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {availableSlots.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No hay horas disponibles para este día</p>
                      ) : (
                        <>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
                            {availableSlots.map((slot) => {
                              const isSelected = selectedSlots.includes(slot.start);
                              return (
                                <Button
                                  key={slot.start}
                                  variant={isSelected ? "default" : "outline"}
                                  size="sm"
                                  className="text-sm"
                                  onClick={() => handleSlotToggle(slot.start)}
                                >
                                  {slot.start} - {slot.end}
                                </Button>
                              );
                            })}
                          </div>
                          {selectedSlots.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-accent">
                              <div>
                                <p className="font-medium">
                                  {selectedSlots.length} {selectedSlots.length === 1 ? "clase" : "clases"} seleccionada{selectedSlots.length > 1 ? "s" : ""}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedSlots.map((s) => {
                                    const slot = ALL_SLOTS.find((sl) => sl.start === s)!;
                                    return `${slot.start}-${slot.end}`;
                                  }).join(", ")}
                                </p>
                              </div>
                              <Button
                                onClick={() => bookMutation.mutate()}
                                disabled={bookMutation.isPending || balance < selectedSlots.length}
                              >
                                {balance < selectedSlots.length ? "Saldo insuficiente" : bookMutation.isPending ? "Reservando..." : "Confirmar reserva"}
                              </Button>
                            </motion.div>
                          )}
                          {balance < 1 && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                              <AlertTriangle className="w-4 h-4" />
                              <span>No tienes clases disponibles. <Link to="/pagos" className="underline font-medium">Compra clases aquí</Link></span>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Upcoming bookings */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Próximas clases
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myBookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No tienes clases reservadas</p>
                ) : (
                  <div className="space-y-3">
                    {myBookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-xl border border-border bg-card flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-sm">
                            {format(new Date(booking.booking_date + "T00:00:00"), "EEEE d MMM", { locale: es })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)} · {booking.notes || "Profesor"}
                          </p>
                        </div>
                        {canCancel(booking) ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setCancelBookingId(booking.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground shrink-0">No cancelable</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Cancel dialog */}
      <AlertDialog open={!!cancelBookingId} onOpenChange={() => setCancelBookingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar esta clase?</AlertDialogTitle>
            <AlertDialogDescription>
              Se devolverá la clase a tu saldo disponible. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelBookingId && cancelMutation.mutate(cancelBookingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelMutation.isPending ? "Cancelando..." : "Cancelar clase"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
