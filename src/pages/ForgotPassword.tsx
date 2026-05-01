import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoReady2Go from "@/assets/logo-ready2go.jpeg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email enviado", description: "Revisa tu bandeja para restablecer tu contraseña." });
    }
  };

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
          <CardTitle>Recuperar contraseña</CardTitle>
          <CardDescription>Te enviaremos un enlace para restablecer tu contraseña</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Enviar enlace
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">Volver al login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
