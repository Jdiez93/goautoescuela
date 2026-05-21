import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, FileText, Info, Loader2, Plus, Upload, X } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const POBLACIONES = ["Villanueva del Pardillo", "Valdemorillo"] as const;
type Poblacion = (typeof POBLACIONES)[number];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

interface PackOption {
  id: string;
  slug: string;
  name: string;
  price: number;
}

export default function NuevaMatriculaDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: packs } = useQuery({
    queryKey: ["packs-matricula-active-form"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packs_matricula")
        .select("id, slug, name, price")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as PackOption[];
    },
  });

  const [fullName, setFullName] = useState("");
  const [dni, setDni] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState<Poblacion | "">("");
  const [packId, setPackId] = useState("");
  const [estadoPago, setEstadoPago] = useState<"pendiente" | "pagada">("pendiente");

  const [contratoFirmado, setContratoFirmado] = useState<File | null>(null);
  const [dniAnverso, setDniAnverso] = useState<File | null>(null);
  const [dniReverso, setDniReverso] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [pendingForce, setPendingForce] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const selectedPack = useMemo(() => packs?.find((p) => p.id === packId) ?? null, [packs, packId]);

  const reset = () => {
    setFullName("");
    setDni("");
    setDob("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPostalCode("");
    setCity("");
    setPackId("");
    setEstadoPago("pendiente");
    setContratoFirmado(null);
    setDniAnverso(null);
    setDniReverso(null);
    setPendingForce(false);
    setConfirmMsg(null);
    setFileError(null);
  };

  const valid =
    fullName.trim().length >= 3 &&
    /^[0-9XYZ][0-9]{7}[A-Z]$/i.test(dni.trim()) &&
    !!dob &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    address.trim().length >= 5 &&
    !!city &&
    !!packId &&
    !!contratoFirmado &&
    !!dniAnverso &&
    !!dniReverso;

  const submit = async (force = false) => {
    setFileError(null);
    if (!valid || !selectedPack) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("full_name", fullName.trim());
      fd.append("dni", dni.trim().toUpperCase());
      fd.append("date_of_birth", dob);
      fd.append("email", email.trim().toLowerCase());
      fd.append("phone", phone.trim());
      fd.append("address", address.trim());
      fd.append("postal_code", postalCode.trim());
      fd.append("city", city);
      fd.append("pack_id", selectedPack.id);
      fd.append("estado_pago", estadoPago);
      fd.append("contrato_asociado", contrato?.label ?? "");
      fd.append("contrato_firmado", contratoFirmado!);
      fd.append("dni_anverso", dniAnverso!);
      fd.append("dni_reverso", dniReverso!);
      if (force) fd.append("force", "true");

      const { data, error } = await supabase.functions.invoke("create-matricula-presencial", {
        body: fd,
      });

      if (error) {
        // Try to read duplicate warning from body
        const ctx = (error as { context?: Response }).context;
        if (ctx) {
          try {
            const parsed = await ctx.clone().json();
            if (parsed?.warning === "duplicate") {
              setConfirmMsg(parsed.message ?? "Posible duplicado");
              setPendingForce(true);
              setSubmitting(false);
              return;
            }
            if (parsed?.error) throw new Error(parsed.error);
          } catch (_) {
            // fallthrough
          }
        }
        throw error;
      }

      toast({
        title: "Matrícula presencial creada",
        description:
          data?.estado_pago === "pagada"
            ? "Guardada como pagada. El alumno ya puede registrarse con su email."
            : "Guardada como pendiente de pago.",
      });
      queryClient.invalidateQueries({ queryKey: ["matriculas-secretaria"] });
      setOpen(false);
      reset();
    } catch (err) {
      console.error(err);
      toast({
        title: "No se pudo crear la matrícula",
        description: (err as Error)?.message ?? "Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-1" /> Nueva matrícula presencial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva matrícula presencial</DialogTitle>
          <DialogDescription>
            Alta manual de una matrícula realizada en la autoescuela. El precio se carga
            automáticamente del pack.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Field label="Nombre y apellidos *">
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="María García López" />
          </Field>
          <Field label="DNI *">
            <Input value={dni} onChange={(e) => setDni(e.target.value)} placeholder="12345678A" maxLength={9} className="uppercase" />
          </Field>
          <Field label="Fecha de nacimiento *">
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </Field>
          <Field label="Correo electrónico *">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alumno@email.com" />
          </Field>
          <Field label="Teléfono">
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="600 000 000" />
          </Field>
          <Field label="Código postal">
            <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} maxLength={5} inputMode="numeric" />
          </Field>

          <div className="md:col-span-2 space-y-2">
            <Label>Dirección completa *</Label>
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} placeholder="Calle, número, piso, puerta…" />
            <Alert className="border-primary/30 bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-xs">
                Es importante que la dirección esté actualizada con el domicilio en el que reside
                actualmente, ya que ahí recibirá el carnet.
              </AlertDescription>
            </Alert>
          </div>

          <Field label="Población *">
            <Select value={city} onValueChange={(v) => setCity(v as Poblacion)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona población" />
              </SelectTrigger>
              <SelectContent>
                {POBLACIONES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Pack *">
            <Select value={packId} onValueChange={setPackId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona pack" />
              </SelectTrigger>
              <SelectContent>
                {packs?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(p.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {selectedPack && (
            <div className="md:col-span-2 rounded-lg border bg-muted/30 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Precio (desde backend):</span>{" "}
              <span className="font-semibold text-foreground">
                {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(selectedPack.price)}
              </span>
            </div>
          )}

          {/* Contrato */}
          {selectedPack && city && (
            <div className="md:col-span-2">
              {contrato ? (
                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-primary font-semibold">Contrato asociado</p>
                    <p className="font-semibold text-foreground mt-0.5">{contrato.label}</p>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <a href={contrato.file} download target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-1" /> Descargar contrato
                      </a>
                    </Button>
                  </div>
                </div>
              ) : contratoPendiente ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    El contrato para este pack y población aún no está disponible.
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
          )}

          {/* Estado del pago */}
          <Field label="Estado del pago *">
            <Select value={estadoPago} onValueChange={(v) => setEstadoPago(v as "pendiente" | "pagada")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="pagada">Pagado</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Archivos */}
          <div className="md:col-span-2 space-y-3 pt-2">
            <h4 className="font-semibold">Documentación</h4>
            <FileDropper label="Contrato firmado *" file={contratoFirmado} onChange={setContratoFirmado} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FileDropper label="DNI - Anverso *" file={dniAnverso} onChange={setDniAnverso} />
              <FileDropper label="DNI - Reverso *" file={dniReverso} onChange={setDniReverso} />
            </div>
            {fileError && <p className="text-xs text-destructive">{fileError}</p>}
          </div>

          {pendingForce && confirmMsg && (
            <div className="md:col-span-2">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{confirmMsg}</AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => { setOpen(false); reset(); }} disabled={submitting}>
            Cancelar
          </Button>
          {pendingForce ? (
            <Button onClick={() => submit(true)} disabled={submitting} variant="destructive">
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Crear de todos modos
            </Button>
          ) : (
            <Button onClick={() => submit(false)} disabled={!valid || submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Crear matrícula
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function FileDropper({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const inputId = useMemo(() => `f-${Math.random().toString(36).slice(2)}`, []);

  const handle = (f: File | null) => {
    setError(null);
    if (!f) return onChange(null);
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError("Formato no permitido. Usa JPG, PNG o PDF.");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setError("El archivo supera 10 MB.");
      return;
    }
    onChange(f);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {file ? (
        <div className="flex items-center justify-between gap-2 rounded-lg border-2 border-primary/40 bg-primary/5 p-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs truncate">{file.name}</span>
            <span className="text-[10px] text-muted-foreground shrink-0">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer py-4 px-3 text-xs text-muted-foreground"
        >
          <Upload className="w-4 h-4" />
          Selecciona archivo (JPG, PNG o PDF · máx 10 MB)
          <input
            id={inputId}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => handle(e.target.files?.[0] ?? null)}
          />
        </label>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
