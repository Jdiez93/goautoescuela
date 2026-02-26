import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Link, Navigate } from "react-router-dom";
import {
  Car,
  Calendar,
  User,
  LogOut,
  Shield,
  MapPin,
  Phone,
  Mail,
  Clock,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BlockSlotsCard from "@/components/dashboard-profesor/BlockSlotsCard";

export default function DashboardProfesor() {
  const { user, profile, role, loading, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cancelBooking, setCancelBooking] = useState<{
    id: string;
    studentName: string;
    date: string;
    time: string;
  } | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  // Fetch future bookings for this teacher
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["teacher-bookings", user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("teacher_id", user!.id)
        .gte("booking_date", today)
        .in("status", ["confirmed", "pending"])
        .order("booking_date", { ascending: true })
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && role === "teacher",
  });

  // Fetch student profiles to show names
  const studentIds = [...new Set(bookings?.map((b) => b.student_id) ?? [])];
  const { data: students } = useQuery({
    queryKey: ["teacher-students", studentIds],
    queryFn: async () => {
      if (studentIds.length === 0) return [];
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone, email")
        .in("user_id", studentIds);
      return data ?? [];
    },
    enabled: studentIds.length > 0,
  });

  const studentsMap = new Map(
    students?.map((s) => [s.user_id, s]) ?? []
  );

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: async ({
      bookingId,
      reason,
      studentId,
    }: {
      bookingId: string;
      reason: string;
      studentId: string;
    }) => {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          cancellation_reason: `[Profesor] ${reason}`,
        })
        .eq("id", bookingId);
      if (error) throw error;

      // Refund the student's class
      await supabase.rpc("refund_class", { _user_id: studentId });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teacher-bookings"] });
      toast({
        title: "Clase cancelada",
        description: "Se ha cancelado la clase y devuelto el crédito al alumno.",
      });

      // Send cancellation email to the student (fire & forget)
      const booking = bookings?.find((b) => b.id === variables.bookingId);
      const student = studentsMap.get(variables.studentId);
      if (booking && student?.email) {
        (async () => {
          try {
            await supabase.functions.invoke("send-cancellation-confirmation", {
              body: {
                studentName: student.full_name || "",
                studentEmail: student.email,
                teacherName: profile?.full_name || "",
                teacherEmail: "",
                bookingDate: booking.booking_date,
                slots: [{ start: booking.start_time?.slice(0, 5), end: booking.end_time?.slice(0, 5) }],
                cancellationReason: `[Profesor] ${variables.reason}`,
              },
            });
          } catch (err) {
            console.error("Teacher cancellation email error:", err);
          }
        })();
      }

      setCancelBooking(null);
      setCancelReason("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo cancelar la clase. Inténtalo de nuevo.",
        variant: "destructive",
      });
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
  if (role !== "teacher") return <Navigate to="/dashboard" replace />;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-ES", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-['Space_Grotesk']">
              AutoescuelaGO
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/80 hidden sm:inline">
              {profile?.full_name || user.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <LogOut className="w-4 h-4 mr-1" /> Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-primary pb-20 pt-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] rounded-full border-[40px] border-primary-foreground" />
          <div className="absolute bottom-[-80px] left-[-60px] w-[200px] h-[200px] rounded-full border-[30px] border-primary-foreground" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary-foreground/70" />
              <span className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wider">
                Profesor
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
              ¡Hola, {profile?.full_name || "profesor"}!
            </h1>
            <p className="text-primary-foreground/70">
              Panel de control del profesor
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 -mt-12 pb-16 relative z-10 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Mis clases programadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : !bookings?.length ? (
                <div className="text-center py-12 space-y-3">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground">
                    No tienes clases programadas próximamente
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Horario</TableHead>
                        <TableHead>Alumno</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => {
                        const student = studentsMap.get(booking.student_id);
                        return (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              {formatDate(booking.booking_date)}
                            </TableCell>
                            <TableCell>
                              {booking.start_time?.slice(0, 5)} -{" "}
                              {booking.end_time?.slice(0, 5)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                {student?.full_name || "Alumno"}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {student?.phone || "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                onClick={() =>
                                  setCancelBooking({
                                    id: booking.id,
                                    studentName:
                                      student?.full_name || "Alumno",
                                    date: formatDate(booking.booking_date),
                                    time: `${booking.start_time?.slice(0, 5)} - ${booking.end_time?.slice(0, 5)}`,
                                  })
                                }
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancelar
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Block Slots Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-6"
        >
          <BlockSlotsCard teacherId={user.id} />
        </motion.div>
      </main>

      {/* Cancel Dialog */}
      <AlertDialog
        open={!!cancelBooking}
        onOpenChange={(open) => {
          if (!open) {
            setCancelBooking(null);
            setCancelReason("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar clase</AlertDialogTitle>
            <AlertDialogDescription>
              Vas a cancelar la clase con{" "}
              <strong>{cancelBooking?.studentName}</strong> el{" "}
              <strong>{cancelBooking?.date}</strong> a las{" "}
              <strong>{cancelBooking?.time}</strong>. Se devolverá el crédito al
              alumno automáticamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <label className="text-sm font-medium mb-1.5 block">
              Motivo de cancelación
            </label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Escribe el motivo..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              disabled={!cancelReason.trim() || cancelMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!cancelBooking) return;
                const booking = bookings?.find(
                  (b) => b.id === cancelBooking.id
                );
                if (!booking) return;
                cancelMutation.mutate({
                  bookingId: booking.id,
                  reason: cancelReason,
                  studentId: booking.student_id,
                });
              }}
            >
              {cancelMutation.isPending ? "Cancelando..." : "Confirmar cancelación"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <footer className="bg-foreground text-background/80 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Car className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold text-background font-['Space_Grotesk']">
                AutoescuelaGO
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-sm opacity-70">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Villanueva del Pardillo
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> 658474814
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> info@autoescuelago.es
              </span>
              <span className="flex items-start gap-1.5">
                <Clock className="w-3.5 h-3.5 mt-0.5" />
                <span className="flex flex-col">
                  <span>Lunes-Viernes: 10:00-13:00 y 16:00-20:00</span>
                  <span>
                    Sábados y domingos:{" "}
                    <span className="text-red-400 font-semibold">Cerrados</span>
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div className="border-t border-background/10 mt-5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-50">
            <span>© 2026 AutoescuelaGO. Todos los derechos reservados.</span>
            <div className="flex gap-4">
              <Link
                to="/politica-de-privacidad"
                className="hover:opacity-100 hover:text-background transition-colors"
              >
                Política de privacidad
              </Link>
              <Link
                to="/aviso-legal"
                className="hover:opacity-100 hover:text-background transition-colors"
              >
                Aviso legal
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
