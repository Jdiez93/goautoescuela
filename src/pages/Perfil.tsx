import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate, Link } from "react-router-dom";
import { Car, ArrowLeft, Save, Loader2, User, Mail, Phone, MapPin, Calendar, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ProfileForm {
  full_name: string;
  email: string;
  phone: string;
  dni: string;
  date_of_birth: string;
  residence: string;
  city: string;
  postal_code: string;
}

export default function Perfil() {
  const { user, profile: authProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    full_name: "",
    email: "",
    phone: "",
    dni: "",
    date_of_birth: "",
    residence: "",
    city: "",
    postal_code: "",
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, email, phone, dni, date_of_birth, residence, city, postal_code")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({
            full_name: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            dni: (data as any).dni || "",
            date_of_birth: (data as any).date_of_birth || "",
            residence: (data as any).residence || "",
            city: (data as any).city || "",
            postal_code: (data as any).postal_code || "",
          });
        }
        setLoading(false);
      });
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        dni: form.dni,
        date_of_birth: form.date_of_birth || null,
        residence: form.residence,
        city: form.city,
        postal_code: form.postal_code,
      } as any)
      .eq("user_id", user.id);

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: "No se pudo actualizar el perfil", variant: "destructive" });
    } else {
      toast({ title: "Perfil actualizado", description: "Tus datos se han guardado correctamente" });
    }
  };

  const fields = [
    { id: "full_name", label: "Nombre completo", icon: User, placeholder: "Tu nombre", type: "text" },
    { id: "email", label: "Email", icon: Mail, placeholder: "", type: "email", disabled: true },
    { id: "dni", label: "DNI / NIE", icon: CreditCard, placeholder: "12345678A", type: "text", maxLength: 15 },
    { id: "phone", label: "Teléfono", icon: Phone, placeholder: "+34 600 000 000", type: "text" },
    { id: "date_of_birth", label: "Fecha de nacimiento", icon: Calendar, placeholder: "", type: "date" },
    { id: "residence", label: "Dirección", icon: MapPin, placeholder: "Calle, número, piso...", type: "text", full: true },
    { id: "city", label: "Ciudad", icon: MapPin, placeholder: "Madrid", type: "text" },
    { id: "postal_code", label: "Código Postal", icon: MapPin, placeholder: "28001", type: "text", maxLength: 10 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver al panel</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-['Space_Grotesk']">
              AutoescuelaGO
            </span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-primary pb-24 pt-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] rounded-full border-[40px] border-primary-foreground" />
        </div>
        <div className="container mx-auto px-4 max-w-2xl relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold text-primary-foreground mb-1 font-['Space_Grotesk']">Mi Perfil</h1>
            <p className="text-primary-foreground/70">Completa y actualiza tu información personal</p>
            {authProfile?.full_name && (
              <div className="mt-4 inline-flex items-center gap-2.5 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15 rounded-xl px-4 py-2">
                <div className="w-7 h-7 rounded-lg bg-primary-foreground/20 flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {authProfile.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-primary-foreground/90">{authProfile.full_name}</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-2xl -mt-16 relative z-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                Datos personales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {fields.filter(f => !f.full).map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <div className="relative">
                        <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id={field.id}
                          name={field.id}
                          type={field.type}
                          value={(form as any)[field.id]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                          maxLength={field.maxLength}
                          className={`pl-10 ${field.disabled ? "bg-muted" : ""}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {fields.filter(f => f.full).map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <div className="relative">
                      <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        value={(form as any)[field.id]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="pl-10"
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <Button type="submit" disabled={saving} className="w-full bg-primary hover:bg-primary/90">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Guardar cambios
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
