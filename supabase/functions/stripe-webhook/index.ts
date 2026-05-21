import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const log = (...args: unknown[]) => console.log("[stripe-webhook]", ...args);
const errLog = (...args: unknown[]) => console.error("[stripe-webhook]", ...args);

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
    errLog("Signature verification failed:", (err as Error).message);
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  log("Event received:", event.type, event.id);

  try {
    switch (event.type) {
      // ============================================================
      // PAGO COMPLETADO (Checkout)
      // ============================================================
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        const amountTotal = (session.amount_total || 0) / 100;

        // --- Flujo MATRÍCULA ---
        if (metadata.matricula_id) {
          const matriculaId = metadata.matricula_id;
          log("checkout.session.completed (matricula)", { matriculaId, amountTotal });

          // Idempotencia: si ya está pagada no hacemos nada
          const { data: existing } = await supabaseAdmin
            .from("matriculas")
            .select("id, estado_pago")
            .eq("id", matriculaId)
            .maybeSingle();

          if (!existing) {
            errLog("Matrícula no encontrada:", matriculaId);
            return new Response("Matricula not found", { status: 200 });
          }
          if (existing.estado_pago === "pagada") {
            log("Matrícula ya estaba pagada, ignorando (idempotente)");
            return new Response(JSON.stringify({ received: true, idempotent: true }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            });
          }

          const { error } = await supabaseAdmin
            .from("matriculas")
            .update({
              estado_pago: "pagada",
              estado_matricula: "completada",
              status: "pagada",
              stripe_payment_intent_id: session.payment_intent as string,
              stripe_session_id: session.id,
              fecha_pago: new Date().toISOString(),
            })
            .eq("id", matriculaId);

          if (error) {
            errLog("Error actualizando matrícula:", error);
            return new Response("Database error", { status: 500 });
          }
          log("Matrícula marcada como pagada");
          break;
        }

        // --- Flujo BONOS DE CLASES ---
        const userId = metadata.user_id;
        const packId = metadata.pack_id;
        const classes = parseInt(metadata.classes || "0", 10);
        log("checkout.session.completed (bono)", { userId, packId, classes, amountTotal });

        if (!userId || !classes) {
          errLog("Missing user_id or classes en metadata");
          return new Response("Missing metadata", { status: 400 });
        }

        // Idempotencia: ¿ya existe un payment con este payment_intent?
        const piId = session.payment_intent as string;
        if (piId) {
          const { data: existingPay } = await supabaseAdmin
            .from("payments")
            .select("id")
            .eq("stripe_payment_id", piId)
            .maybeSingle();
          if (existingPay) {
            log("Pago de bono ya registrado, ignorando");
            break;
          }
        }

        const { error } = await supabaseAdmin.from("payments").insert({
          user_id: userId,
          pack_id: packId || null,
          amount: amountTotal,
          classes_purchased: classes,
          classes_remaining: classes,
          status: "completed",
          stripe_payment_id: piId,
        });
        if (error) {
          errLog("Error insertando payment:", error);
          return new Response("Database error", { status: 500 });
        }
        log("Bono registrado");
        break;
      }

      // ============================================================
      // SESIÓN EXPIRADA (no se completó el pago en 30 min)
      // ============================================================
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const matriculaId = session.metadata?.matricula_id;
        if (!matriculaId) break;

        log("checkout.session.expired (matricula)", matriculaId);

        // Solo actualizamos si seguía pendiente (idempotencia)
        const { error } = await supabaseAdmin
          .from("matriculas")
          .update({ estado_pago: "pendiente" })
          .eq("id", matriculaId)
          .neq("estado_pago", "pagada");

        if (error) errLog("Error en expired:", error);
        break;
      }

      // ============================================================
      // PAYMENT INTENT - éxito (redundante con checkout.session.completed
      // pero útil si falla esa entrega)
      // ============================================================
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const matriculaId = pi.metadata?.matricula_id;
        if (!matriculaId) break;

        log("payment_intent.succeeded (matricula)", matriculaId);

        const { data: existing } = await supabaseAdmin
          .from("matriculas")
          .select("estado_pago")
          .eq("id", matriculaId)
          .maybeSingle();

        if (!existing || existing.estado_pago === "pagada") {
          log("Ya pagada o no encontrada, ignorando");
          break;
        }

        const { error } = await supabaseAdmin
          .from("matriculas")
          .update({
            estado_pago: "pagada",
            estado_matricula: "completada",
            status: "pagada",
            stripe_payment_intent_id: pi.id,
            fecha_pago: new Date().toISOString(),
          })
          .eq("id", matriculaId);
        if (error) errLog("Error en PI succeeded:", error);
        break;
      }

      // ============================================================
      // PAYMENT INTENT - fallido
      // ============================================================
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const matriculaId = pi.metadata?.matricula_id;
        if (!matriculaId) break;

        log("payment_intent.payment_failed (matricula)", matriculaId, pi.last_payment_error?.message);

        const { error } = await supabaseAdmin
          .from("matriculas")
          .update({
            estado_pago: "fallido",
            stripe_payment_intent_id: pi.id,
          })
          .eq("id", matriculaId)
          .neq("estado_pago", "pagada");
        if (error) errLog("Error en PI failed:", error);
        break;
      }

      default:
        log("Evento no gestionado:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    errLog("Handler error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
