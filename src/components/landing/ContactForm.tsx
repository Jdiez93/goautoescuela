import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useLocation } from "react-router-dom";
import { Send, Mail, User, Phone, MessageSquare, CheckCircle2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TOWNS = ["Villanueva del Pardillo", "Valdemorillo"] as const;

const contactSchema = z.object({
  full_name: z.string().trim().min(2, "Mínimo 2 caracteres").max(120, "Máximo 120 caracteres"),
  email: z.string().trim().email("Email inválido").max(255, "Máximo 255 caracteres"),
  phone: z
    .string()
    .trim()
    .min(6, "Teléfono inválido")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[+\d\s()-]+$/, "Solo números y símbolos válidos"),
  town: z.enum(TOWNS, { errorMap: () => ({ message: "Selecciona una población" }) }),
  message: z.string().trim().min(10, "Mínimo 10 caracteres").max(2000, "Máximo 2000 caracteres"),
});

type FormState = {
  full_name: string;
  email: string;
  phone: string;
  town: "" | (typeof TOWNS)[number];
  message: string;
};

const initial: FormState = { full_name: "", email: "", phone: "", town: "", message: "" };

export default function ContactForm() {
  const { pathname } = useLocation();
  const { toast } = useToast();
  const [data, setData] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((d) => ({ ...d, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as keyof FormState;
        if (!fieldErrors[k]) fieldErrors[k] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        town: parsed.data.town,
        message: parsed.data.message,
        source_page: pathname,
      };

      const { error } = await supabase.from("contact_submissions").insert([payload]);
      if (error) throw error;

      // Fire-and-forget email notification (don't block UX if it fails)
      supabase.functions.invoke("send-contact-notification", { body: payload }).catch((e) => {
        console.error("Notification email failed:", e);
      });

      setSuccess(true);
      setData(initial);
      toast({
        title: "¡Mensaje enviado!",
        description: "Nos pondremos en contacto contigo lo antes posible.",
      });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      toast({
        title: "Error al enviar",
        description: err.message ?? "Inténtalo de nuevo en unos minutos.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 md:py-28 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -100, rotate: -3, scale: 0.92 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 90, damping: 14, mass: 1.1 }}
          className="relative overflow-hidden rounded-3xl border-2 border-primary/60 bg-card/60 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.25)]"
        >
          {/* Decorative blobs - static for performance */}
          <div
            aria-hidden
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-secondary/15 blur-3xl pointer-events-none"
          />

          <div className="relative grid md:grid-cols-2 gap-0 items-start">
            {/* Left side - intro */}
            <div className="p-6 sm:p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: easeCurve, delay: 0.1 }}
              >
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                  Contacto
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] text-foreground mb-4 leading-tight">
                  ¿Necesitas más información?
                </h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                  Rellena el formulario y nuestro equipo te responderá lo antes posible. Sin compromiso.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    Respuesta en menos de 24h
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    Atención personalizada
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    Sin compromiso
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Right side - form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.25, ease: easeCurve }}
              className="p-6 sm:p-8 md:p-12 bg-background/40 md:rounded-l-[2rem] space-y-5"
            >
              <FormField
                id="full_name"
                label="Nombre y apellidos"
                icon={<User className="w-4 h-4" />}
                error={errors.full_name}
              >
                <Input
                  id="full_name"
                  value={data.full_name}
                  onChange={update("full_name")}
                  placeholder="María García López"
                  className="bg-background/60 border-border/60 focus-visible:ring-primary/40"
                  disabled={submitting}
                  maxLength={120}
                />
              </FormField>

              <FormField
                id="email"
                label="Email"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email}
              >
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={update("email")}
                  placeholder="tu@email.com"
                  className="bg-background/60 border-border/60 focus-visible:ring-primary/40"
                  disabled={submitting}
                  maxLength={255}
                />
              </FormField>

              <FormField
                id="phone"
                label="Teléfono"
                icon={<Phone className="w-4 h-4" />}
                error={errors.phone}
              >
                <Input
                  id="phone"
                  type="tel"
                  value={data.phone}
                  onChange={update("phone")}
                  placeholder="600 12 34 56"
                  className="bg-background/60 border-border/60 focus-visible:ring-primary/40"
                  disabled={submitting}
                  maxLength={30}
                />
              </FormField>

              <FormField
                id="town"
                label="Población"
                icon={<MapPin className="w-4 h-4" />}
                error={errors.town}
              >
                <Select
                  value={data.town}
                  onValueChange={(v) => {
                    setData((d) => ({ ...d, town: v as (typeof TOWNS)[number] }));
                    if (errors.town) setErrors((er) => ({ ...er, town: undefined }));
                  }}
                  disabled={submitting}
                >
                  <SelectTrigger
                    id="town"
                    className="bg-background/60 border-border/60 focus:ring-primary/40"
                  >
                    <SelectValue placeholder="Selecciona tu población" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOWNS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                id="message"
                label="Mensaje"
                icon={<MessageSquare className="w-4 h-4" />}
                error={errors.message}
              >
                <Textarea
                  id="message"
                  value={data.message}
                  onChange={update("message")}
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  className="bg-background/60 border-border/60 focus-visible:ring-primary/40 min-h-[120px] resize-none"
                  disabled={submitting}
                  maxLength={2000}
                />
              </FormField>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25 transition-all"
                >
                  {success ? (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" /> ¡Enviado!
                    </motion.span>
                  ) : submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Enviar mensaje <Send className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </motion.div>

              <p className="text-[11px] text-muted-foreground/80 text-center leading-relaxed">
                Al enviar este formulario aceptas nuestra{" "}
                <a href="/politica-privacidad" className="underline hover:text-primary">
                  política de privacidad
                </a>
                .
              </p>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FormField({
  id,
  label,
  icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </Label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-destructive font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
