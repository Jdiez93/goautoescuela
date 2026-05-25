import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Loader2, Mail, Lock, Eye, EyeOff, User, Check, X } from "lucide-react";
import { NeonCheckbox } from "@/components/ui/neon-checkbox";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import logoReady2Go from "@/assets/logo-ready2go-oficial.png";

const passwordChecks = (pass: string) => [
  { label: "Mínimo 6 caracteres", met: pass.length >= 6 },
  { label: "Al menos 10 caracteres", met: pass.length >= 10 },
  { label: "Una letra mayúscula", met: /[A-Z]/.test(pass) },
  { label: "Un número", met: /[0-9]/.test(pass) },
  { label: "Un carácter especial (!@#…)", met: /[^A-Za-z0-9]/.test(pass) },
];

const getPasswordStrength = (pass: string): { score: number; label: string } => {
  if (!pass) return { score: 0, label: "" };
  const checks = passwordChecks(pass);
  const met = checks.filter((c) => c.met).length;

  if (met <= 1) return { score: 1, label: "Débil" };
  if (met <= 3) return { score: 2, label: "Media" };
  return { score: 3, label: "Segura" };
};

const strengthColors = {
  1: { bar: "bg-destructive", text: "text-destructive" },
  2: { bar: "bg-yellow-500", text: "text-yellow-600" },
  3: { bar: "bg-green-500", text: "text-green-600" },
} as const;

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checks = useMemo(() => passwordChecks(password), [password]);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Contraseña muy corta", description: "Mínimo 6 caracteres", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // 1) Validar matrícula + crear cuenta en backend
      const { data, error } = await supabase.functions.invoke("register-alumno", {
        body: { email: email.trim().toLowerCase(), password, full_name: fullName },
      });

      if (error || (data as any)?.error) {
        const msg = (data as any)?.error ?? error?.message ?? "No se pudo crear la cuenta.";
        toast({ title: "Registro no permitido", description: msg, variant: "destructive" });
        setLoading(false);
        return;
      }

      // 2) Login automático
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        toast({
          title: "Cuenta creada",
          description: "Inicia sesión para continuar.",
        });
        navigate("/login");
        return;
      }

      toast({
        title: "¡Bienvenido/a!",
        description: "Tu cuenta de alumno está lista.",
      });
      navigate("/dashboard-alumno");
    } catch (err: any) {
      toast({
        title: "Error inesperado",
        description: err?.message ?? "Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-[-120px] right-[-80px] w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[250px] h-[250px] rounded-full bg-accent/30 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-[var(--card-shadow)]">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <Link to="/" state={{ skipIntro: true }} className="inline-flex items-center gap-2 mx-auto mb-4">
                <img src={logoReady2Go} alt="Ready2Go" className="h-16 w-auto object-contain" />
                <span className="text-xl font-bold font-['Space_Grotesk']">
                  Ready2Go
                </span>
              </Link>
            </motion.div>
            <CardTitle>Crear cuenta</CardTitle>
            <CardDescription className="text-destructive font-medium">
              Para la correcta creación de la cuenta regístrese con el mismo correo que realizó la matrícula
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="space-y-2"
              >
                <Label htmlFor="name">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="name" placeholder="Tu nombre" className="pl-10" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="space-y-2"
              >
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="tu@email.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.35 }}
                className="space-y-2"
              >
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2.5 pt-1"
                  >
                    {/* Strength bars */}
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                            i <= strength.score
                              ? strengthColors[strength.score as 1 | 2 | 3].bar
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-semibold ${strengthColors[strength.score as 1 | 2 | 3].text}`}>
                      Contraseña {strength.label.toLowerCase()}
                    </p>

                    {/* Requirements checklist */}
                    <ul className="space-y-1 pt-0.5">
                      {checks.map((check, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-xs">
                          {check.met ? (
                            <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                          )}
                          <span className={check.met ? "text-green-600" : "text-muted-foreground"}>
                            {check.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.35 }}
              >
                <NeonCheckbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  label={
                    <span className="text-muted-foreground">
                      He leído y acepto la{" "}
                      <Link to="/politica-privacidad" className="font-semibold hover:underline" style={{ color: "hsl(170 98% 73%)" }} target="_blank">
                        política de privacidad
                      </Link>
                    </span>
                  }
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.35 }}
              >
                <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90" disabled={loading || !acceptedPrivacy}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Crear cuenta
                </Button>
              </motion.div>
            </form>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-4 text-center text-sm text-muted-foreground"
            >
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline">Inicia sesión</Link>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
