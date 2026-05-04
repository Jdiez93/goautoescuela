import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { paymentIntentId, sessionId } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    let pi: string | null = paymentIntentId ?? null;

    // If only sessionId provided, resolve the payment_intent
    if (!pi && sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      pi = (session.payment_intent as string) || null;
      // Verify ownership via metadata
      if (session.metadata?.user_id && session.metadata.user_id !== user.id) {
        throw new Error("Not allowed");
      }
    } else if (pi) {
      // Verify the user owns this payment by checking the payments table
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );
      const { data: payment } = await supabaseAdmin
        .from("payments")
        .select("user_id")
        .eq("stripe_payment_id", pi)
        .maybeSingle();
      if (!payment || payment.user_id !== user.id) {
        throw new Error("Not allowed");
      }
    }

    if (!pi) throw new Error("Missing payment reference");

    const intent = await stripe.paymentIntents.retrieve(pi, {
      expand: ["latest_charge"],
    });
    const charge = intent.latest_charge as Stripe.Charge | null;
    const receiptUrl = charge?.receipt_url ?? null;

    if (!receiptUrl) throw new Error("Recibo no disponible todavía");

    return new Response(JSON.stringify({ receiptUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("get-receipt-url error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
