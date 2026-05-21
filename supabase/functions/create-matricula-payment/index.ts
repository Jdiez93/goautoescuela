import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Mapeo slug del pack -> price_id de Stripe (modo Live)
const PRICE_IDS: Record<string, string> = {
  basico: "price_1TZRS6P3jcTmXVIw5di8yVvl",
  avanzado: "price_1TZRT7P3jcTmXVIwtc5TCx5d",
  completo: "price_1TZRTxP3jcTmXVIwaHY4Ilfy",
  premium: "price_1TZRUgP3jcTmXVIwpe6WGsN6",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { matricula_id } = await req.json();
    if (!matricula_id) throw new Error("Falta matricula_id");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data: matricula, error: mErr } = await admin
      .from("matriculas")
      .select("id, email, pack_id, estado_pago, packs_matricula:pack_id(slug, name, price)")
      .eq("id", matricula_id)
      .maybeSingle();

    if (mErr) throw mErr;
    if (!matricula) throw new Error("Matrícula no encontrada");
    if (matricula.estado_pago === "pagada") {
      throw new Error("Esta matrícula ya está pagada");
    }

    // @ts-ignore relación
    const pack = matricula.packs_matricula as { slug: string; name: string; price: number } | null;
    if (!pack) throw new Error("Pack asociado no encontrado");

    const priceId = PRICE_IDS[pack.slug];
    if (!priceId) throw new Error(`No hay price_id configurado para el pack ${pack.slug}`);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "";

    const session = await stripe.checkout.sessions.create({
      customer_email: matricula.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${origin}/matricula-exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/matricula-cancelada?matricula_id=${matricula.id}`,
      metadata: {
        matricula_id: matricula.id,
        pack_id: matricula.pack_id,
        email: matricula.email,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("create-matricula-payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
