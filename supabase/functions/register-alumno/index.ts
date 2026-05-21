import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { email, password, full_name } = await req.json();

    if (!email || !password || !full_name) {
      return json({ error: "Faltan datos obligatorios." }, 400);
    }
    if (typeof password !== "string" || password.length < 6) {
      return json({ error: "La contraseña debe tener al menos 6 caracteres." }, 400);
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // 1) Buscar matrícula válida para este email
    const { data: matriculas, error: matErr } = await admin
      .from("matriculas")
      .select("id, user_id, estado_pago, estado_matricula, full_name")
      .ilike("email", normalizedEmail)
      .order("created_at", { ascending: false })
      .limit(1);

    if (matErr) {
      console.error("[register-alumno] Error consultando matrícula:", matErr);
      return json({ error: "Error verificando matrícula." }, 500);
    }

    const matricula = matriculas?.[0];

    if (!matricula) {
      return json(
        {
          error:
            "No existe ninguna matrícula pagada asociada a este correo electrónico. Debes completar y pagar tu matrícula antes de registrarte.",
        },
        403
      );
    }

    if (matricula.estado_pago !== "pagada") {
      return json(
        {
          error:
            "No existe ninguna matrícula pagada asociada a este correo electrónico. Debes completar y pagar tu matrícula antes de registrarte.",
        },
        403
      );
    }

    if (matricula.estado_matricula !== "completada") {
      return json(
        {
          error:
            "Tu matrícula todavía no está completada. Contacta con secretaría para finalizar el proceso antes de registrarte.",
        },
        403
      );
    }

    if (matricula.user_id) {
      return json(
        {
          error:
            "Esta matrícula ya está asociada a una cuenta. Inicia sesión o contacta con secretaría.",
        },
        409
      );
    }

    // 2) Comprobar si ya existe usuario con ese email (idempotencia)
    const { data: existing } = await admin.auth.admin.listUsers();
    const already = existing?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );
    if (already) {
      return json(
        {
          error:
            "Ya existe una cuenta con este correo. Inicia sesión en su lugar.",
        },
        409
      );
    }

    // 3) Crear usuario (auto-confirmado: el pago ya valida el email)
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (createErr || !created?.user) {
      console.error("[register-alumno] Error creando usuario:", createErr);
      return json(
        { error: createErr?.message ?? "No se pudo crear la cuenta." },
        500
      );
    }

    const newUserId = created.user.id;

    // 4) Asociar matrícula al usuario (con guard anti-doble-uso)
    const { data: linked, error: linkErr } = await admin
      .from("matriculas")
      .update({ user_id: newUserId })
      .eq("id", matricula.id)
      .is("user_id", null)
      .select("id")
      .maybeSingle();

    if (linkErr || !linked) {
      console.error("[register-alumno] Error vinculando matrícula:", linkErr);
      // Rollback usuario para evitar cuenta huérfana
      await admin.auth.admin.deleteUser(newUserId);
      return json(
        {
          error:
            "No se pudo vincular la matrícula. Inténtalo de nuevo o contacta con secretaría.",
        },
        500
      );
    }

    // 5) Asegurar rol 'student' (el trigger handle_new_user ya lo crea, pero por si acaso)
    await admin
      .from("user_roles")
      .upsert(
        { user_id: newUserId, role: "student" },
        { onConflict: "user_id,role", ignoreDuplicates: true }
      );

    // 6) Actualizar profile con el full_name introducido
    await admin
      .from("profiles")
      .update({ full_name, email: normalizedEmail })
      .eq("user_id", newUserId);

    console.log("[register-alumno] OK", { user_id: newUserId, matricula_id: matricula.id });

    return json({ success: true, user_id: newUserId });
  } catch (e) {
    console.error("[register-alumno] Excepción:", e);
    return json({ error: (e as Error).message ?? "Error inesperado" }, 500);
  }
});
