import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, Navigate } from "react-router-dom";
import { Car, Calendar, CreditCard, User, LogOut, BookOpen, ChevronRight, Shield, MapPin, Phone, Mail, Clock, Timer, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import MonthlySpendingChart from "@/components/dashboard/MonthlySpendingChart";
import { useMemo, useState, useEffect } from "react";

export default function Dashboard() {
  const { user, profile, role, loading, signOut } = useAuth();

  // Fetch payments
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["dashboard-payments", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("payments")
        .select("*, class_packs(name)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user && role === "student",
  });

  // Fetch upcoming bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["dashboard-bookings", user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
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
    enabled: !!user && role === "student",
  });

  const studentDataLoading = paymentsLoading || bookingsLoading;

  // Compute stats
  const stats = useMemo(() => {
    if (!payments) return { totalPurchased: 0, totalRemaining: 0, completed: 0 };
    const completedPayments = payments.filter((p) => p.status === "completed");
    const totalPurchased = completedPayments.reduce((s, p) => s + p.classes_purchased, 0);
    const totalRemaining = completedPayments.reduce((s, p) => s + p.classes_remaining, 0);
    return { totalPurchased, totalRemaining, completed: totalPurchased - totalRemaining };
  }, [payments]);

  // Next class countdown
  const nextClass = useMemo(() => {
    if (!bookings?.length) return null;
    const now = new Date();
    for (const b of bookings) {
      const classDate = new Date(`${b.booking_date}T${b.start_time}`);
      if (classDate > now) return { booking: b, date: classDate };
    }
    return null;
  }, [bookings]);

  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!nextClass) { setCountdown(null); return; }
    const tick = () => {
      const diff = nextClass.date.getTime() - Date.now();
      if (diff <= 0) { setCountdown(null); return; }
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextClass]);

  // Chart data
  const chartData = useMemo(() => {
    if (stats.totalPurchased === 0) return [];
    return [
      { name: "Completadas", value: stats.completed, color: "hsl(215, 80%, 48%)" },
      { name: "Disponibles", value: stats.totalRemaining, color: "hsl(150, 60%, 45%)" },
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role === "teacher") return <Navigate to="/dashboard-profesor" replace />;

  const studentCards = [
    { icon: Calendar, title: "Mis Reservas", desc: "Ver y gestionar tus clases programadas", href: "/reservas", accent: "primary" as const, borderClass: "border-l-4 border-l-primary" },
    { icon: CreditCard, title: "Mis Pagos", desc: "Historial de pagos, compra y saldo de clases", href: "/pagos", accent: "secondary" as const, borderClass: "border-l-4 border-l-destructive" },
    { icon: User, title: "Mi Perfil", desc: "Editar tus datos personales", href: "/perfil", accent: "primary" as const, borderClass: "border-l-4 border-l-primary" },
  ];

  const teacherCards = [
    { icon: Calendar, title: "Mi Agenda", desc: "Ver clases programadas", href: "/agenda", accent: "primary" as const },
    { icon: BookOpen, title: "Disponibilidad", desc: "Configurar horarios", href: "/disponibilidad", accent: "secondary" as const },
    { icon: User, title: "Mi Perfil", desc: "Editar datos personales", href: "/perfil", accent: "primary" as const },
  ];

  const adminCards = [
    { icon: Calendar, title: "Gestión Reservas", desc: "Todas las reservas", href: "/admin/reservas", accent: "primary" as const },
    { icon: User, title: "Gestión Alumnos", desc: "Listado de alumnos", href: "/admin/alumnos", accent: "secondary" as const },
    { icon: CreditCard, title: "Gestión Pagos", desc: "Transacciones y cobros", href: "/admin/pagos", accent: "primary" as const },
    { icon: BookOpen, title: "Gestión Blog", desc: "Publicar artículos", href: "/admin/blog", accent: "secondary" as const },
  ];

  const cards = role === "admin" ? adminCards : studentCards;
  const roleLabel = role === "admin" ? "Administrador" : "Alumno";

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-['Space_Grotesk']">AutoescuelaGO</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/80 hidden sm:inline">
              {profile?.full_name || user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <LogOut className="w-4 h-4 mr-1" /> Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div className="bg-primary pb-20 pt-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] rounded-full border-[40px] border-primary-foreground" />
          <div className="absolute bottom-[-80px] left-[-60px] w-[200px] h-[200px] rounded-full border-[30px] border-primary-foreground" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary-foreground/70" />
              <span className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wider">{roleLabel}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
              ¡Hola, {profile?.full_name || "usuario"}!
            </h1>
            <p className="text-primary-foreground/70">Bienvenido a tu panel de control</p>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 -mt-12 pb-16 relative z-10 flex-1 space-y-8">
        {/* Navigation Cards */}
        {role === "student" && !studentDataLoading && stats.totalPurchased > 0 && stats.totalRemaining <= 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-3 rounded-xl border-2 border-yellow-400 bg-yellow-300 px-5 py-3.5 shadow-[0_0_20px_hsl(50,100%,50%,0.25)]">
              <motion.div
                animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                className="shrink-0"
              >
                <AlertTriangle className="h-6 w-6 text-yellow-900" />
              </motion.div>
              <span className="flex-1 text-sm font-semibold text-yellow-900">
                {stats.totalRemaining === 0
                  ? "¡No te quedan clases!"
                  : `¡Solo te ${stats.totalRemaining === 1 ? "queda 1 clase" : `quedan ${stats.totalRemaining} clases`}!`}
                {" "}Compra más para seguir reservando.
              </span>
              <Button asChild size="sm" className="bg-yellow-900 text-yellow-100 hover:bg-yellow-800 font-bold shadow-md">
                <Link to="/pagos">Comprar clases</Link>
              </Button>
            </div>
          </motion.div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
              <Link to={card.href}>
                <Card className={`h-full group hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 bg-card ${(card as any).borderClass || ''}`}>
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.accent === "secondary" ? "bg-secondary/10 text-secondary" : "bg-accent text-primary"}`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {card.title}
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                    <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 mt-3 rounded-full ${card.accent === "secondary" ? "bg-secondary" : "bg-primary"}`} />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Student-only sections */}
        {role === "student" && (
          <>
            {/* Progress + Countdown row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Progress Chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Card className="h-full border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Progreso de clases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {studentDataLoading ? (
                      <div className="flex items-center gap-6">
                        <Skeleton className="w-32 h-32 rounded-full shrink-0" />
                        <div className="flex-1 space-y-3">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-2 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </div>
                    ) : stats.totalPurchased === 0 ? (
                      <div className="text-center py-8 space-y-3">
                        <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">Aún no has comprado clases</p>
                        <Button asChild size="sm" variant="outline">
                          <Link to="/pagos">Comprar clases</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-6">
                        <div className="w-32 h-32 shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={chartData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={4} dataKey="value" strokeWidth={0}>
                                {chartData.map((entry, idx) => (
                                  <Cell key={idx} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: number) => [`${value} clases`]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Completadas</span>
                              <span className="font-semibold">{stats.completed}</span>
                            </div>
                            <Progress value={stats.totalPurchased > 0 ? (stats.completed / stats.totalPurchased) * 100 : 0} className="h-2" />
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(150, 60%, 45%)" }} />
                            <span className="text-muted-foreground">Disponibles:</span>
                            <span className="font-semibold text-foreground">{stats.totalRemaining}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-muted-foreground">Total compradas:</span>
                            <span className="font-semibold text-foreground">{stats.totalPurchased}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Next Class Countdown */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Card className="h-full border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Timer className="w-5 h-5 text-secondary" />
                      Próxima clase
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {studentDataLoading ? (
                      <div className="space-y-4">
                        <div className="flex justify-center gap-3">
                          {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="w-[60px] h-[68px] rounded-xl" />
                          ))}
                        </div>
                        <div className="text-center space-y-2">
                          <Skeleton className="h-4 w-40 mx-auto" />
                          <Skeleton className="h-3 w-24 mx-auto" />
                        </div>
                      </div>
                    ) : nextClass && countdown ? (
                      <div className="space-y-4">
                        <div className="flex justify-center gap-3">
                          {[
                            { label: "Días", value: countdown.days },
                            { label: "Horas", value: countdown.hours },
                            { label: "Min", value: countdown.minutes },
                            { label: "Seg", value: countdown.seconds },
                          ].map((item) => (
                            <div key={item.label} className="bg-accent rounded-xl px-3 py-3 text-center min-w-[60px]">
                              <div className="text-2xl font-bold text-primary font-['Space_Grotesk']">{String(item.value).padStart(2, "0")}</div>
                              <div className="text-xs text-muted-foreground">{item.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-center space-y-1">
                          {nextClass.booking.notes && (
                            <p className="text-xs font-medium text-primary">
                              con {nextClass.booking.notes}
                            </p>
                          )}
                          <p className="text-sm font-medium">
                            {new Date(nextClass.booking.booking_date).toLocaleDateString("es-ES", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {nextClass.booking.start_time?.slice(0, 5)} - {nextClass.booking.end_time?.slice(0, 5)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 space-y-3">
                        <Calendar className="w-10 h-10 mx-auto text-muted-foreground/40" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">No tienes clases próximamente</p>
                          <p className="text-xs text-muted-foreground/70">Compra y reserva clases para ver la cuenta atrás hasta tu próxima clase</p>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to="/reservas">Reservar clase</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Monthly Spending */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {studentDataLoading ? (
                <Card className="border-border/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                  </CardContent>
                </Card>
              ) : (
                <MonthlySpendingChart payments={payments} />
              )}
            </motion.div>
          </>
        )}
      </main>

      {/* Compact Footer */}
      <footer className="bg-foreground text-background/80 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Car className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold text-background font-['Space_Grotesk']">AutoescuelaGO</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-sm opacity-70">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Villanueva del Pardillo</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> 658474814</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> info@autoescuelago.es</span>
              <span className="flex items-start gap-1.5"><Clock className="w-3.5 h-3.5 mt-0.5" /><span className="flex flex-col"><span>Lunes-Viernes: 10:00-13:00 y 16:00-20:00</span><span>Sábados y domingos: <span className="text-red-400 font-semibold">Cerrados</span></span></span></span>
            </div>
          </div>
          <div className="border-t border-background/10 mt-5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-50">
            <span>© 2026 AutoescuelaGO. Todos los derechos reservados.</span>
            <div className="flex gap-4">
              <Link to="/politica-de-privacidad" className="hover:opacity-100 hover:text-background transition-colors">Política de privacidad</Link>
              <Link to="/aviso-legal" className="hover:opacity-100 hover:text-background transition-colors">Aviso legal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
