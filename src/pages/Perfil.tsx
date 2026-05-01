import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate, Link } from "react-router-dom";
import { Car, ArrowLeft, Save, Loader2, User, Mail, Phone, MapPin, Calendar, CreditCard, Pencil } from "lucide-react";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const heroVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20, mass: 0.8 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 200, damping: 22, delay: 0.15 },
  },
};

export default function Perfil() {
  const { user, profile: authProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
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

  // Check if all required profile fields are filled
  const isProfileComplete = !!(
    form.full_name &&
    form.phone &&
    form.dni &&
    form.date_of_birth &&
    form.residence &&
    form.city &&
    form.postal_code
  );

  // Fields are locked when profile is complete and not in editing mode
  const fieldsLocked = isProfileComplete && !editing;

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
      setEditing(false);
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
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-primary text-primary-foreground"
      >
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
              Ready2Go
            </span>
          </Link>
        </div>
      </motion.header>

      {/* Hero */}
      <div className="bg-primary pb-24 pt-8 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] rounded-full border-[40px] border-primary-foreground" />
        </motion.div>
        <div className="container mx-auto px-4 max-w-2xl relative">
          {/* User badge */}
          {authProfile?.full_name && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.15 }}
              className="flex justify-end mb-4"
            >
              <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/25 rounded-full px-3.5 py-1.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                  {authProfile.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-primary-foreground/90">{authProfile.full_name}</span>
              </div>
            </motion.div>
          )}
          <motion.div variants={heroVariants} initial="hidden" animate="visible">
            <motion.h1
              className="text-3xl font-bold text-primary-foreground mb-1 font-['Space_Grotesk']"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            >
              Mi Perfil
            </motion.h1>
            <motion.p
              className="text-primary-foreground/70"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            >
              Completa y actualiza tu información personal
            </motion.p>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-2xl -mt-16 relative z-10 pb-16">
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="border-border/50 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <User className="w-5 h-5 text-primary" />
                </motion.div>
                Datos personales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  className="grid sm:grid-cols-2 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {fields.filter(f => !f.full).map((field) => (
                    <motion.div key={field.id} className="space-y-2" variants={itemVariants}>
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <motion.div
                        className="relative"
                        whileFocus={{ scale: 1.01 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id={field.id}
                          name={field.id}
                          type={field.type}
                          value={(form as any)[field.id]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          disabled={field.disabled || fieldsLocked}
                          maxLength={field.maxLength}
                          className={`pl-10 transition-shadow duration-200 focus:shadow-md ${field.disabled || fieldsLocked ? "bg-muted" : ""}`}
                        />
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>

                {fields.filter(f => f.full).map((field, i) => (
                  <motion.div
                    key={field.id}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.5 + i * 0.08 }}
                  >
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        value={(form as any)[field.id]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        disabled={fieldsLocked}
                        className={`pl-10 transition-shadow duration-200 focus:shadow-md ${fieldsLocked ? "bg-muted" : ""}`}
                      />
                    </motion.div>
                  </motion.div>
                ))}

                <motion.div
                  className="pt-4 flex flex-col sm:flex-row gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.6 }}
                >
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={!fieldsLocked}
                      onClick={() => setEditing(true)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar datos
                    </Button>
                  </motion.div>
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                    <Button
                      type="submit"
                      disabled={saving || fieldsLocked}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Guardar cambios
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
