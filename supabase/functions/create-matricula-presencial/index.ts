import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "matriculas";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);
const FILES = [
  { key: "contrato_firmado", column: "contrato_firmado_url" },
  { key: "dni_anverso", column: "dni_anverso_url" },
  { key: "dni_reverso", column: "dni_reverso_url" },
] as const;
const POBLACIONES = new Set(["Villanueva del Pardillo", "Valdemorillo"]);

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const extOf = (file: File) => {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "application/pdf": "pdf",
  };
  return map[file.type] ?? "bin";
};

const readText = (form: FormData, key: string, required = true) => {
  const v = form.get(key);
  if (typeof v === "string" && v.trim()) return v.trim();
  if (required) throw new Error(`Falta el campo ${key}`);
  return "";
};

const readFile = (form: FormData, key: string) => {
  const v = form.get(key);
  if (!(v instanceof File) || v.size === 0) {
    throw new Error(`Falta el archivo ${key}`);
  }
  if (!ALLOWED_TYPES.has(v.type)) {
    throw new Error(`Formato no permitido en ${key}. Sube JPG, PNG o PDF.`);
  }
  if (v.size > MAX_FILE_SIZE) {
    throw new Error(`El archivo ${key} supera 10 MB.`);
  }
  return v;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const anon = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  // ---- Auth ----
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "No autorizado" }, 401);

  const userClient = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) return json({ error: "No autorizado" }, 401);

  const admin = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // ---- Role check (server-side) ----
  const { data: rolesData, error: rolesErr } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id);
  if (rolesErr) return json({ error: "Error verificando permisos" }, 500);
  const roles = (rolesData ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("secretaria") && !roles.includes("admin")) {
    return json({ error: "Permisos insuficientes" }, 403);
  }

  const matriculaId = crypto.randomUUID();
  const uploaded: string[] = [];

  try {
    const form = await req.formData();
    const force = form.get("force") === "true";

    const packId = readText(form, "pack_id");
    const estadoPago = readText(form, "estado_pago");
    if (!["pendiente", "pagada"].includes(estadoPago)) {
      throw new Error("estado_pago inválido");
    }

    const { data: pack, error: packErr } = await admin
      .from("packs_matricula")
      .select("id, name, price")
      .eq("id", packId)
      .eq("is_active", true)
      .maybeSingle();
    if (packErr) throw packErr;
    if (!pack) throw new Error("El pack seleccionado no está disponible.");

    const email = readText(form, "email").toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Email inválido");
    const dni = readText(form, "dni").toUpperCase();
    const city = readText(form, "city");
    if (!POBLACIONES.has(city)) throw new Error("Población inválida");

    // ---- Duplicate guard ----
    if (!force) {
      const { data: dup } = await admin
        .from("matriculas")
        .select("id, email, dni, estado_pago")
        .or(`email.eq.${email},dni.eq.${dni}`);
      if (dup && dup.length > 0) {
        const dupPaid = dup.find((d) => d.estado_pago === "pagada");
        return json(
          {
            warning: "duplicate",
            duplicates: dup.length,
            paid: !!dupPaid,
            message: dupPaid
              ? "Ya existe una matrícula PAGADA con este email o DNI. Confirma para crear otra."
              : "Ya existe una matrícula con este email o DNI. Confirma para crear otra.",
          },
          409,
        );
      }
    }

    // ---- Uploads ----
    const paths: Record<string, string> = {};
    for (const item of FILES) {
      const file = readFile(form, item.key);
      const path = `${matriculaId}/${item.key}/${Date.now()}-${crypto.randomUUID()}.${extOf(file)}`;
      const { error: upErr } = await admin.storage
        .from(BUCKET)
        .upload(path, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });
      if (upErr) throw upErr;
      uploaded.push(path);
      paths[item.column] = path;
    }

    const isPagada = estadoPago === "pagada";
    const payload = {
      id: matriculaId,
      full_name: readText(form, "full_name"),
      dni,
      date_of_birth: readText(form, "date_of_birth"),
      email,
      phone: readText(form, "phone", false),
      address: readText(form, "address"),
      postal_code: readText(form, "postal_code", false),
      city,
      pack_id: pack.id,
      pack_name: pack.name,
      precio: pack.price,
      contrato_asociado: readText(form, "contrato_asociado", false),
      estado_pago: isPagada ? "pagada" : "pendiente",
      estado_matricula: isPagada ? "completada" : "pendiente_pago",
      status: isPagada ? "completada" : "pendiente_pago",
      fecha_pago: isPagada ? new Date().toISOString() : null,
      user_id: null,
      ...paths,
    };

    const { error: insErr } = await admin.from("matriculas").insert(payload);
    if (insErr) throw insErr;

    return json({ id: matriculaId, estado_pago: payload.estado_pago });
  } catch (e) {
    if (uploaded.length > 0) {
      await admin.storage.from(BUCKET).remove(uploaded);
    }
    console.error("create-matricula-presencial error", e);
    return json(
      { error: e instanceof Error ? e.message : "No se pudo crear la matrícula" },
      400,
    );
  }
});
