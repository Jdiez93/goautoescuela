import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CalendarCheck, Users, Clock, Sunrise, Sun, Sunset } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  student_id: string;
  status: string;
}

interface DailySummaryCardProps {
  bookings: Booking[];
  studentsMap: Map<string, { full_name: string; phone?: string | null }>;
}

export default function DailySummaryCard({ bookings, studentsMap }: DailySummaryCardProps) {
  const today = format(new Date(), "yyyy-MM-dd");
  const todayFormatted = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  const todayBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.booking_date === today)
        .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [bookings, today]
  );

  const uniqueStudents = useMemo(
    () => new Set(todayBookings.map((b) => b.student_id)).size,
    [todayBookings]
  );

  const nextClass = useMemo(() => {
    const now = new Date();
    return todayBookings.find((b) => {
      const [h, m] = b.start_time.split(":").map(Number);
      const classTime = new Date();
      classTime.setHours(h, m, 0, 0);
      return classTime > now;
    });
  }, [todayBookings]);

  const totalMinutes = todayBookings.length * 45;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 13) return { text: "Buenos días", icon: Sunrise };
    if (h < 20) return { text: "Buenas tardes", icon: Sun };
    return { text: "Buenas noches", icon: Sunset };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // Stagger children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 60 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 }}
    >
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/10 overflow-hidden relative">
        {/* Decorative accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-accent" />

        <CardContent className="p-5 pt-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mb-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.3 }}
              >
                <CalendarCheck className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                Resumen del día
              </span>
            </div>
            <p className="text-sm text-muted-foreground capitalize flex items-center gap-1.5">
              <GreetingIcon className="w-3.5 h-3.5 text-primary/60" />
              {todayFormatted}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {/* Total classes */}
            <motion.div variants={item} className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <CalendarCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-none">{todayBookings.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {todayBookings.length === 1 ? "clase hoy" : "clases hoy"}
                </p>
              </div>
            </motion.div>

            {/* Unique students */}
            <motion.div variants={item} className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-accent/40">
              <div className="w-10 h-10 rounded-full bg-accent/40 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-accent-foreground/70" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-none">{uniqueStudents}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {uniqueStudents === 1 ? "alumno" : "alumnos"} distintos
                </p>
              </div>
            </motion.div>

            {/* Total time */}
            <motion.div variants={item} className="flex items-center gap-3 p-3 rounded-lg bg-muted/60 border border-border">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-none">
                  {hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ""}` : `${mins}m`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">de clase en total</p>
              </div>
            </motion.div>

            {/* Next class */}
            {nextClass && (
              <motion.div
                variants={item}
                className="p-3 rounded-lg bg-primary/5 border border-dashed border-primary/30"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                  Próxima clase
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {nextClass.start_time.slice(0, 5)} – {nextClass.end_time.slice(0, 5)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  con {studentsMap.get(nextClass.student_id)?.full_name || "Alumno"}
                </p>
              </motion.div>
            )}

            {/* No classes message */}
            {todayBookings.length === 0 && (
              <motion.div variants={item} className="text-center py-3">
                <p className="text-sm text-muted-foreground">🎉 ¡Día libre!</p>
                <p className="text-xs text-muted-foreground/60 mt-1">No tienes clases programadas hoy</p>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
