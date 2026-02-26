import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const { studentName, studentEmail, teacherName, teacherEmail, bookingDate, slots } = await req.json();

    if (!studentEmail || !bookingDate || !slots?.length) {
      throw new Error("Missing required fields");
    }

    const dateObj = new Date(bookingDate + "T00:00:00");
    const formattedDate = dateObj.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const slotsHtml = slots
      .map((s: { start: string; end: string }) => `<li style="padding:6px 0;font-size:16px;">🕐 ${s.start} - ${s.end}</li>`)
      .join("");

    // --- Email to student ---
    const studentHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#1e40af;padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;">🚗 AutoescuelaGO</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Confirmación de reserva</p>
    </div>
    <div style="padding:32px 24px;">
      <p style="font-size:16px;color:#1a1a2e;margin:0 0 20px;">
        ¡Hola <strong>${studentName || "alumno/a"}</strong>! 👋
      </p>
      <p style="font-size:15px;color:#4a4a68;margin:0 0 24px;">
        Tu clase práctica ha sido reservada con éxito. Aquí tienes los detalles:
      </p>
      <div style="background:#f0f4ff;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;">👨‍🏫 Profesor</td>
            <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:600;text-align:right;">${teacherName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;">📅 Fecha</td>
            <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:600;text-align:right;">${formattedDate}</td>
          </tr>
        </table>
        <hr style="border:none;border-top:1px solid #d4d8e8;margin:12px 0;" />
        <p style="color:#6b7280;font-size:14px;margin:0 0 8px;">Horario${slots.length > 1 ? "s" : ""}:</p>
        <ul style="list-style:none;padding:0;margin:0;">
          ${slotsHtml}
        </ul>
      </div>
      <div style="background:#fef3c7;border-radius:10px;padding:14px 16px;margin-bottom:24px;">
        <p style="font-size:13px;color:#92400e;margin:0;">
          ⚠️ <strong>Recuerda:</strong> Si necesitas cancelar, hazlo con al menos 24 horas de antelación desde tu panel de reservas.
        </p>
      </div>
      <p style="font-size:14px;color:#6b7280;margin:0;text-align:center;">
        ¡Nos vemos en clase! 🎉
      </p>
    </div>
    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="font-size:12px;color:#9ca3af;margin:0;">
        © 2026 AutoescuelaGO · Villanueva del Pardillo
      </p>
    </div>
  </div>
</body>
</html>`;

    // --- Email to teacher ---
    const teacherHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#059669;padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;">🚗 AutoescuelaGO</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Nueva reserva de alumno</p>
    </div>
    <div style="padding:32px 24px;">
      <p style="font-size:16px;color:#1a1a2e;margin:0 0 20px;">
        ¡Hola <strong>${teacherName}</strong>! 👋
      </p>
      <p style="font-size:15px;color:#4a4a68;margin:0 0 24px;">
        Un alumno ha reservado una clase práctica contigo. Aquí tienes los detalles:
      </p>
      <div style="background:#f0fdf4;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;">🎓 Alumno</td>
            <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:600;text-align:right;">${studentName || "Sin nombre"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;">📅 Fecha</td>
            <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:600;text-align:right;">${formattedDate}</td>
          </tr>
        </table>
        <hr style="border:none;border-top:1px solid #bbf7d0;margin:12px 0;" />
        <p style="color:#6b7280;font-size:14px;margin:0 0 8px;">Horario${slots.length > 1 ? "s" : ""}:</p>
        <ul style="list-style:none;padding:0;margin:0;">
          ${slotsHtml}
        </ul>
      </div>
      <p style="font-size:14px;color:#6b7280;margin:0;text-align:center;">
        Puedes ver todos tus horarios en tu panel de profesor. 📋
      </p>
    </div>
    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="font-size:12px;color:#9ca3af;margin:0;">
        © 2026 AutoescuelaGO · Villanueva del Pardillo
      </p>
    </div>
  </div>
</body>
</html>`;

    // Send student email
    const studentRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AutoescuelaGO <onboarding@resend.dev>",
        to: [studentEmail],
        subject: `✅ Reserva confirmada - ${formattedDate}`,
        html: studentHtml,
      }),
    });

    const studentResult = await studentRes.json();
    if (!studentRes.ok) {
      console.error("Resend error (student):", studentResult);
      throw new Error(studentResult.message || "Error sending student email");
    }

    // Send teacher email (if teacherEmail provided)
    let teacherResult = null;
    if (teacherEmail) {
      const teacherRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "AutoescuelaGO <onboarding@resend.dev>",
          to: [teacherEmail],
          subject: `📅 Nueva reserva - ${studentName || "Alumno"} - ${formattedDate}`,
          html: teacherHtml,
        }),
      });
      teacherResult = await teacherRes.json();
      if (!teacherRes.ok) {
        console.error("Resend error (teacher):", teacherResult);
      }
    }

    return new Response(JSON.stringify({ success: true, studentId: studentResult.id, teacherId: teacherResult?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
