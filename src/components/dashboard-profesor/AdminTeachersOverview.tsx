import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Users } from "lucide-react";
import WeeklyCalendarCard from "./WeeklyCalendarCard";

// Names used everywhere in the app to identify teachers (must match bookings.notes)
const TEACHERS = [
  { name: "Valentín", initial: "V" },
  { name: "Miguel", initial: "M" },
  { name: "Natalia", initial: "N" },
];

interface AdminTeachersOverviewProps {
  currentUserName: string;
}

export default function AdminTeachersOverview({ currentUserName }: AdminTeachersOverviewProps) {
  // Show all teachers in tabs (including the current one for completeness)
  const teachers = useMemo(() => TEACHERS, []);
  const [active, setActive] = useState(teachers[0]?.name ?? "");

  // Resolve teacher_id (auth user id) by full_name, so we can also fetch their blocked slots
  const teacherNames = teachers.map((t) => t.name);
  const { data: teacherProfiles, isLoading } = useQuery({
    queryKey: ["admin-teacher-profiles", teacherNames],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("full_name", teacherNames);
      return data ?? [];
    },
  });

  const profileByName = new Map(
    (teacherProfiles ?? []).map((p) => [p.full_name, p.user_id])
  );

  // Aggregate counts per student across all of THIS teacher's bookings (best-effort);
  // pass undefined to fall back to 0 inside the calendar card.
  const classCountMap = undefined;

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/[0.04] to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Vista de administración — Calendarios del equipo
          </CardTitle>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            {teachers.length} profesores
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Como jefe de la autoescuela puedes consultar las clases reservadas y los horarios bloqueados de cada profesor.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[420px] w-full rounded-lg" />
        ) : (
          <Tabs value={active} onValueChange={setActive} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-4">
              {teachers.map((t) => (
                <TabsTrigger key={t.name} value={t.name}>
                  {t.name}
                  {t.name === currentUserName && (
                    <span className="ml-1.5 text-[10px] uppercase text-primary/70">tú</span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            {teachers.map((t) => {
              const teacherId = profileByName.get(t.name);
              return (
                <TabsContent key={t.name} value={t.name} className="mt-0">
                  {teacherId ? (
                    <WeeklyCalendarCard
                      teacherId={teacherId}
                      teacherName={t.name}
                      classCountMap={classCountMap}
                    />
                  ) : (
                    <div className="text-center py-12 text-sm text-muted-foreground border border-dashed rounded-lg">
                      No se ha encontrado el perfil de <strong>{t.name}</strong> en la base de datos.
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
