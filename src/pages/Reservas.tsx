import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, User, CalendarDays, X, AlertTriangle, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { format, isBefore, startOfDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import logoReady2Go from "@/assets/logo-ready2go-oficial.png";
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
  let hour = 8, min = 0;
  while (true) {
    const startH = String(hour).padStart(2, "0");
    const startM = String(min).padStart(2, "0");
    let endMin = min + 45;
    let endHour = hour;
    if (endMin >= 60) { endHour++; endMin -= 60; }
    if (endHour > 22 || (endHour === 22 && endMin > 0)) break;
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
  { name: "Natalia", id: "natalia", avatar: "N" },
];

const stepVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { type: "spring" as const, stiffness: 250, damping: 22 } },
  exit: { opacity: 0, y: -15, scale: 0.96, filter: "blur(4px)", transition: { duration: 0.25, ease: "easeIn" as const } },
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
} as const;

const listItemVariants = {
  hidden: { opacity: 0, x: 20, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function Reservas() {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedTeacherName, setSelectedTeacherName] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

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

  // Get student's bookings (upcoming + past completed)
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: allBookings = [] } = useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("student_id", user!.id)
        .in("status", ["confirmed", "pending"])
        .order("booking_date", { ascending: true })
        .order("start_time", { ascending: true });
      return data ?? [];
    },
    enabled: !!user,
  });

  // Split bookings into upcoming and completed based on end time
  const now = new Date();
  const myBookings = allBookings.filter((b) => {
    const endDateTime = new Date(`${b.booking_date}T${b.end_time}`);
    return endDateTime > now;
  });
  const completedBookings = allBookings
    .filter((b) => {
      const endDateTime = new Date(`${b.booking_date}T${b.end_time}`);
      return endDateTime <= now;
    })
    .sort((a, b) => {
      // Most recent first
      const dateA = new Date(`${a.booking_date}T${a.end_time}`);
      const dateB = new Date(`${b.booking_date}T${b.end_time}`);
      return dateB.getTime() - dateA.getTime();
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

      // Deduct classes via secure server-side function
      const { error: deductError } = await supabase.rpc("deduct_classes", {
        _user_id: user.id,
        _num_classes: selectedSlots.length,
      });
      if (deductError) throw new Error(deductError.message);
    },
    onSuccess: () => {
      toast({ title: "¡Clase reservada!", description: "Tu reserva se ha confirmado correctamente." });

      // Create notification
      const dateFormatted = format(selectedDate!, "dd/MM/yyyy");
      const slotsStr = selectedSlots.map((s) => s).join(" y ");
      supabase.from("notifications").insert({
        user_id: user!.id,
        type: "booking_confirmed",
        message: `Clase confirmada el ${dateFormatted} a las ${slotsStr} con ${selectedTeacherName}`,
      }).then(() => queryClient.invalidateQueries({ queryKey: ["notifications"] }));

      // Send confirmation email to student AND teacher (fire & forget)
      const slotsData = selectedSlots.map((startTime) => {
        const slot = ALL_SLOTS.find((s) => s.start === startTime)!;
        return { start: slot.start, end: slot.end };
      });
      // Fetch teacher email from profiles
      (async () => {
        try {
          const { data: teacherProfile } = await supabase
            .from("profiles")
            .select("email")
            .eq("full_name", selectedTeacherName!)
            .limit(1)
            .single();
          await supabase.functions.invoke("send-booking-confirmation", {
            body: {
              studentName: profile?.full_name || "",
              studentEmail: profile?.email || user?.email || "",
              teacherName: selectedTeacherName,
              teacherEmail: teacherProfile?.email || "",
              bookingDate: format(selectedDate!, "yyyy-MM-dd"),
              slots: slotsData,
            },
          });
        } catch (err) {
          console.error("Email confirmation error:", err);
        }
      })();

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
        .update({ status: "cancelled", cancellation_reason: cancellationReason || null })
        .eq("id", bookingId);
      if (error) throw error;

      // Refund class via secure server-side function
      const { error: refundError } = await supabase.rpc("refund_class", {
        _user_id: user!.id,
      });
      if (refundError) throw new Error(refundError.message);
    },
    onSuccess: (_data, bookingId) => {
      toast({ title: "Clase cancelada", description: "Se ha devuelto la clase a tu saldo." });

      // Create notification
      const booking = myBookings.find((b) => b.id === bookingId);
      if (booking) {
        const dateFormatted = new Date(booking.booking_date).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
        supabase.from("notifications").insert({
          user_id: user!.id,
          type: "booking_cancelled_by_student",
          message: `Has cancelado tu clase del ${dateFormatted} a las ${booking.start_time.slice(0, 5)} con ${booking.notes || "tu profesor"}`,
        }).then(() => queryClient.invalidateQueries({ queryKey: ["notifications"] }));
      }

      // Send cancellation email to student AND teacher (fire & forget)
      if (booking) {
        const teacherNameForEmail = booking.notes || "";
        (async () => {
          try {
            const { data: teacherProfile } = await supabase
              .from("profiles")
              .select("email")
              .eq("full_name", teacherNameForEmail)
              .limit(1)
              .single();
            await supabase.functions.invoke("send-cancellation-confirmation", {
              body: {
                studentName: profile?.full_name || "",
                studentEmail: profile?.email || user?.email || "",
                teacherName: teacherNameForEmail,
                teacherEmail: teacherProfile?.email || "",
                bookingDate: booking.booking_date,
                slots: [{ start: booking.start_time.slice(0, 5), end: booking.end_time.slice(0, 5) }],
                cancellationReason: cancellationReason || null,
              },
            });
          } catch (err) {
            console.error("Cancellation email error:", err);
          }
        })();
      }

      setCancelBookingId(null);
      setCancellationReason("");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["class-balance"] });
      queryClient.invalidateQueries({ queryKey: ["taken-slots"] });
    },
    onError: (err: Error) => {
      toast({ title: "Error al cancelar", description: err.message, variant: "destructive" });
      setCancelBookingId(null);
      setCancellationReason("");
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
            <span className="font-bold font-['Space_Grotesk'] text-lg">Ready2Go</span>
          </Link>
          <div className="flex items-center gap-3">
            {profile?.full_name && (
              <div className="hidden sm:flex items-center gap-2.5 bg-background/90 backdrop-blur-sm shadow-sm border border-border/60 rounded-full px-3.5 py-1.5">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-sm">
                  {profile.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-foreground/80">{profile.full_name}</span>
              </div>
            )}
            <div className="bg-primary-foreground/15 backdrop-blur-sm px-4 py-2 rounded-xl border border-primary-foreground/10">
              <span className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {balance} {balance === 1 ? "clase" : "clases"} disponibles
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* User badge mobile */}
      {profile?.full_name && (
        <div className="sm:hidden container mx-auto px-4 pt-3 flex justify-end">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[9px] font-bold text-primary-foreground">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <span className="text-[11px] font-semibold text-primary">{profile.full_name}</span>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: "spring" as const, stiffness: 400, damping: 15 }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
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
                <motion.div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
                    currentStep === step.num && "bg-primary text-primary-foreground shadow-md",
                    currentStep > step.num && "bg-primary/15 text-primary",
                    currentStep < step.num && "bg-muted text-muted-foreground"
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 20, delay: 0.1 + i * 0.08 }}
                >
                  <span className="w-5 h-5 rounded-full bg-current/10 flex items-center justify-center text-[10px] font-bold">
                    {currentStep > step.num ? "✓" : step.num}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </motion.div>
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
                  <p className="text-destructive text-sm font-medium mt-1.5">¡POR FAVOR! Seleccione el profesor que te han asignado</p>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="grid grid-cols-3 gap-4">
                    {TEACHERS.map((t) => {
                      const isActive = selectedTeacherName === t.name;
                      return (
                        <motion.button
                          key={t.id}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring" as const, stiffness: 400, damping: 20 }}
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
                        </motion.button>
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
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 30, filter: "blur(6px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} transition={{ type: "spring" as const, stiffness: 200, damping: 22, delay: 0.2 }}>
              <Card className="shadow-[var(--card-shadow)] overflow-hidden sticky top-8">
                <CardHeader className="pb-4 border-b border-border/50 bg-accent/30">
                  <CardTitle className="text-lg flex items-center gap-3 font-['Space_Grotesk']">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-primary" />
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
                    <motion.div className="space-y-2.5" variants={listContainerVariants} initial="hidden" animate="visible">
                      {myBookings.map((booking) => (
                        <motion.div
                          key={booking.id}
                          variants={listItemVariants}
                          whileHover={{ x: 4, scale: 1.01 }}
                          transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
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
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Completed classes */}
            <motion.div initial={{ opacity: 0, x: 30, filter: "blur(6px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} transition={{ type: "spring" as const, stiffness: 200, damping: 22, delay: 0.35 }}>
              <Card className="shadow-[var(--card-shadow)] overflow-hidden border-border/60">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-3 font-['Space_Grotesk']">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-[18px] h-[18px] text-emerald-600" />
                    </div>
                    <div>
                      <span className="block">Clases realizadas</span>
                      <span className="text-xs font-normal text-muted-foreground">Historial de tus clases completadas</span>
                    </div>
                    {completedBookings.length > 0 && (
                      <span className="ml-auto text-xs font-semibold bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full">
                        {completedBookings.length} {completedBookings.length === 1 ? "clase" : "clases"}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  {completedBookings.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-6 h-6 text-muted-foreground/40" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">Aún no has completado clases</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Aquí aparecerán tus clases una vez finalizadas</p>
                    </div>
                  ) : (
                    <motion.div className="space-y-2" variants={listContainerVariants} initial="hidden" animate="visible">
                      {completedBookings.map((booking) => (
                        <motion.div
                          key={booking.id}
                          variants={listItemVariants}
                          whileHover={{ x: 4, scale: 1.01 }}
                          transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                          className="p-3.5 rounded-xl border border-emerald-500/15 bg-gradient-to-r from-emerald-500/[0.04] to-transparent hover:from-emerald-500/[0.07] flex items-center justify-between gap-3 transition-colors duration-200"
                        >
                          <div className="min-w-0 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex flex-col items-center justify-center shrink-0 border border-emerald-500/10">
                              <span className="text-[10px] font-bold text-emerald-600 uppercase leading-none">
                                {format(new Date(booking.booking_date + "T00:00:00"), "MMM", { locale: es })}
                              </span>
                              <span className="text-sm font-bold text-emerald-700 leading-tight">
                                {format(new Date(booking.booking_date + "T00:00:00"), "d")}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm capitalize text-foreground/85">
                                {format(new Date(booking.booking_date + "T00:00:00"), "EEEE d 'de' MMMM", { locale: es })}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <Clock className="w-3 h-3" />
                                {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                {booking.notes || "Profesor"}
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-600 shrink-0 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-emerald-500/10">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completada
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Cancel dialog */}
      <AlertDialog open={!!cancelBookingId} onOpenChange={(open) => { if (!open) { setCancelBookingId(null); setCancellationReason(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-['Space_Grotesk']">¿Cancelar esta clase?</AlertDialogTitle>
            <AlertDialogDescription>
              Se devolverá la clase a tu saldo disponible. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <label className="text-sm font-medium text-foreground mb-1.5 block">Motivo de cancelación (opcional)</label>
            <Textarea
              placeholder="Escribe el motivo por el que no puedes asistir..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
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
