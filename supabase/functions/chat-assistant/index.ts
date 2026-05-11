// Lovable AI chat assistant for Autoescuela Ready2Go website
// Streams responses using Lovable AI Gateway and persists one conversation per user/browser.
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const KNOWLEDGE_BASE = `
Eres el asistente virtual de la Autoescuela Ready2Go. Tu rol es ayudar a los visitantes a resolver dudas comerciales y de atención al cliente, en español, con tono cercano, profesional y orientado a la conversión.

INFORMACIÓN DE LA AUTOESCUELA READY2GO:
- Web oficial: autoescuelago.es
- Email de contacto / reservas: reservas@autoescuelago.es
- Ubicaciones principales: Ready2Go Villanueva del Pardillo y Ready2Go Valdemorillo.
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
- Garantía "Aprueba sin vueltas" con las condiciones anteriores.

LAS PRÁCTICAS:
- Clases de conducción de 45 minutos.
- Reserva online desde la app: el alumno elige día y hora dentro de la disponibilidad.
- Lunes a Viernes 09:00-20:00.
- Máximo 2 clases consecutivas el mismo día.
- Cada alumno tiene un profesor asignado.

PACKS DE MATRÍCULA / CURSOS:
- Pack Básico — 69€: Matrícula + 3 clases. Incluye Manual Online Permiso B, Aula Virtual, test online ilimitados, clases en DIRECTO y 3 clases prácticas de 45 min.
- Pack Avanzado — 229€: Matrícula + 5 clases + 1 examen práctico. Incluye Manual Online Permiso B, Aula Virtual, test online ilimitados, clases en DIRECTO, 5 clases prácticas de 45 min y 1 examen práctico.
- Pack Completo — 944€: Matrícula todo incluido. Incluye Manual Online Permiso B, Aula Virtual, clases teóricas online en directo, clases en DIRECTO, 2 tramitaciones, 20 clases prácticas de 45 min, 1 examen práctico y tasa DGT de 94,05€.
- Pack Premium (Ávila) — 1350€: Apto para Villanueva del Pardillo y Valdemorillo, sin lista de espera. Incluye Manual Online Permiso B, Aula Virtual, clases teóricas online en directo, test online ilimitados, 2 tramitaciones, tasa DGT de 94,05€, 20 clases prácticas y 1 examen práctico.

BONOS Y PRECIOS DE CLASES PRÁCTICAS:
- Clase práctica individual de 45 min — 38,50€.
- Bono 6 clases prácticas — 222€ (ahorra 9€).
- Bono 11 clases prácticas — 390€ (ahorra 33,50€).
- Tasas de tráfico — 94,05€.
- Gestión y tramitación — 50€.
- El precio del examen práctico individual no figura publicado en la web; si te lo preguntan, indícalo claramente y ofrece reservas@autoescuelago.es para confirmarlo. No inventes un precio.
- El pago online se hace de forma segura mediante Stripe (tarjeta).
- Tras el pago, las clases quedan disponibles en el saldo del alumno y se descuentan según se reservan.

CÓMO REGISTRARSE EN LA WEB:
- El registro se hace dentro de esta misma web (autoescuelago.es). NO existe otra web oficial distinta, no derives a ninguna página externa.
- Pasos: hacer clic en el icono de perfil (arriba a la derecha en la barra de navegación) y pulsar "Registrarse" (también accesible en /registro).
- Importante: hay que registrarse con el MISMO correo con el que se hizo la matrícula, para vincular correctamente la cuenta.
- Tras registrarse, recibirá un email de confirmación; al confirmarlo podrá iniciar sesión.

CÓMO RESERVAR CLASES PRÁCTICAS:
1. Registrarse o iniciar sesión (icono de perfil → Registrarse / Iniciar sesión).
2. Comprar un pack o bono desde el área de Pagos/Matrícula.
3. Acceder a Reservas y elegir día, hora y profesor según disponibilidad.
4. Recibir confirmación por email.

PÁGINAS ÚTILES DE LA WEB:
- /inicio: presentación general y por qué Ready2Go.
- /la-teorica: detalles del curso teórico.
- /las-practicas: detalles de las clases prácticas.
- /autoescuelas-ready2go/villanueva-del-pardillo y /autoescuelas-ready2go/valdemorillo: información de cada centro.
- /autoescuela-online: opción 100% online con descuentos.
- /matriculate: formulario y packs para apuntarse.
- /registro: crear cuenta.
- /reservas: reservar clases prácticas.
- /pagos: comprar packs de clases.

REGLAS DE COMPORTAMIENTO (MUY IMPORTANTES):
- Responde SIEMPRE en español, con tono cercano, claro y profesional.
- Sé breve por defecto, pero si preguntan por precios, packs o bonos, da primero la información concreta disponible arriba.
- NO derives directamente a una página si tienes la información en esta base de conocimiento. Primero responde con los precios, packs, bonos o detalles; después, si procede, añade una frase corta indicando dónde continuar.
- NO inventes precios, descuentos, disponibilidad ni características no indicadas aquí. Si falta un dato exacto, dilo claramente y ofrece reservas@autoescuelago.es como alternativa de contacto.
- Si el usuario duda entre bonos, recomienda el Bono 11 si va a hacer varias prácticas porque tiene mayor descuento, o el Bono 6 si quiere empezar con menos compromiso.
- No prometas plazos oficiales de examen porque dependen de la DGT.
- No des consejos médicos, legales fuera del ámbito de conducción, ni opiniones políticas.
`;

