// Lovable AI chat assistant for Autoescuela Ready2Go website
// Streams responses using Lovable AI Gateway

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const KNOWLEDGE_BASE = `
Eres el asistente virtual de la Autoescuela Ready2Go. Tu rol es ayudar a los visitantes a resolver dudas comerciales y de atención al cliente, en español, con tono cercano, profesional y orientado a la conversión.

INFORMACIÓN DE LA AUTOESCUELA READY2GO:

- Web oficial: autoescuelago.es
- Email de contacto / reservas: reservas@autoescuelago.es
- Ubicaciones principales:
  • Autoescuela Ready2Go Villanueva del Pardillo
  • Autoescuela Ready2Go Valdemorillo
- Autoescuela online disponible con descuentos exclusivos.
- Horario de oficinas: Lunes a Viernes, 10:00-13:00 y 16:00-20:00.
- Horario de prácticas de conducción: Lunes a Viernes, 09:00-20:00, en clases de 45 minutos.

MÉTODO READY2GO (4 PILARES):
1. Método Ready2Go: enseñanza innovadora, clara y práctica que acelera el progreso del alumno.
2. App Ready2Go: área personal con test propios, vídeos, temario digital, seguimiento del progreso y reserva de prácticas eligiendo día y hora.
3. Plan y gestión personalizada: seguimiento en tiempo real del progreso en teoría y práctica con acompañamiento de los profesores.
4. Aprueba sin vueltas: si sigues el método y no apruebas la teoría en primera convocatoria, te devolvemos el dinero del curso teórico. Requisitos: conseguir 85% en el barómetro general en menos de 2 meses.

LA TEÓRICA:
- Curso teórico completo del permiso B.
- Acceso a app con test, temario digital, vídeos explicativos.
- Profesores que acompañan y evalúan el progreso.
- Garantía "Aprueba sin vueltas" (condiciones arriba).

LAS PRÁCTICAS:
- Clases de conducción de 45 minutos.
- Reserva online desde la app: el alumno elige día y hora dentro de la disponibilidad del profesor.
- Lunes a Viernes 09:00-20:00.
- Máximo 2 clases consecutivas el mismo día.
- Cancelación: hay normas para cancelar con antelación; si se cancela tarde, la clase puede contabilizar.
- Cada alumno tiene un profesor asignado.

PACKS DE CLASES PRÁCTICAS (bonos):
- Se venden en packs (por ejemplo 10 clases o 20 clases) con descuento respecto al precio suelto.
- El precio exacto y los packs activos se publican en la página de "Matricúlate" y en el dashboard de pagos.
- El pago se hace online de forma segura mediante Stripe (tarjeta).
- Tras el pago, las clases quedan disponibles en el saldo del alumno y se descuentan según se reservan.

CÓMO RESERVAR:
1. Registrarse o iniciar sesión en la web.
2. Comprar un pack de clases desde el área de pagos.
3. Acceder a "Reservas" y elegir día, hora y profesor.
4. Recibirás confirmación por email.

PÁGINAS ÚTILES DE LA WEB:
- /inicio: presentación general y por qué Ready2Go.
- /la-teorica: detalles del curso teórico.
- /las-practicas: detalles de las clases prácticas.
- /autoescuelas-ready2go/villanueva-del-pardillo y /autoescuelas-ready2go/valdemorillo: información de cada centro.
- /autoescuela-online: opción 100% online con descuentos.
- /matriculate: formulario y packs para apuntarse.
- /login y /registro: acceso al área personal.
- /dashboard: área del alumno (saldo, reservas, pagos).
- /reservas: reservar clases prácticas.
- /pagos: comprar packs de clases.
- /politica-privacidad, /aviso-legal, /condiciones-contratacion, /cookies: información legal.

REGLAS DE COMPORTAMIENTO (MUY IMPORTANTES):
- Responde SIEMPRE en español, con tono cercano, claro y profesional.
- Sé breve por defecto (1-3 frases). Solo amplía si el usuario pide detalles.
- NO inventes precios concretos, descuentos, ni características que no aparezcan arriba. Si te preguntan un precio exacto y no lo tienes, indica que el precio actualizado está en la página "Matricúlate" o en el área de pagos, y ofrece contactar con el equipo en reservas@autoescuelago.es.
- Si la pregunta no está cubierta por esta información, responde con honestidad: "No tengo ese dato exacto, te recomiendo escribirnos a reservas@autoescuelago.es o llamarnos en horario de oficina".
- Cuando sea natural, incluye una llamada a la acción: "Puedes matricularte desde /matriculate", "Puedes reservar tu clase desde /reservas", "Te recomiendo crear cuenta en /registro".
- Si el usuario duda entre packs, recomiéndale el más completo si va a hacer muchas prácticas, o el más pequeño para empezar y probar.
- No prometas plazos de examen oficiales (depende de la DGT).
- No des consejos médicos, legales fuera del ámbito de conducción, ni opiniones políticas.
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [
          { role: "system", content: KNOWLEDGE_BASE },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes. Inténtalo en unos segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Se han agotado los créditos de IA. Contacta con el equipo." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const text = await response.text();
      return new Response(JSON.stringify({ error: "AI gateway error", details: text }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("chat-assistant error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
