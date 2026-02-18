import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Link, Navigate } from "react-router-dom";
import { Car, ArrowLeft, Clock, User, CalendarDays, X, AlertTriangle, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isBefore, startOfDay, isToday } from "date-fns";
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
  { name: "Valentín", id: "valentin", avatar: "V" },
  { name: "Joaquín", id: "joaquin", avatar: "J" },
  { name: "Profesora", id: "profesora", avatar: "P" },
];

const stepVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } },
};

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
        .rpc("get_taken_slots", {
          _booking_date: dateStr!,
          _teacher_name: selectedTeacherName!,
        });
      return (data ?? []).map((b: { start_time: string }) => b.start_time.slice(0, 5));
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

  // Visible slots for selected date (includes taken ones, excludes past)
  const visibleSlots = useMemo(() => {
    if (!selectedDate) return [];
    const now = new Date();
    return ALL_SLOTS.filter((slot) => {
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

      // Re-check availability to prevent race conditions
      const dateFormatted = format(selectedDate, "yyyy-MM-dd");
      const { data: freshTaken } = await supabase.rpc("get_taken_slots", {
        _booking_date: dateFormatted,
        _teacher_name: selectedTeacherName,
      });
      const freshTakenStarts = (freshTaken ?? []).map((b: { start_time: string }) => b.start_time.slice(0, 5));
      const conflict = selectedSlots.find((s) => freshTakenStarts.includes(s));
      if (conflict) {
        queryClient.invalidateQueries({ queryKey: ["taken-slots"] });
        throw new Error("Alguna de las horas seleccionadas ya ha sido reservada por otro alumno. Selecciona otra hora.");
      }

      const bookings = selectedSlots.map((startTime) => {
        const slot = ALL_SLOTS.find((s) => s.start === startTime)!;
        return {
          student_id: user.id,
          teacher_id: user.id,
          booking_date: dateFormatted,
          start_time: slot.start,
          end_time: slot.end,
          status: "confirmed",
          notes: selectedTeacherName,
        };
      });

      const { error: bookError } = await supabase.from("bookings").insert(bookings);
      if (bookError) throw bookError;

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

      const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
      const hoursUntil = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursUntil < 24) throw new Error("Solo puedes cancelar con 24 horas de antelación");

      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);
      if (error) throw error;

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const canCancel = (booking: typeof myBookings[0]) => {
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    return (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60) >= 24;
  };

  const currentStep = !selectedTeacherName ? 1 : !selectedDate ? 2 : 3;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(215_80%_60%_/_0.3),_transparent_50%)]" />
        <div className="container mx-auto px-4 flex items-center justify-between h-16 relative z-10">
          <Link to="/dashboard" className="flex items-center gap-3 text-primary-foreground hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <span className="font-bold font-['Space_Grotesk'] text-lg">AutoescuelaGO</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/15 backdrop-blur-sm px-4 py-2 rounded-xl border border-primary-foreground/10">
              <span className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {balance} {balance === 1 ? "clase" : "clases"} disponibles
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk']">Reservar Clase</h1>
              <p className="text-muted-foreground text-sm">Sigue los pasos para reservar tu próxima clase práctica</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-6">
            {[
              { num: 1, label: "Profesor" },
              { num: 2, label: "Fecha" },
              { num: 3, label: "Hora" },
            ].map((step, i) => (
              <div key={step.num} className="flex items-center gap-2">
                {i > 0 && (
                  <div className={cn(
                    "w-8 h-[2px] rounded-full transition-colors duration-300",
                    currentStep > i ? "bg-primary" : "bg-border"
                  )} />
                )}
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
                  currentStep === step.num && "bg-primary text-primary-foreground shadow-md",
                  currentStep > step.num && "bg-primary/15 text-primary",
                  currentStep < step.num && "bg-muted text-muted-foreground"
                )}>
                  <span className="w-5 h-5 rounded-full bg-current/10 flex items-center justify-center text-[10px] font-bold">
                    {currentStep > step.num ? "✓" : step.num}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: Booking flow */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Choose teacher */}
            <motion.div variants={stepVariants} initial="hidden" animate="visible">
              <Card className="shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-shadow duration-300 overflow-hidden">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-3 font-['Space_Grotesk']">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    Elige tu profesor
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="grid grid-cols-3 gap-4">
                    {TEACHERS.map((t) => {
                      const isActive = selectedTeacherName === t.name;
                      return (
                        <button
                          key={t.id}
                          className={cn(
                            "group relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                            isActive
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-border hover:border-primary/40 hover:bg-accent/50"
                          )}
                          onClick={() => {
                            setSelectedTeacherName(t.name);
                            setSelectedDate(undefined);
                            setSelectedSlots([]);
                          }}
                        >
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold font-['Space_Grotesk'] transition-all duration-300",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          )}>
                            {t.avatar}
                          </div>
                          <span className={cn(
                            "text-sm font-semibold transition-colors",
                            isActive ? "text-primary" : "text-foreground"
                          )}>
                            {t.name}
                          </span>
                          {isActive && (
                            <motion.div
                              layoutId="teacher-check"
                              className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 2: Choose date */}
            <AnimatePresence mode="wait">
              {selectedTeacherName && (
                <motion.div variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                  <Card className="shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-shadow duration-300 overflow-hidden">
                    <CardHeader className="pb-4 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-3 font-['Space_Grotesk']">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CalendarDays className="w-4 h-4 text-primary" />
                        </div>
                        Elige el día
                        <span className="ml-auto text-xs font-normal text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          con {selectedTeacherName}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 flex justify-center">
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
            <AnimatePresence mode="wait">
              {selectedDate && (
                <motion.div variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                  <Card className="shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-shadow duration-300 overflow-hidden">
                    <CardHeader className="pb-4 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-3 font-['Space_Grotesk']">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        Elige la hora
                        <span className="ml-auto text-xs font-normal text-muted-foreground bg-muted px-3 py-1 rounded-full capitalize">
                          {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5">
                      {visibleSlots.length === 0 ? (
                        <div className="text-center py-8">
                          <CalendarDays className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                          <p className="text-muted-foreground font-medium">No hay horas disponibles</p>
                          <p className="text-muted-foreground/60 text-sm mt-1">Prueba con otro día</p>
                        </div>
                      ) : (
                        <>
                          {/* Legend */}
                          <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded border-2 border-border" />
                              <span>Disponible</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded bg-primary" />
                              <span>Seleccionada</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded bg-destructive/80" />
                              <span>Ocupada</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-5">
                            {visibleSlots.map((slot) => {
                              const isTaken = takenSlots.includes(slot.start);
                              const isSelected = selectedSlots.includes(slot.start);
                              return (
                                <motion.div key={slot.start} whileHover={!isTaken ? { scale: 1.03 } : {}} whileTap={!isTaken ? { scale: 0.97 } : {}}>
                                  <Button
                                    variant={isSelected ? "default" : isTaken ? "destructive" : "outline"}
                                    size="sm"
                                    disabled={isTaken}
                                    className={cn(
                                      "w-full text-sm font-medium transition-all duration-200 h-10",
                                      isTaken && "opacity-60 cursor-not-allowed line-through",
                                      !isTaken && !isSelected && "hover:border-primary hover:text-primary hover:bg-primary/5",
                                      isSelected && "shadow-md"
                                    )}
                                    onClick={() => !isTaken && handleSlotToggle(slot.start)}
                                  >
                                    {slot.start} - {slot.end}
                                  </Button>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Confirm section */}
                          <AnimatePresence>
                            {selectedSlots.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="p-5 rounded-2xl bg-primary/5 border border-primary/20"
                              >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                  <div>
                                    <p className="font-semibold text-foreground flex items-center gap-2">
                                      <CheckCircle2 className="w-4 h-4 text-primary" />
                                      {selectedSlots.length} {selectedSlots.length === 1 ? "clase seleccionada" : "clases seleccionadas"}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {selectedSlots.map((s) => {
                                        const slot = ALL_SLOTS.find((sl) => sl.start === s)!;
                                        return `${slot.start} - ${slot.end}`;
                                      }).join("  ·  ")}
                                      {" · "}{selectedTeacherName}
                                    </p>
                                  </div>
                                  <Button
                                    size="lg"
                                    className="shadow-lg font-semibold"
                                    onClick={() => bookMutation.mutate()}
                                    disabled={bookMutation.isPending || balance < selectedSlots.length}
                                  >
                                    {balance < selectedSlots.length
                                      ? "Saldo insuficiente"
                                      : bookMutation.isPending
                                        ? "Reservando..."
                                        : "Confirmar reserva"}
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {balance < 1 && (
                            <div className="mt-4 flex items-center gap-2 text-sm p-3 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              <span>No tienes clases disponibles. <Link to="/pagos" className="underline font-semibold hover:opacity-80">Compra clases aquí</Link></span>
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
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <Card className="shadow-[var(--card-shadow)] overflow-hidden sticky top-8">
                <CardHeader className="pb-4 border-b border-border/50 bg-accent/30">
                  <CardTitle className="text-lg flex items-center gap-3 font-['Space_Grotesk']">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    Próximas clases
                    {myBookings.length > 0 && (
                      <span className="ml-auto text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                        {myBookings.length}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {myBookings.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                        <CalendarDays className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">Sin clases reservadas</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">¡Reserva tu primera clase!</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {myBookings.map((booking, i) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="group p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-200 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/8 flex flex-col items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-primary uppercase leading-none">
                                {format(new Date(booking.booking_date + "T00:00:00"), "MMM", { locale: es })}
                              </span>
                              <span className="text-sm font-bold text-primary leading-tight">
                                {format(new Date(booking.booking_date + "T00:00:00"), "d")}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm capitalize">
                                {format(new Date(booking.booking_date + "T00:00:00"), "EEEE", { locale: es })}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)} · {booking.notes || "Profesor"}
                              </p>
                            </div>
                          </div>
                          {canCancel(booking) ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setCancelBookingId(booking.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/60 shrink-0 bg-muted px-2 py-1 rounded-full">No cancelable</span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Cancel dialog */}
      <AlertDialog open={!!cancelBookingId} onOpenChange={() => setCancelBookingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-['Space_Grotesk']">¿Cancelar esta clase?</AlertDialogTitle>
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
