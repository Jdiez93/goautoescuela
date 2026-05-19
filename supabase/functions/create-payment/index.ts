import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PACK_PRICES: Record<string, { priceId: string; packId: string; classes: number }> = {
  "clase-suelta": {
    priceId: "price_1TYppDP3jcTmXVIwR5He0s5x",
    packId: "24b870ce-5a49-4f83-8431-6e8fa88bc3c5",
    classes: 1,
  },
  "pack-6": {
    priceId: "price_1TYptzP3jcTmXVIw9KKjJ6eo",
    packId: "8890b7e4-e1ab-484d-af28-c4a2f0e5467b",
    classes: 6,
  },
  "pack-11": {
    priceId: "price_1TYqAAP3jcTmXVIwo921JMzB",
    packId: "c999b973-3281-4ee4-8835-b81192024eae",
    classes: 11,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");

    const { packKey } = await req.json();
    const pack = PACK_PRICES[packKey];
    if (!pack) throw new Error("Invalid pack selected");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: pack.priceId, quantity: 1 }],
      mode: "payment",
      // Explicit list excludes Link (Link only appears with automatic_payment_methods)
      payment_method_types: ["card", "klarna", "paypal", "bizum"],
      success_url: `${req.headers.get("origin")}/pagos?success=true&pack=${packKey}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pagos?canceled=true`,
      metadata: {
        user_id: user.id,
        pack_id: pack.packId,
        classes: String(pack.classes),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
