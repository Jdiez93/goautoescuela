import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Sandbox de Resend: hasta verificar un dominio en resend.com/domains,
// solo se puede enviar al email del propietario de la cuenta de Resend.
// Tras verificar el dominio, cambiar NOTIFY_TO a "formulario.ready2go@gmail.com".
const NOTIFY_TO = "jorgediezrodriguez2004@gmail.com";
const FORWARD_TARGET = "formulario.ready2go@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const { full_name, email, phone, message, source_page } = await req.json();

    if (!full_name || !email || !phone || !message) {
      throw new Error("Missing required fields");
    }

    const sanitize = (s: string) =>
      String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const safeName = sanitize(full_name);
    const safeEmail = sanitize(email);
    const safePhone = sanitize(phone);
    const safeMessage = sanitize(message).replace(/\n/g, "<br/>");
    const safeSource = sanitize(source_page || "/");

    const submittedAt = new Date().toLocaleString("es-ES", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Europe/Madrid",
    });

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#1e40af;padding:28px 24px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;">📩 Nuevo mensaje del formulario</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Ready2Go · Web</p>
    </div>
    <div style="padding:28px 24px;">
      <table style="width:100%;border-collapse:collapse;font-size:15px;color:#1a1a2e;">
        <tr><td style="padding:8px 0;color:#6b7280;width:120px;">👤 Nombre</td><td style="padding:8px 0;font-weight:600;">${safeName}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">✉️ Email</td><td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#1e40af;text-decoration:none;">${safeEmail}</a></td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">📞 Teléfono</td><td style="padding:8px 0;"><a href="tel:${safePhone}" style="color:#1e40af;text-decoration:none;">${safePhone}</a></td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">🌐 Página</td><td style="padding:8px 0;">${safeSource}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">🕒 Fecha</td><td style="padding:8px 0;">${submittedAt}</td></tr>
      </table>
      <div style="margin-top:20px;background:#f0f4ff;border-radius:12px;padding:18px;">
        <p style="margin:0 0 8px;color:#6b7280;font-size:13px;font-weight:600;">MENSAJE</p>
        <p style="margin:0;color:#1a1a2e;font-size:15px;line-height:1.55;">${safeMessage}</p>
      </div>
      <div style="margin-top:24px;text-align:center;">
        <a href="mailto:${safeEmail}" style="display:inline-block;background:#1e40af;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">Responder a ${safeName}</a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:14px 24px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="font-size:12px;color:#9ca3af;margin:0;">© 2026 Ready2Go · Notificación automática</p>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Ready2Go <onboarding@resend.dev>",
        to: [NOTIFY_TO],
        reply_to: email,
        subject: `📩 Nuevo contacto web - ${full_name} (reenviar a ${FORWARD_TARGET})`,
        html,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error("Resend error:", result);
      throw new Error(result.message || "Error sending email");
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
