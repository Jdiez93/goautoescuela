import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("No signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};
    const amountTotal = (session.amount_total || 0) / 100;

    // === Flujo MATRÍCULA ===
    if (metadata.matricula_id) {
      const matriculaId = metadata.matricula_id;
      console.log("checkout.session.completed (matricula)", { matriculaId, amountTotal });

      const { error } = await supabaseAdmin
        .from("matriculas")
        .update({
          estado_pago: "pagada",
          estado_matricula: "pagada",
          status: "pagada",
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_session_id: session.id,
          fecha_pago: new Date().toISOString(),
        })
        .eq("id", matriculaId);

      if (error) {
        console.error("Error actualizando matrícula:", error);
        return new Response("Database error", { status: 500 });
      }

      console.log("Matrícula marcada como pagada");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // === Flujo BONOS DE CLASES (existente) ===
    const userId = metadata.user_id;
    const packId = metadata.pack_id;
    const classes = parseInt(metadata.classes || "0", 10);

    console.log("checkout.session.completed (bono clases)", { userId, packId, classes, amountTotal });

    if (!userId || !classes) {
      console.error("Missing user_id or classes in metadata");
      return new Response("Missing metadata", { status: 400 });
    }

    const { error } = await supabaseAdmin.from("payments").insert({
      user_id: userId,
      pack_id: packId || null,
      amount: amountTotal,
      classes_purchased: classes,
      classes_remaining: classes,
      status: "completed",
      stripe_payment_id: session.payment_intent as string,
    });

    if (error) {
      console.error("Error inserting payment:", error);
      return new Response("Database error", { status: 500 });
    }

    console.log("Payment recorded successfully");
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
