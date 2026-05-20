import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Construction } from "lucide-react";

export default function Matricula() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="text-center max-w-md">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-primary/10 text-primary items-center justify-center mb-6">
            <Construction className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] mb-3">
            Estamos trabajando en la página
          </h1>
          <p className="text-muted-foreground">
            Muy pronto podrás completar tu matrícula desde aquí.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
