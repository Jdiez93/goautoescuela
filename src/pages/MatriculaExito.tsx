import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Mail, Home, Clock, RefreshCw, ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


type Status = "checking" | "paid" | "pending";

export default function MatriculaExito() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [email, setEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("checking");

  const checkStatus = async () => {
    if (!sessionId) {
      setStatus("pending");
      return;
    }
    setStatus("checking");
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-matricula-payment?session_id=${encodeURIComponent(sessionId)}`;
    for (let i = 0; i < 10; i++) {
      try {
        const res = await fetch(url, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        const json = await res.json();
        if (json?.estado_pago === "pagada") {
          setEmail(json.email);
          setStatus("paid");
          return;
        }
      } catch (e) {
        console.error("check-matricula-payment error", e);
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
    setStatus("pending");
  };

  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 md:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-2xl mx-auto">
          {status === "checking" && (
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background">
              <CardContent className="p-8 md:p-10 text-center space-y-6">
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                <h1 className="text-2xl font-bold">Verificando tu pago…</h1>
                <p className="text-muted-foreground text-sm">
                  Estamos confirmando tu pago con Stripe. Este proceso suele tardar unos
                  segundos.
                </p>
              </CardContent>
            </Card>
          )}

          {status === "paid" && (
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background">
              <CardContent className="p-8 md:p-10 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk']">
                    ¡Matrícula recibida correctamente!
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Tu pago se ha confirmado y tu matrícula queda registrada.
                  </p>
                </div>

                <div className="text-left bg-muted/40 rounded-lg p-4 border border-border/60">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-foreground">Último paso: crea tu cuenta</p>
                      <p className="text-muted-foreground mt-1">
                        Regístrate en la plataforma online usando exactamente este correo
                        {email && (
                          <>
                            {" "}
                            <strong className="text-foreground">({email})</strong>
                          </>
                        )}{" "}
                        para acceder a tu zona de alumno.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link to="/registro">
                      Finalizar matrícula <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/">
                      <Home className="w-4 h-4 mr-2" /> Volver al inicio
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {status === "pending" && (
            <Card className="border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-background">
              <CardContent className="p-8 md:p-10 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto">
                  <Clock className="w-9 h-9 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk']">
                    Pago pendiente de confirmación
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Tu pago se ha enviado pero aún no hemos recibido la confirmación de Stripe.
                    Esto puede tardar un par de minutos. Una vez confirmado, podrás continuar al
                    registro.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" onClick={checkStatus}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Comprobar de nuevo
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/">
                      <Home className="w-4 h-4 mr-2" /> Volver al inicio
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Si en unos minutos sigue sin confirmarse, contacta con nosotros y revisaremos
                  tu pago.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
