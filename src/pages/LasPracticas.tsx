import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";

export default function LasPracticas() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24 flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Construction className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-foreground mb-3">Las Prácticas</h1>
          <p className="text-muted-foreground text-lg">Esta página está en desarrollo</p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
