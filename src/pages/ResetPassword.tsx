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
  const { toast } = useToast();
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    // Also check if we already have a session (user clicked link and was auto-logged in)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
    });

    return () => subscription.unsubscribe();
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
    } else {
      setSuccess(true);
      toast({ title: "¡Contraseña actualizada!", description: "Ya puedes iniciar sesión con tu nueva contraseña." });
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md shadow-[var(--card-shadow)]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Verificando enlace de recuperación...</p>
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
            <div className="w-10 h-10 rounded-xl bg-hero-gradient flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-['Space_Grotesk']">
              Autoescuela<span className="text-gradient">GO</span>
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
