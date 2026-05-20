import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, ArrowLeft, ArrowRight, CalendarIcon, CheckCircle2, Download, FileText, Info, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const POBLACIONES = ["Villanueva del Pardillo", "Valdemorillo"] as const;

// Mapeo contrato según pack + población. null = aún no disponible.
const CONTRATOS: Record<string, Record<string, { file: string; label: string } | null>> = {
  basico: {
    "Villanueva del Pardillo": { file: "/contratos/pack_basico_pardillo.pdf", label: "Contrato Pack Básico - Villanueva del Pardillo" },
    Valdemorillo: { file: "/contratos/pack_basico_valdemorillo.pdf", label: "Contrato Pack Básico - Valdemorillo" },
  },
  avanzado: {
    "Villanueva del Pardillo": { file: "/contratos/pack_avanzado_pardillo.pdf", label: "Contrato Pack Avanzado - Villanueva del Pardillo" },
    Valdemorillo: { file: "/contratos/pack_avanzado_valdemorillo.pdf", label: "Contrato Pack Avanzado - Valdemorillo" },
  },
  completo: {
    "Villanueva del Pardillo": { file: "/contratos/pack_completo_pardillo.pdf", label: "Contrato Pack Completo - Villanueva del Pardillo" },
    Valdemorillo: { file: "/contratos/pack_completo_valdemorillo.pdf", label: "Contrato Pack Completo - Valdemorillo" },
  },
  premium: {
    "Villanueva del Pardillo": null,
    Valdemorillo: null,
  },
};

const matriculaSchema = z.object({
  full_name: z.string().trim().min(3, "Introduce nombre y apellidos").max(120),
  dni: z
    .string()
    .trim()
    .min(8, "DNI inválido")
    .max(12, "DNI inválido")
    .regex(/^[0-9XYZ][0-9]{7}[A-Z]$/i, "Formato de DNI inválido (ej: 12345678A)"),
  date_of_birth: z.string().min(1, "Selecciona la fecha de nacimiento"),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().min(9, "Teléfono inválido").max(20),
  address: z.string().trim().min(5, "Introduce la dirección completa").max(255),
  postal_code: z
    .string()
    .trim()
    .regex(/^[0-9]{5}$/, "Código postal inválido (5 dígitos)"),
  city: z.enum(POBLACIONES, { errorMap: () => ({ message: "Selecciona una población" }) }),
});

type MatriculaForm = z.infer<typeof matriculaSchema>;

type Pack = {
  id: string;
  slug: string;
  name: string;
  price: number;
  tagline: string | null;
};

const PACK_PREFIX = "pack_";