type ChatMessage = { role: "user" | "assistant"; content: string };

const isUuid = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const sanitizeMessages = (messages: unknown): ChatMessage[] => {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (m): m is ChatMessage =>
        m &&
        typeof m === "object" &&
        ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
        typeof (m as ChatMessage).content === "string",
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const action = body?.action === "history" ? "history" : "message";
    const anonId = isUuid(body?.anonId) ? body.anonId : null;
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: token ? { Authorization: `Bearer ${token}` } : {} },
    });
    const serviceClient = createClient(supabaseUrl, serviceRoleKey);

    let userId: string | null = null;
    if (token && token !== anonKey) {
      const { data } = await authClient.auth.getUser(token);
      userId = data.user?.id ?? null;
    }

    if (!userId && !anonId) {
      return jsonResponse({ error: "No se ha podido identificar la conversación." }, 400);
    }

    const ownerColumn = userId ? "user_id" : "anon_id";
    const ownerValue = userId ?? anonId;

    if (action === "history") {
      const { data, error } = await serviceClient
        .from("chat_messages")
        .select("role, content, created_at")
        .eq(ownerColumn, ownerValue)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) {
        console.error("chat history load error", error);
        return jsonResponse({ error: "No se pudo cargar el historial." }, 500);
      }

      return jsonResponse({ messages: sanitizeMessages(data) });
    }

    const messages = sanitizeMessages(body?.messages);
    if (messages.length === 0) {
      return jsonResponse({ error: "El mensaje está vacío." }, 400);
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      const { error } = await serviceClient.from("chat_messages").insert({
        user_id: userId,
        anon_id: userId ? null : anonId,
        role: "user",
        content: lastUserMessage.content,
      });
      if (error) console.error("chat user message persist error", error);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return jsonResponse({ error: "Missing LOVABLE_API_KEY" }, 500);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Lovable-API-Key": LOVABLE_API_KEY,
        "X-Lovable-AIG-SDK": "manual-edge-stream",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [
          { role: "system", content: KNOWLEDGE_BASE },
          ...messages,
        ],
      }),
    });

    if (!response.ok || !response.body) {
      if (response.status === 429) {
        return jsonResponse({ error: "Demasiadas solicitudes. Inténtalo en unos segundos." }, 429);
      }
      if (response.status === 402) {
        return jsonResponse({ error: "Se han agotado los créditos de IA. Contacta con el equipo." }, 402);
      }
      const text = await response.text();
      return jsonResponse({ error: "AI gateway error", details: text }, 500);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = "";
    let buffer = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(value);
            buffer += chunk;
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine.startsWith("data:")) continue;
              const payload = trimmedLine.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const json = JSON.parse(payload);
                const delta = json.choices?.[0]?.delta?.content;
                if (typeof delta === "string") assistantText += delta;
              } catch {
                // Ignore gateway comments and partial chunks.
              }
            }
          }

          if (assistantText.trim()) {
            const { error } = await serviceClient.from("chat_messages").insert({
              user_id: userId,
              anon_id: userId ? null : anonId,
              role: "assistant",
              content: assistantText,
            });
            if (error) console.error("chat assistant message persist error", error);
          }
        } catch (error) {
          console.error("chat stream error", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("chat-assistant error", err);
    return jsonResponse({ error: String(err) }, 500);
  }
});
