import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Endpoint público. Devuelve solo email + estado_pago de una matrícula
 * a partir del stripe_session_id (que es un ID aleatorio de Stripe).
 * No expone otros datos personales ni permite listar matrículas.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");
    if (!sessionId) throw new Error("Falta session_id");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data, error } = await admin
      .from("matriculas")
      .select("email, estado_pago, estado_matricula")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        found: !!data,
        email: data?.email ?? null,
        estado_pago: data?.estado_pago ?? null,
        estado_matricula: data?.estado_matricula ?? null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
