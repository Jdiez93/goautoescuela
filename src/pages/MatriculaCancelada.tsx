import { Link, useSearchParams } from "react-router-dom";
import { XCircle, ArrowLeft, Home } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MatriculaCancelada() {
  const [params] = useSearchParams();
  const matriculaId = params.get("matricula_id");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 md:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-destructive/30">
            <CardContent className="p-8 md:p-10 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center mx-auto">
                <XCircle className="w-9 h-9 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk']">
                  Pago cancelado
                </h1>
                <p className="text-muted-foreground mt-2">
                  Tu matrícula sigue guardada pero el pago no se ha completado. Puedes reintentar
                  el pago en cualquier momento.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {matriculaId && (
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
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