export default function Matricula() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const packParam = params.get("pack") ?? "";
  const slug = packParam.startsWith(PACK_PREFIX) ? packParam.slice(PACK_PREFIX.length) : packParam;

  const [pack, setPack] = useState<Pack | null>(null);
  const [loadingPack, setLoadingPack] = useState(true);
  const [packError, setPackError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<MatriculaForm>({
    resolver: zodResolver(matriculaSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      dni: "",
      date_of_birth: "",
      email: "",
      phone: "",
      address: "",
      postal_code: "",
      city: undefined as unknown as MatriculaForm["city"],
    },
  });

  const cityValue = watch("city");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug) {
        setPackError("No se ha indicado ningún pack.");
        setLoadingPack(false);
        return;
      }
      const { data, error } = await supabase
        .from("packs_matricula")
        .select("id, slug, name, price, tagline")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setPackError("El pack indicado no existe o no está disponible.");
      } else {
        setPack(data as Pack);
      }
      setLoadingPack(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const formattedPrice = useMemo(() => {
    if (!pack) return "";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(pack.price);
  }, [pack]);

  const contrato = useMemo(() => {
    if (!slug || !cityValue) return undefined;
    return CONTRATOS[slug]?.[cityValue] ?? undefined;
  }, [slug, cityValue]);
  const contratoPendiente = !!slug && !!cityValue && CONTRATOS[slug]?.[cityValue] === null;

  const onSubmit = async (values: MatriculaForm) => {
    if (!pack) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("matriculas")
        .insert({
          full_name: values.full_name,
          dni: values.dni.toUpperCase(),
          date_of_birth: values.date_of_birth,
          email: values.email.toLowerCase(),
          phone: values.phone,
          address: values.address,
          postal_code: values.postal_code,
          city: values.city,
          pack_id: pack.id,
          pack_name: pack.name,
          precio: pack.price,
          estado_matricula: "pendiente_pago",
          estado_pago: "pendiente",
          status: "pendiente_pago",
          contrato_asociado: contrato?.label ?? "",
        })
        .select("id")
        .single();

      if (error) throw error;

      toast({
        title: "Datos guardados",
        description:
          "Tu matrícula se ha registrado correctamente. El siguiente paso será el pago.",
      });
      // Próxima fase: redirigir a subida de documentos / pago con el id
      navigate(`/matricula?pack=${packParam}&saved=${data?.id ?? ""}`, { replace: true });
    } catch (err) {
      console.error("Error guardando matrícula:", err);
      toast({
        title: "No se pudo guardar la matrícula",
        description: "Inténtalo de nuevo en unos segundos.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Top row: pack card + stepper */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-8">
            {/* Pack card */}
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background">
              <CardContent className="p-5">
                {loadingPack ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" /> Cargando pack…
                  </div>
                ) : packError ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">Pack no válido</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{packError}</p>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/matriculate">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Volver a los packs
                      </Link>
                    </Button>
                  </div>
                ) : pack ? (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Pack elegido
                    </p>
                    <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-foreground">
                      {pack.name}
                    </h2>
                    {pack.tagline && (
                      <p className="text-sm text-muted-foreground">{pack.tagline}</p>
                    )}
                    <div className="flex items-baseline gap-1 pt-2">
                      <span className="text-3xl font-bold text-primary">{formattedPrice}</span>
                    </div>
                    <Link
                      to="/matriculate"
                      className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors pt-2"
                    >
                      <ArrowLeft className="w-3 h-3 mr-1" /> Cambiar de pack
                    </Link>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Stepper */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Step number={1} label="Matrícula" active />
                  <div className="flex-1 h-[2px] bg-border" />
                  <Step number={2} label="Pago" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk']">
                  Datos de la matrícula
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Rellena todos los campos. Pasaremos al pago una vez revisados los datos.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                noValidate
              >
                <Field label="Nombre y apellidos *" error={errors.full_name?.message}>
                  <Input
                    {...register("full_name")}
                    placeholder="Ej: María García López"
                    autoComplete="name"
                  />
                </Field>

                <Field label="DNI *" error={errors.dni?.message}>
                  <Input
                    {...register("dni")}
                    placeholder="12345678A"
                    maxLength={9}
                    className="uppercase"
                  />
                </Field>

                <Field label="Fecha de nacimiento *" error={errors.date_of_birth?.message}>
                  <DateOfBirthPicker
                    value={watch("date_of_birth")}
                    onChange={(iso) =>
                      setValue("date_of_birth", iso, { shouldValidate: true, shouldDirty: true })
                    }
                  />
                </Field>


                <Field label="Correo electrónico *" error={errors.email?.message}>
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="tu@email.com"
                    autoComplete="email"
                  />
                </Field>

                <Field label="Teléfono *" error={errors.phone?.message}>
                  <Input
                    type="tel"
                    {...register("phone")}
                    placeholder="600 000 000"
                    autoComplete="tel"
                  />
                </Field>

                <Field label="Código postal *" error={errors.postal_code?.message}>
                  <Input
                    {...register("postal_code")}
                    placeholder="28200"
                    maxLength={5}
                    inputMode="numeric"
                  />
                </Field>

                <div className="md:col-span-2 space-y-2">
                  <Label>Dirección completa *</Label>
                  <Textarea
                    {...register("address")}
                    placeholder="Calle, número, piso, puerta…"
                    rows={2}
                    autoComplete="street-address"
                  />
                  <Alert className="border-primary/30 bg-primary/5">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-xs">
                      Es importante que la dirección esté actualizada con el domicilio en el que
                      resides actualmente, ya que ahí recibirás el carnet.
                    </AlertDescription>
                  </Alert>
                  {errors.address && (
                    <p className="text-xs text-destructive">{errors.address.message}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Población *</Label>
                  <Select
                    value={cityValue ?? ""}
                    onValueChange={(v) =>
                      setValue("city", v as MatriculaForm["city"], {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu población" />
                    </SelectTrigger>
                    <SelectContent>
                      {POBLACIONES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="text-xs text-destructive">{errors.city.message}</p>
                  )}
                </div>

                {/* Contrato según pack + población */}
                {cityValue && (
                  <div className="md:col-span-2">
                    {contrato ? (
                      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                              Contrato asociado
                            </p>
                            <p className="font-semibold text-foreground mt-0.5">{contrato.label}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Descarga el contrato, léelo detenidamente, fírmalo y súbelo firmado antes de continuar.
                            </p>
                          </div>
                        </div>
                        <Button asChild variant="default" className="w-full sm:w-auto">
                          <a href={contrato.file} download target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" /> Descargar contrato
                          </a>
                        </Button>
                      </div>
                    ) : contratoPendiente ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          El contrato para este pack y población aún no está disponible. Por favor, contacta con la autoescuela.
                        </AlertDescription>
                      </Alert>
                    ) : null}
                  </div>
                )}

                {/* Submit row */}
                <div className="md:col-span-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Al continuar, aceptas que tratemos tus datos para gestionar tu matrícula.
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!isValid || submitting || !pack || !!packError || contratoPendiente}
                    className="sm:ml-auto"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando…
                      </>
                    ) : (
                      <>
                        Siguiente <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Step({
  number,
  label,
  active = false,
  done = false,
}: {
  number: number;
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors ${
          active
            ? "bg-primary text-primary-foreground border-primary"
            : done
            ? "bg-primary/20 text-primary border-primary"
            : "bg-muted text-muted-foreground border-border"
        }`}
      >
        {done ? <CheckCircle2 className="w-5 h-5" /> : number}
      </div>
      <span
        className={`text-sm font-semibold uppercase tracking-wide ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
