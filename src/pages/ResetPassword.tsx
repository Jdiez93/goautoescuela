import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Loader2, CheckCircle, Eye, EyeOff, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import logoReady2Go from "@/assets/logo-ready2go.jpeg";

const getPasswordStrength = (pass: string): { score: number; label: string } => {
  if (!pass) return { score: 0, label: "" };
  let score = 0;
  if (pass.length >= 6) score++;
  if (pass.length >= 10) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  if (score <= 1) return { score: 1, label: "Débil" };
  if (score <= 3) return { score: 2, label: "Media" };
  return { score: 3, label: "Segura" };
};

const strengthColors = {
  1: { bar: "bg-destructive", text: "text-destructive" },
  2: { bar: "bg-yellow-500", text: "text-yellow-600" },
  3: { bar: "bg-green-500", text: "text-green-600" },
} as const;

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const { toast } = useToast();
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const markReady = () => {
      if (!mounted) return;
      setSessionReady(true);
      setSessionError(null);
    };

    const markError = (message: string) => {
      if (!mounted) return;
      setSessionReady(false);
      setSessionError(message);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session)) {
        markReady();
      }
    });

    const initialize = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const searchParams = new URLSearchParams(window.location.search);
      const flowType = hashParams.get("type") ?? searchParams.get("type");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const code = searchParams.get("code");
      const urlError = hashParams.get("error_description") ?? searchParams.get("error_description") ?? hashParams.get("error") ?? searchParams.get("error");

      if (urlError) {
        markError("El enlace de recuperación no es válido o ha caducado. Solicita uno nuevo.");
        return;
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (error) {
          markError("No hemos podido validar el enlace de recuperación. Solicita uno nuevo.");
          return;
        }

        markReady();
        window.history.replaceState(null, "", window.location.pathname);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          markError("No hemos podido validar el enlace de recuperación. Solicita uno nuevo.");
          return;
        }

        markReady();
        window.history.replaceState(null, "", window.location.pathname);
        return;
      }

      for (let attempt = 0; attempt < 20; attempt++) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          markReady();
          return;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 250));
      }

      if (flowType === "recovery" || window.location.hash || window.location.search) {
        markError("No hemos podido verificar el enlace de recuperación. Solicita uno nuevo e inténtalo otra vez.");
        return;
      }

      markError("Falta el enlace de recuperación. Solicita uno nuevo desde “¿Olvidaste tu contraseña?”.");
    };

    initialize();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden.", variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      toast({ title: "Error", description: "La contraseña debe tener al menos 6 caracteres.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setSuccess(true);
    toast({ title: "¡Contraseña actualizada!", description: "Ya puedes iniciar sesión con tu nueva contraseña." });
    setTimeout(() => navigate("/login"), 3000);
  };

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md shadow-[var(--card-shadow)]">
          <CardContent className="py-12">
            {sessionError ? (
              <div className="flex flex-col items-center text-center gap-5">
                <p className="text-sm text-muted-foreground max-w-sm">{sessionError}</p>
                <div className="w-full space-y-3">
                  <Button asChild className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90">
                    <Link to="/recuperar-password">Solicitar nuevo enlace</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login">Volver al login</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Verificando enlace de recuperación...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-[var(--card-shadow)]">
        <CardHeader className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mx-auto mb-4">
            <img src={logoReady2Go} alt="Ready2Go" className="h-16 w-auto object-contain" />
            <span className="text-xl font-bold font-['Space_Grotesk']">
              <span className="text-gradient">Ready2Go</span>
            </span>
          </Link>
          <CardTitle>{success ? "¡Listo!" : "Nueva contraseña"}</CardTitle>
          <CardDescription>
            {success ? "Tu contraseña ha sido actualizada correctamente." : "Introduce tu nueva contraseña"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="text-sm text-muted-foreground">Redirigiendo al login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres" className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength.score ? strengthColors[strength.score as 1 | 2 | 3].bar : "bg-muted"}`} />
                      ))}
                    </div>
                    <p className={`text-[11px] font-medium ${strengthColors[strength.score as 1 | 2 | 3].text}`}>
                      Contraseña {strength.label.toLowerCase()}
                    </p>
                  </motion.div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Actualizar contraseña
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
