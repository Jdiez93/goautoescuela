import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Mail, Home, LogIn } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function MatriculaExito() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }
      // Buscamos la matrícula por stripe_session_id (el webhook ya debería haberla marcado)
      // Reintentamos unas veces por si el webhook tarda
      for (let i = 0; i < 8; i++) {
        const { data } = await supabase
          .from("matriculas")
          .select("email, estado_pago")
          .eq("stripe_session_id", sessionId)
          .maybeSingle();
        if (cancelled) return;
        if (data?.estado_pago === "pagada") {
          setEmail(data.email);
          setLoading(false);
          return;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 md:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-8 md:p-10 text-center space-y-6">
              {loading ? (
                <>
                  <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                  <h1 className="text-2xl font-bold">Confirmando tu pago…</h1>
                  <p className="text-muted-foreground text-sm">
                    Estamos verificando tu pago con Stripe. Este proceso suele tardar unos segundos.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk']">
                      ¡Matrícula completada!
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Tu pago se ha procesado correctamente y tu matrícula queda registrada.
                    </p>
                  </div>

                  <div className="text-left bg-muted/40 rounded-lg p-4 border border-border/60 space-y-3">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-foreground">Próximo paso: crea tu cuenta</p>
                        <p className="text-muted-foreground mt-1">
                          Regístrate en la plataforma online usando exactamente este correo
                          {email && <> <strong className="text-foreground">({email})</strong></>} para acceder a tu zona de alumno.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild size="lg">
                      <Link to="/registro">
                        <LogIn className="w-4 h-4 mr-2" /> Crear mi cuenta
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/">
                        <Home className="w-4 h-4 mr-2" /> Volver al inicio
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
