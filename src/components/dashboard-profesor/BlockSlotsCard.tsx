import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Lock, Unlock, CalendarDays, Clock, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isBefore, startOfDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Same 45-min slots used in Reservas
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
    hour = endHour; min = endMin;
  }
  return slots;
})();

interface Props {
  teacherId: string;
}

export default function BlockSlotsCard({ teacherId }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [reason, setReason] = useState("");

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  // Fetch existing blocked slots for selected date
  const { data: blockedSlots = [], isLoading: blockedLoading } = useQuery({
    queryKey: ["teacher-blocked-slots", teacherId, dateStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teacher_blocked_slots")
        .select("*")
        .eq("teacher_id", teacherId)
        .eq("blocked_date", dateStr!);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!dateStr,
  });

  // Fetch existing bookings on that date for this teacher (to show them as taken)
  const { data: bookedSlots = [] } = useQuery({
    queryKey: ["teacher-booked-on-date", teacherId, dateStr],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("start_time")
        .eq("teacher_id", teacherId)
        .eq("booking_date", dateStr!)
        .in("status", ["confirmed", "pending"]);
      return (data ?? []).map((b) => b.start_time.slice(0, 5));
    },
    enabled: !!dateStr,
  });

  const blockedStarts = blockedSlots.map((b) => b.start_time.slice(0, 5));

  // Visible slots (exclude past slots if today)
  const visibleSlots = useMemo(() => {
    if (!selectedDate) return [];
    return ALL_SLOTS.filter((slot) => {
      if (isToday(selectedDate)) {
        const [h, m] = slot.start.split(":").map(Number);
        const slotTime = new Date(selectedDate);
        slotTime.setHours(h, m, 0, 0);
        if (isBefore(slotTime, new Date())) return false;
      }
      return true;
    });
  }, [selectedDate]);

  const handleSlotToggle = (start: string) => {
    if (blockedStarts.includes(start) || bookedSlots.includes(start)) return;
    setSelectedSlots((prev) =>
      prev.includes(start) ? prev.filter((s) => s !== start) : [...prev, start]
    );
  };

  const selectAll = () => {
    const available = visibleSlots
      .filter((s) => !blockedStarts.includes(s.start) && !bookedSlots.includes(s.start))
      .map((s) => s.start);
    setSelectedSlots(available);
  };

  // Block mutation
  const blockMutation = useMutation({
    mutationFn: async () => {
      if (!dateStr || selectedSlots.length === 0) throw new Error("Selecciona horas");
      const rows = selectedSlots.map((startTime) => {
        const slot = ALL_SLOTS.find((s) => s.start === startTime)!;
        return {
          teacher_id: teacherId,
          blocked_date: dateStr,
          start_time: slot.start,
          end_time: slot.end,
          reason: reason.trim() || "Bloqueado por profesor",
        };
      });
      const { error } = await supabase.from("teacher_blocked_slots").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Horas bloqueadas", description: `Se han bloqueado ${selectedSlots.length} hora(s) para el ${format(selectedDate!, "d 'de' MMMM", { locale: es })}.` });
      setSelectedSlots([]);
      setReason("");
      queryClient.invalidateQueries({ queryKey: ["teacher-blocked-slots"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-week-blocks"] });
    },
    onError: (err: Error) => {
      toast({ title: "Error al bloquear", description: err.message, variant: "destructive" });
    },
  });

  // Unblock mutation
  const unblockMutation = useMutation({
    mutationFn: async (slotId: string) => {
      const { error } = await supabase.from("teacher_blocked_slots").delete().eq("id", slotId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Hora desbloqueada" });
      queryClient.invalidateQueries({ queryKey: ["teacher-blocked-slots"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-week-blocks"] });
    },
  });

  const isPastDate = (date: Date) => isBefore(date, startOfDay(new Date()));

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Bloquear horas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecciona un día y las horas que no podrás dar clase. Los alumnos las verán como no disponibles.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-primary" /> Selecciona día
            </label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => { setSelectedDate(d); setSelectedSlots([]); }}
              disabled={(date) => isPastDate(date) || date.getDay() === 0 || date.getDay() === 6}
              locale={es}
              className="rounded-md border pointer-events-auto"
            />
          </div>

          {/* Slots */}
          <div>
            {selectedDate ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    Horas del {format(selectedDate, "d 'de' MMMM", { locale: es })}
                  </label>
                  <Button variant="outline" size="sm" onClick={selectAll} className="text-xs">
                    Seleccionar todas
                  </Button>
                </div>

                {blockedLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : visibleSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No hay horas disponibles para este día</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
                    {visibleSlots.map((slot) => {
                      const isBlocked = blockedStarts.includes(slot.start);
                      const isBooked = bookedSlots.includes(slot.start);
                      const isSelected = selectedSlots.includes(slot.start);
                      const blockedEntry = blockedSlots.find((b) => b.start_time.slice(0, 5) === slot.start);

                      return (
                        <div key={slot.start} className="relative">
                          <button
                            onClick={() => {
                              if (isBlocked && blockedEntry) {
                                unblockMutation.mutate(blockedEntry.id);
                              } else {
                                handleSlotToggle(slot.start);
                              }
                            }}
                            disabled={isBooked}
                            className={cn(
                              "w-full text-sm font-medium rounded-lg px-3 py-2.5 transition-all border flex items-center justify-between gap-1",
                              isBooked && "bg-muted text-muted-foreground border-border cursor-not-allowed line-through opacity-60",
                              isBlocked && "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20",
                              isSelected && !isBlocked && !isBooked && "bg-primary text-primary-foreground border-primary shadow-sm",
                              !isBlocked && !isBooked && !isSelected && "bg-background hover:bg-accent border-border hover:border-primary/40"
                            )}
                          >
                            <span>{slot.start} - {slot.end}</span>
                            {isBlocked && <Lock className="w-3.5 h-3.5" />}
                            {isBooked && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Reservada</Badge>}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reason + Block button */}
                <AnimatePresence>
                  {selectedSlots.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3"
                    >
                      <Input
                        placeholder="Motivo (opcional): ej. Exámenes prácticos"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                      <Button
                        className="w-full"
                        disabled={blockMutation.isPending}
                        onClick={() => blockMutation.mutate()}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {blockMutation.isPending
                          ? "Bloqueando..."
                          : `Bloquear ${selectedSlots.length} hora(s)`}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-destructive/20 border border-destructive/30" /> Bloqueada (clic para desbloquear)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-muted border border-border" /> Reservada por alumno
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-primary" /> Seleccionada
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 text-muted-foreground">
                <CalendarDays className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">Selecciona un día en el calendario para ver las horas</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
