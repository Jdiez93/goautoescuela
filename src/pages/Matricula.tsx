import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Download, FileText, Info, Loader2, Upload, X } from "lucide-react";

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
    "Villanueva del Pardillo": { file: "/contratos/pack_premium_pardillo.pdf", label: "Contrato Pack Premium - Villanueva del Pardillo" },
    Valdemorillo: { file: "/contratos/pack_premium_valdemorillo.pdf", label: "Contrato Pack Premium - Valdemorillo" },
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
  const savedId = params.get("saved");
  const slug = packParam.startsWith(PACK_PREFIX) ? packParam.slice(PACK_PREFIX.length) : packParam;

  const [pack, setPack] = useState<Pack | null>(null);
  const [loadingPack, setLoadingPack] = useState(true);
  const [packError, setPackError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [redirectingToPay, setRedirectingToPay] = useState(false);

  const [contratoFirmado, setContratoFirmado] = useState<File | null>(null);
  const [dniAnverso, setDniAnverso] = useState<File | null>(null);
  const [dniReverso, setDniReverso] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

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

  const allFilesPresent = !!contratoFirmado && !!dniAnverso && !!dniReverso;

  const onSubmit = async (values: MatriculaForm) => {
    if (!pack) return;
    setFileError(null);
    if (!allFilesPresent) {
      setFileError("Debes subir el contrato firmado y las dos caras del DNI.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("dni", values.dni.toUpperCase());
      formData.append("date_of_birth", values.date_of_birth);
      formData.append("email", values.email.toLowerCase());
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("postal_code", values.postal_code);
      formData.append("city", values.city);
      formData.append("pack_id", pack.id);
      formData.append("contrato_asociado", contrato?.label ?? "");
      formData.append("contrato_firmado", contratoFirmado!);
      formData.append("dni_anverso", dniAnverso!);
      formData.append("dni_reverso", dniReverso!);

      const { data, error } = await supabase.functions.invoke("submit-matricula", {
        body: formData,
      });

      if (error) throw error;
      if (!data?.id || !data?.contrato_firmado_url || !data?.dni_anverso_url || !data?.dni_reverso_url) {
        throw new Error("La matrícula no devolvió las rutas de los documentos.");
      }


      toast({
        title: "Matrícula registrada",
        description:
          "Hemos guardado tus datos y documentos. El siguiente paso será el pago.",
      });
      navigate(`/matricula?pack=${packParam}&saved=${data.id}`, { replace: true });
    } catch (err) {
      console.error("Error guardando matrícula:", err);
      toast({
        title: "No se pudo completar la matrícula",
        description:
          (err as Error)?.message ?? "Inténtalo de nuevo en unos segundos.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Top row: pack card + compact stepper */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-8 items-start">
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

            {/* Compact stepper — minimal bar */}
            <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-4 py-2.5 border border-border/60">
              <Step number={1} label="Matrícula" active={!savedId} done={!!savedId} />
              <div className="flex-1 h-[2px] bg-border" />
              <Step number={2} label="Pago" active={!!savedId} />
            </div>
          </div>

          {savedId ? (
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background">
              <CardContent className="p-6 md:p-10 text-center space-y-5">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk']">
                    Datos guardados correctamente
                  </h1>
                  <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                    Tu matrícula está registrada y pendiente de pago. Continúa para completar el
                    pago de forma segura con Stripe.
                  </p>
                </div>
                {pack && (
                  <div className="inline-flex items-baseline gap-2 bg-background/60 rounded-lg px-4 py-2 border border-border/60">
                    <span className="text-sm text-muted-foreground">Importe:</span>
                    <span className="text-xl font-bold text-primary">{formattedPrice}</span>
                  </div>
                )}
                <div>
                  <Button
                    size="lg"
                    disabled={redirectingToPay}
                    onClick={async () => {
                      setRedirectingToPay(true);
                      try {
                        const { data, error } = await supabase.functions.invoke(
                          "create-matricula-payment",
                          { body: { matricula_id: savedId } }
                        );
                        if (error) throw error;
                        if (!data?.url) throw new Error("No se recibió la URL de pago");
                        window.location.href = data.url;
                      } catch (err) {
                        console.error(err);
                        toast({
                          title: "No se pudo iniciar el pago",
                          description:
                            (err as Error)?.message ?? "Inténtalo de nuevo en unos segundos.",
                          variant: "destructive",
                        });
                        setRedirectingToPay(false);
                      }
                    }}
                  >
                    {redirectingToPay ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirigiendo a Stripe…
                      </>
                    ) : (
                      <>
                        Continuar al pago <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Serás redirigido a la pasarela segura de Stripe para completar el pago.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
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
                  <p className="text-[11px] text-amber-600 dark:text-amber-500 mt-1.5 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
                    <span>El correo que utilice para la matrícula es con el que deberá registrarse posteriormente en la plataforma online.</span>
                  </p>

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

                {/* Subida de documentos */}
                <div className="md:col-span-2 space-y-4 pt-2">
                  <div>
                    <h3 className="text-lg font-semibold font-['Space_Grotesk']">Documentación</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formatos admitidos: JPG, PNG o PDF. Tamaño máximo 10 MB por archivo.
                    </p>
                  </div>

                  <FileDropper
                    label="Contrato firmado *"
                    description="Súbelo en PDF o foto una vez firmado."
                    file={contratoFirmado}
                    onChange={setContratoFirmado}
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  />

                  <Alert className="border-primary/30 bg-primary/5">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-xs">
                      Las imágenes del DNI deben verse de forma clara, completa y legible.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FileDropper
                      label="DNI - Anverso *"
                      description="Cara frontal del DNI."
                      file={dniAnverso}
                      onChange={setDniAnverso}
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    />
                    <FileDropper
                      label="DNI - Reverso *"
                      description="Cara posterior del DNI."
                      file={dniReverso}
                      onChange={setDniReverso}
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    />
                  </div>

                  {fileError && (
                    <p className="text-xs text-destructive">{fileError}</p>
                  )}
                </div>

                {/* Submit row */}
                <div className="md:col-span-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Al continuar, aceptas que tratemos tus datos para gestionar tu matrícula.
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!isValid || submitting || !pack || !!packError || contratoPendiente || !allFilesPresent}
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

function FileDropper({
  label,
  description,
  file,
  onChange,
  accept,
}: {
  label: string;
  description?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  accept: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const inputId = useMemo(() => `file-${Math.random().toString(36).slice(2)}`, []);

  const handleFiles = (f: File | null) => {
    setError(null);
    if (!f) {
      onChange(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError("Formato no permitido. Usa JPG, PNG o PDF.");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setError("El archivo supera los 10 MB.");
      return;
    }
    onChange(f);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border-2 border-primary/40 bg-primary/5 p-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
            aria-label="Quitar archivo"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer p-5 text-center"
        >
          <Upload className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium">Selecciona un archivo</span>
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
          <span className="text-[11px] text-muted-foreground">JPG, PNG o PDF · máx. 10 MB</span>
          <input
            id={inputId}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files?.[0] ?? null)}
          />
        </label>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
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
    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
          active
            ? "bg-primary text-primary-foreground border-primary"
            : done
            ? "bg-primary/20 text-primary border-primary"
            : "bg-muted text-muted-foreground border-border"
        }`}
      >
        {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : number}
      </div>
      <span
        className={`text-xs font-semibold uppercase tracking-wide ${
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

function DateOfBirthPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (iso: string) => void;
}) {
  const today = new Date();
  const maxYear = today.getFullYear() - 14;
  const minYear = 1940;

  const [day, setDay] = useState(value?.slice(8, 10) ?? "");
  const [month, setMonth] = useState(value?.slice(5, 7) ?? "");
  const [year, setYear] = useState(value?.slice(0, 4) ?? "");

  useEffect(() => {
    if (!value) return;
    setDay(value.slice(8, 10));
    setMonth(value.slice(5, 7));
    setYear(value.slice(0, 4));
  }, [value]);

  const commit = (nextDay: string, nextMonth: string, nextYear: string) => {
    const dayNumber = Number(nextDay);
    const monthNumber = Number(nextMonth);
    const yearNumber = Number(nextYear);
    const hasCompleteDate = nextDay.length > 0 && nextMonth.length > 0 && nextYear.length === 4;

    if (!hasCompleteDate) {
      onChange("");
      return;
    }

    const daysInMonth = new Date(yearNumber, monthNumber, 0).getDate();
    const isValidDate =
      yearNumber >= minYear &&
      yearNumber <= maxYear &&
      monthNumber >= 1 &&
      monthNumber <= 12 &&
      dayNumber >= 1 &&
      dayNumber <= daysInMonth;

    onChange(
      isValidDate
        ? `${nextYear}-${String(monthNumber).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`
        : ""
    );
  };

  const updatePart = (part: "day" | "month" | "year", rawValue: string) => {
    const cleaned = rawValue.replace(/\D/g, "").slice(0, part === "year" ? 4 : 2);
    const nextDay = part === "day" ? cleaned : day;
    const nextMonth = part === "month" ? cleaned : month;
    const nextYear = part === "year" ? cleaned : year;

    setDay(nextDay);
    setMonth(nextMonth);
    setYear(nextYear);
    commit(nextDay, nextMonth, nextYear);
  };

  const completeButInvalid = day.length > 0 && month.length > 0 && year.length === 4 && !value;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[0.8fr_0.8fr_1fr] gap-2">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Día</span>
          <Input
            value={day}
            onChange={(event) => updatePart("day", event.target.value)}
            inputMode="numeric"
            maxLength={2}
            placeholder="15"
            className="h-12 text-center text-base"
            autoComplete="bday-day"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Mes</span>
          <Input
            value={month}
            onChange={(event) => updatePart("month", event.target.value)}
            inputMode="numeric"
            maxLength={2}
            placeholder="08"
            className="h-12 text-center text-base"
            autoComplete="bday-month"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Año</span>
          <Input
            value={year}
            onChange={(event) => updatePart("year", event.target.value)}
            inputMode="numeric"
            maxLength={4}
            placeholder="1998"
            className="h-12 text-center text-base"
            autoComplete="bday-year"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Escribe la fecha en formato día / mes / año.</p>
      {completeButInvalid && (
        <p className="text-xs text-destructive">Revisa la fecha introducida.</p>
      )}
    </div>
  );
}
