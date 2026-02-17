import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Navigate } from "react-router-dom";
import { Car, Calendar, CreditCard, User, LogOut, BookOpen, ChevronRight, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, profile, role, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const studentCards = [
    { icon: Calendar, title: "Mis Reservas", desc: "Ver y gestionar tus clases programadas", href: "/reservas", accent: "primary" as const },
    { icon: CreditCard, title: "Mis Pagos", desc: "Historial de pagos y saldo de clases", href: "/pagos", accent: "secondary" as const },
    { icon: User, title: "Mi Perfil", desc: "Editar tus datos personales", href: "/perfil", accent: "primary" as const },
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

  const cards = role === "admin" ? adminCards : role === "teacher" ? teacherCards : studentCards;
  const roleLabel = role === "admin" ? "Administrador" : role === "teacher" ? "Profesor" : "Alumno";

  return (
    <div className="min-h-screen bg-background">
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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary-foreground/70" />
              <span className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wider">{roleLabel}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
              ¡Hola, {profile?.full_name || "usuario"}!
            </h1>
            <p className="text-primary-foreground/70">
              Bienvenido a tu panel de control
            </p>
          </motion.div>
        </div>
      </div>

      {/* Cards section - overlaps the hero */}
      <main className="container mx-auto px-4 -mt-12 pb-16 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link to={card.href}>
                <Card className="h-full group hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 bg-card">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      card.accent === "secondary"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-accent text-primary"
                    }`}>
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
                    <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 mt-3 rounded-full ${
                      card.accent === "secondary" ? "bg-secondary" : "bg-primary"
                    }`} />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
