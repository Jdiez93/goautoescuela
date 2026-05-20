import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "matriculas";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);
const FILES = [
  { key: "contrato_firmado", column: "contrato_firmado_url" },
  { key: "dni_anverso", column: "dni_anverso_url" },
  { key: "dni_reverso", column: "dni_reverso_url" },
] as const;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const sanitizeExt = (file: File) => {
  const byType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "application/pdf": "pdf",
  };
  return byType[file.type] ?? "bin";
};

const readText = (form: FormData, key: string, required = true) => {
  const value = form.get(key);
  if (typeof value === "string" && value.trim()) return value.trim();
  if (required) throw new Error(`Falta el campo ${key}`);
  return "";
};

const readFile = (form: FormData, key: string) => {
  const value = form.get(key);
  if (!(value instanceof File) || value.size === 0) {
    throw new Error(`Falta el archivo ${key}`);
  }
  if (!ALLOWED_TYPES.has(value.type)) {
    throw new Error(`Formato no permitido en ${key}. Sube JPG, PNG o PDF.`);
  }
  if (value.size > MAX_FILE_SIZE) {
    throw new Error(`El archivo ${key} supera 10MB.`);
  }
  return value;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const matriculaId = crypto.randomUUID();
  const uploadedPaths: string[] = [];

  try {
    const form = await req.formData();
    const packId = readText(form, "pack_id");

    const { data: pack, error: packError } = await admin
      .from("packs_matricula")
      .select("id, name, price")
      .eq("id", packId)
      .eq("is_active", true)
      .maybeSingle();

    if (packError) throw packError;
    if (!pack) throw new Error("El pack seleccionado no está disponible.");

    const paths: Record<string, string> = {};
    for (const item of FILES) {
      const file = readFile(form, item.key);
      const path = `${matriculaId}/${item.key}/${Date.now()}-${crypto.randomUUID()}.${sanitizeExt(file)}`;
      const { error: uploadError } = await admin.storage
        .from(BUCKET)
        .upload(path, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });
      if (uploadError) throw uploadError;
      uploadedPaths.push(path);
      paths[item.column] = path;
    }

    const payload = {
      id: matriculaId,
      full_name: readText(form, "full_name"),
      dni: readText(form, "dni").toUpperCase(),
      date_of_birth: readText(form, "date_of_birth"),
      email: readText(form, "email").toLowerCase(),
      phone: readText(form, "phone"),
      address: readText(form, "address"),
      postal_code: readText(form, "postal_code"),
      city: readText(form, "city"),
      pack_id: pack.id,
      pack_name: pack.name,
      precio: pack.price,
      estado_matricula: "pendiente_pago",
      estado_pago: "pendiente",
      status: "pendiente_pago",
      contrato_asociado: readText(form, "contrato_asociado", false),
      ...paths,
    };

    const { error: insertError } = await admin.from("matriculas").insert(payload);
    if (insertError) throw insertError;

    return json({ id: matriculaId, ...paths });
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await admin.storage.from(BUCKET).remove(uploadedPaths);
    }
    console.error("submit-matricula error", error);
    return json({ error: error instanceof Error ? error.message : "No se pudo completar la matrícula" }, 400);
  }
});
