import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Error al iniciar sesión", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
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
                <div className="w-10 h-10 rounded-xl bg-hero-gradient flex items-center justify-center">
                  <Car className="w-5 h-5 text-primary-foreground" />
                </div>
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
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
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
