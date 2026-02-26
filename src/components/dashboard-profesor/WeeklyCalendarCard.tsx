import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { addDays, startOfWeek, format, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays, User, Lock, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WeeklyCalendarCardProps {
  teacherId: string;
  teacherName: string;
  classCountMap?: Map<string, number>;
}

// 45-min slots from 9:00 to 20:00
const HOURS = (() => {
  const slots: { start: string; end: string; label: string }[] = [];
  let h = 9, m = 0;
  while (true) {
    const sH = String(h).padStart(2, "0");
    const sM = String(m).padStart(2, "0");
    let eM = m + 45, eH = h;
    if (eM >= 60) { eH++; eM -= 60; }
    if (eH > 20 || (eH === 20 && eM > 0)) break;
    const eHs = String(eH).padStart(2, "0");
    const eMs = String(eM).padStart(2, "0");
    slots.push({ start: `${sH}:${sM}`, end: `${eHs}:${eMs}`, label: `${sH}:${sM}` });
    h = eH; m = eM;
  }
  return slots;
})();

export default function WeeklyCalendarCard({ teacherId, teacherName, classCountMap }: WeeklyCalendarCardProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    return addDays(base, weekOffset * 7);
  }, [weekOffset]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)); // Mon-Fri
  }, [weekStart]);

  const dateRange = {
    from: format(weekDays[0], "yyyy-MM-dd"),
    to: format(weekDays[4], "yyyy-MM-dd"),
  };

  // Fetch bookings for this week
  const { data: bookings = [] } = useQuery({
    queryKey: ["teacher-week-bookings", teacherId, dateRange.from, dateRange.to],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("notes", teacherName)
        .gte("booking_date", dateRange.from)
        .lte("booking_date", dateRange.to)
        .in("status", ["confirmed", "pending"]);
      return data ?? [];
    },
  });

  // Fetch blocked slots for this week
  const { data: blockedSlots = [] } = useQuery({
    queryKey: ["teacher-week-blocks", teacherId, dateRange.from, dateRange.to],
    queryFn: async () => {
      const { data } = await supabase
        .from("teacher_blocked_slots")
        .select("*")
        .eq("teacher_id", teacherId)
        .gte("blocked_date", dateRange.from)
        .lte("blocked_date", dateRange.to);
      return data ?? [];
    },
  });

  // Fetch student names
  const studentIds = [...new Set(bookings.map((b) => b.student_id))];
  const { data: students = [] } = useQuery({
    queryKey: ["calendar-students", studentIds],
    queryFn: async () => {
      if (!studentIds.length) return [];
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", studentIds);
      return data ?? [];
    },
    enabled: studentIds.length > 0,
  });

  const studentsMap = new Map(students.map((s) => [s.user_id, s.full_name]));

  const getSlotState = (day: Date, slotStart: string) => {
    const dayStr = format(day, "yyyy-MM-dd");

    const booking = bookings.find(
      (b) => b.booking_date === dayStr && b.start_time?.slice(0, 5) === slotStart
    );
    if (booking) {
      return {
        type: "booked" as const,
        studentName: studentsMap.get(booking.student_id) || "Alumno",
        studentId: booking.student_id,
        classCount: classCountMap?.get(booking.student_id) || 0,
      };
    }

    const blocked = blockedSlots.find(
      (bs) => bs.blocked_date === dayStr && bs.start_time?.slice(0, 5) === slotStart
    );
    if (blocked) {
      return {
        type: "blocked" as const,
        reason: blocked.reason || "Bloqueado",
      };
    }

    return { type: "free" as const };
  };

  const weekLabel = `${format(weekDays[0], "d MMM", { locale: es })} – ${format(weekDays[4], "d MMM yyyy", { locale: es })}`;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Calendario semanal
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setWeekOffset((w) => w - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-medium min-w-[160px] justify-center"
              onClick={() => setWeekOffset(0)}
            >
              {weekLabel}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setWeekOffset((w) => w + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/40" />
            Clase reservada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-destructive/15 border border-destructive/30" />
            Bloqueado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-muted border border-border" />
            Libre
          </span>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <TooltipProvider delayDuration={200}>
          <div className="min-w-[640px]">
            {/* Day headers */}
            <div className="grid grid-cols-[60px_repeat(5,1fr)] gap-px mb-px">
              <div className="h-10" />
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "h-10 flex flex-col items-center justify-center rounded-t-lg text-xs font-medium",
                    isToday(day)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground"
                  )}
                >
                  <span className="uppercase tracking-wide text-[10px]">
                    {format(day, "EEE", { locale: es })}
                  </span>
                  <span className="font-semibold text-sm leading-none">
                    {format(day, "d")}
                  </span>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="grid grid-cols-[60px_repeat(5,1fr)] gap-px bg-border/40">
              {HOURS.map((slot) => (
                <>
                  {/* Time label */}
                  <div
                    key={`label-${slot.start}`}
                    className="h-11 flex items-center justify-end pr-2 text-[11px] text-muted-foreground font-medium bg-background"
                  >
                    {slot.label}
                  </div>

                  {/* Day cells */}
                  {weekDays.map((day) => {
                    const state = getSlotState(day, slot.start);
                    const isPast =
                      day < new Date(new Date().toDateString()) ||
                      (isToday(day) &&
                        (() => {
                          const [h, m] = slot.start.split(":").map(Number);
                          const slotTime = new Date();
                          slotTime.setHours(h, m, 0, 0);
                          return slotTime < new Date();
                        })());

                    return (
                      <Tooltip key={`${day.toISOString()}-${slot.start}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "h-11 flex items-center justify-center text-[11px] font-medium transition-colors cursor-default",
                              isPast && "opacity-40",
                              state.type === "booked" &&
                                "bg-primary/15 text-primary border-l-2 border-l-primary",
                              state.type === "blocked" &&
                                "bg-destructive/10 text-destructive/70 border-l-2 border-l-destructive/40",
                              state.type === "free" && "bg-background hover:bg-muted/40"
                            )}
                          >
                            {state.type === "booked" && (
                              <span className="flex items-center gap-1 truncate px-1">
                                <User className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {state.studentName}
                                </span>
                              </span>
                            )}
                            {state.type === "blocked" && (
                              <Lock className="w-3 h-3" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <p className="font-semibold">
                            {slot.start} - {slot.end}
                          </p>
                          {state.type === "booked" && (
                            <div className="text-primary space-y-0.5">
                              <p>🎓 {state.studentName}</p>
                              <p className="flex items-center gap-1 text-muted-foreground">
                                <GraduationCap className="w-3 h-3" />
                                {state.classCount} {state.classCount === 1 ? "clase" : "clases"} en total
                              </p>
                            </div>
                          )}
                          {state.type === "blocked" && (
                            <p className="text-destructive">
                              🔒 {state.type === "blocked" ? (state as any).reason : ""}
                            </p>
                          )}
                          {state.type === "free" && (
                            <p className="text-muted-foreground">Disponible</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
