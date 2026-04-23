import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Car, Loader2, Mail, Lock, Eye, EyeOff, MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import logoReady2Go from "@/assets/logo-ready2go.jpeg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [resendOpen, setResendOpen] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: resendEmail,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    });
    setResendLoading(false);
    if (error) {
      toast({ title: "No se pudo reenviar", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Correo reenviado",
        description: "Revisa tu bandeja de entrada (y la carpeta de spam).",
      });
      setResendOpen(false);
      setResendEmail("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(false);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setPasswordError(true);
      toast({ title: "Error al iniciar sesión", description: error.message, variant: "destructive" });
    } else {
      // Check roles to redirect appropriately (admin & teacher → teacher dashboard)
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      const userRoles = (rolesData ?? []).map((r) => r.role);
      if (userRoles.includes("teacher") || userRoles.includes("admin")) {
        navigate("/dashboard-profesor");
      } else {
        navigate("/dashboard");
      }
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
              <Link to="/" className="inline-flex items-center gap-2 mx-auto mb-4">
                <img src={logoReady2Go} alt="Ready2Go" className="h-24 w-auto object-contain" />
                <span className="text-xl font-bold font-['Space_Grotesk']">
                  Autoescuela<span className="text-gradient">GO</span>
                </span>
              </Link>
            </motion.div>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>Accede a tu cuenta de AutoescuelaGO</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
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
                transition={{ delay: 0.3, duration: 0.35 }}
                className="space-y-2"
              >
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${passwordError ? 'text-destructive' : 'text-muted-foreground'}`} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 ${passwordError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
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
                {passwordError && (
                  <p className="text-sm text-destructive mt-1">Contraseña incorrecta</p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.35 }}
              >
                <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Iniciar sesión
                </Button>
              </motion.div>
            </form>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-4 text-center text-sm space-y-2"
            >
              <Link to="/recuperar-password" className="text-primary hover:underline block">
                ¿Olvidaste tu contraseña?
              </Link>
              <Dialog open={resendOpen} onOpenChange={setResendOpen}>
                <DialogTrigger asChild>
                  <button type="button" className="text-primary hover:underline block mx-auto">
                    ¿No recibiste el correo de confirmación?
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <div className="w-12 h-12 rounded-xl bg-hero-gradient flex items-center justify-center mx-auto mb-2">
                      <MailCheck className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <DialogTitle className="text-center">Reenviar correo de confirmación</DialogTitle>
                    <DialogDescription className="text-center">
                      Introduce el email con el que te registraste y te enviaremos un nuevo enlace.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleResend} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resend-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="resend-email"
                          type="email"
                          placeholder="tu@email.com"
                          className="pl-10"
                          value={resendEmail}
                          onChange={(e) => setResendEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90"
                        disabled={resendLoading}
                      >
                        {resendLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Reenviar correo
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <p className="text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link to="/registro" className="text-primary hover:underline">Regístrate</Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
