import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Navigate } from "react-router-dom";
import { Car, Calendar, CreditCard, User, LogOut, BookOpen } from "lucide-react";

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
    { icon: Calendar, title: "Mis Reservas", desc: "Ver y gestionar tus clases", href: "/reservas" },
    { icon: CreditCard, title: "Mis Pagos", desc: "Historial de pagos y saldo", href: "/pagos" },
    { icon: User, title: "Mi Perfil", desc: "Editar datos personales", href: "/perfil" },
  ];

  const teacherCards = [
    { icon: Calendar, title: "Mi Agenda", desc: "Ver clases programadas", href: "/agenda" },
    { icon: BookOpen, title: "Disponibilidad", desc: "Configurar horarios", href: "/disponibilidad" },
    { icon: User, title: "Mi Perfil", desc: "Editar datos personales", href: "/perfil" },
  ];

  const adminCards = [
    { icon: Calendar, title: "Gestión Reservas", desc: "Todas las reservas", href: "/admin/reservas" },
    { icon: User, title: "Gestión Alumnos", desc: "Listado de alumnos", href: "/admin/alumnos" },
    { icon: CreditCard, title: "Gestión Pagos", desc: "Transacciones y cobros", href: "/admin/pagos" },
    { icon: BookOpen, title: "Gestión Blog", desc: "Publicar artículos", href: "/admin/blog" },
  ];

  const cards = role === "admin" ? adminCards : role === "teacher" ? teacherCards : studentCards;
  const roleLabel = role === "admin" ? "Administrador" : role === "teacher" ? "Profesor" : "Alumno";

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-['Space_Grotesk']">
              Autoescuela<span className="text-gradient">GO</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {profile?.full_name || user.email} · <span className="font-medium text-primary">{roleLabel}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-1" /> Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">¡Hola, {profile?.full_name || "usuario"}!</h1>
        <p className="text-muted-foreground mb-8">Panel de {roleLabel.toLowerCase()}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link to={card.href} key={card.title}>
              <Card className="h-full hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <card.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{card.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
