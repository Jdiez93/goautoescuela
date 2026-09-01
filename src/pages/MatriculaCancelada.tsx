import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { XCircle, AlertTriangle, ArrowLeft, Home, Loader2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function MatriculaCancelada() {
  const [params] = useSearchParams();
  const matriculaId = params.get("matricula_id");
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!matriculaId) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("matriculas")
        .select("estado_pago")
        .eq("id", matriculaId)
        .maybeSingle();
      setEstado(data?.estado_pago ?? null);
      setLoading(false);
    })();
  }, [matriculaId]);

  const isFailed = estado === "fallido";
  const isPaid = estado === "pagada";
  const canRetry = matriculaId && !isPaid;

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 md:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-2xl mx-auto">
          <Card className={`border-2 ${isFailed ? "border-destructive/40" : "border-amber-500/40"}`}>
            <CardContent className="p-8 md:p-10 text-center space-y-6">
              {loading ? (
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-muted-foreground" />
              ) : isPaid ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-9 h-9 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk']">
                      Tu matrícula ya está pagada
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Hemos detectado que el pago de esta matrícula ya se completó. Puedes
                      continuar al registro.
                    </p>
                  </div>
                  <Button asChild size="lg">
                    <Link to="/registro">Continuar al registro</Link>
                  </Button>
                </>
              ) : (
                <>
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                      isFailed ? "bg-destructive/15" : "bg-amber-500/15"
                    }`}
                  >
                    {isFailed ? (
                      <XCircle className="w-9 h-9 text-destructive" />
                    ) : (
                      <AlertTriangle className="w-9 h-9 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk']">
                      {isFailed ? "El pago no se ha podido completar" : "Pago cancelado"}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      {isFailed
                        ? "Tu tarjeta ha sido rechazada o el pago ha fallado. Tu matrícula sigue guardada, puedes intentarlo de nuevo con otro método de pago."
                        : "Tu matrícula sigue guardada pero el pago no se ha completado. Puedes reintentar el pago en cualquier momento."}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {canRetry && (
                      <Button asChild size="lg">
                        <Link to={`/matricula?saved=${matriculaId}`}>
                          <ArrowLeft className="w-4 h-4 mr-2" /> Reintentar pago
                        </Link>
                      </Button>
                    )}
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
