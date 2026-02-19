import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Car, ArrowLeft, CreditCard, BookOpen, CheckCircle, Loader2, AlertCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const PACKS = [
  { key: "clase-suelta", name: "Clase suelta", classes: 1, price: 35, desc: "Una clase práctica individual", popular: false },
  { key: "pack-10", name: "Pack 10 clases", classes: 10, price: 320, desc: "10 clases prácticas · Ahorra 30€", popular: true },
  { key: "pack-20", name: "Pack 20 clases", classes: 20, price: 580, desc: "20 clases prácticas · Ahorra 120€", popular: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.95, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 280, damping: 22 },
  },
};

const heroVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20, mass: 0.8 },
  },
};

export default function Pagos() {
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [purchasingPack, setPurchasingPack] = useState<string | null>(null);

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["my-payments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalRemaining = payments?.reduce((sum, p) => sum + (p.status === "completed" ? p.classes_remaining : 0), 0) ?? 0;
  const totalPurchased = payments?.reduce((sum, p) => sum + (p.status === "completed" ? p.classes_purchased : 0), 0) ?? 0;

  useEffect(() => {
    if (success === "true") {
      toast({ title: "¡Pago realizado!", description: "Tu compra se ha procesado correctamente." });
    }
    if (canceled === "true") {
      toast({ title: "Pago cancelado", description: "No se ha realizado ningún cargo.", variant: "destructive" });
    }
  }, [success, canceled]);

  const handlePurchase = async (packKey: string) => {
    setPurchasingPack(packKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { packKey },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No se recibió la URL de pago");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "No se pudo iniciar el pago", variant: "destructive" });
    } finally {
      setPurchasingPack(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-primary text-primary-foreground"
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver al panel</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-['Space_Grotesk']">AutoescuelaGO</span>
          </Link>
        </div>
      </motion.header>

      {/* Hero section with balance */}
      <div className="bg-primary pb-24 pt-8 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="absolute top-[-50px] right-[-100px] w-[300px] h-[300px] rounded-full border-[40px] border-primary-foreground" />
        </motion.div>
        <div className="container mx-auto px-4 max-w-5xl relative">
          {/* User badge */}
          {profile?.full_name && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.15 }}
              className="flex justify-end mb-4"
            >
              <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/25 rounded-full px-3.5 py-1.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                  {profile.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-primary-foreground/90">{profile.full_name}</span>
              </div>
            </motion.div>
          )}
          <motion.div variants={heroVariants} initial="hidden" animate="visible">
            <motion.h1
              className="text-3xl font-bold text-primary-foreground mb-1 font-['Space_Grotesk']"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            >
              Mis Pagos
            </motion.h1>
            <motion.p
              className="text-primary-foreground/70"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            >
              Gestiona tu saldo y compra clases
            </motion.p>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-5xl -mt-16 relative z-10 pb-16">
        {/* Alerts */}
        <AnimatePresence>
          {success === "true" && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mb-6 p-4 rounded-xl bg-accent border border-primary/20 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-accent-foreground font-medium">¡Pago realizado con éxito! Las clases se añadirán a tu saldo en breve.</p>
            </motion.div>
          )}
          {canceled === "true" && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive font-medium">El pago fue cancelado. No se realizó ningún cargo.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Balance Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 gap-6 mb-10"
        >
          <motion.div variants={itemVariants}>
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Card className="border-border/50 overflow-hidden">
                <CardContent className="pt-6">
                  {paymentsLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shrink-0"
                        whileHover={{ rotate: -10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <BookOpen className="w-7 h-7 text-primary" />
                      </motion.div>
                      <div>
                        <motion.p
                          className="text-4xl font-bold font-['Space_Grotesk'] text-primary"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                        >
                          {totalRemaining}
                        </motion.p>
                        <p className="text-sm text-muted-foreground">Clases disponibles</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Card className="border-border/50 overflow-hidden">
                <CardContent className="pt-6">
                  {paymentsLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <TrendingUp className="w-7 h-7 text-secondary" />
                      </motion.div>
                      <div>
                        <motion.p
                          className="text-4xl font-bold font-['Space_Grotesk'] text-foreground"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
                        >
                          {totalPurchased}
                        </motion.p>
                        <p className="text-sm text-muted-foreground">Total compradas</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Packs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] mb-6">Comprar clases</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-3 gap-6 mb-12"
          >
            {PACKS.map((pack) => (
              <motion.div key={pack.key} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Card
                    className={`relative flex flex-col transition-all duration-300 border-border/50 ${
                      pack.popular ? "border-primary ring-2 ring-primary/20" : ""
                    }`}
                  >
                    {pack.popular && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 }}
                      >
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground border-0">
                          Más popular
                        </Badge>
                      </motion.div>
                    )}
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-lg">{pack.name}</CardTitle>
                      <CardDescription>{pack.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center flex-1">
                      <motion.p
                        className="text-4xl font-bold font-['Space_Grotesk']"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
                      >
                        {pack.price}€
                      </motion.p>
                      <p className="text-xs text-muted-foreground mt-1">{(pack.price / pack.classes).toFixed(2)}€ / clase</p>
                    </CardContent>
                    <CardFooter>
                      <motion.div className="w-full" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                        <Button
                          className={`w-full ${pack.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                          variant={pack.popular ? "default" : "outline"}
                          onClick={() => handlePurchase(pack.key)}
                          disabled={purchasingPack !== null}
                        >
                          {purchasingPack === pack.key ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <CreditCard className="w-4 h-4 mr-2" />
                          )}
                          Comprar
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.35 }}
        >
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] mb-6">Historial de pagos</h2>
          {paymentsLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : !payments?.length ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Card className="border-border/50">
                <CardContent className="py-10 text-center text-muted-foreground">
                  Aún no tienes pagos registrados.
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {payments.map((p) => (
                <motion.div key={p.id} variants={itemVariants}>
                  <motion.div
                    whileHover={{ x: 4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Card className="border-border/50">
                      <CardContent className="py-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{p.classes_purchased} clase{p.classes_purchased > 1 ? "s" : ""}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(p.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold">{Number(p.amount).toFixed(2)}€</span>
                          <Badge variant={p.status === "completed" ? "default" : p.status === "pending" ? "secondary" : "destructive"}>
                            {p.status === "completed" ? "Completado" : p.status === "pending" ? "Pendiente" : p.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
