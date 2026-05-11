import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "¡Hola! Soy tu asistente virtual de Ready2Go. Puedo ayudarte con precios, packs, bonos, servicios y cualquier duda sobre nuestra autoescuela.",
};

const SUGGESTED_QUESTIONS = [
  "¿Qué packs tenéis disponibles?",
  "¿Cuáles son los precios?",
  "¿Qué bono me recomiendas?",
  "¿Cómo puedo reservar?",
  "¿Qué incluye cada servicio?",
  "¿Tenéis promociones actuales?",
];

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ChatWidget() {
  const { user, session, loading: authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [anonId, setAnonId] = useState<string | null>(null);
  const historyLoadedForRef = useRef<string | null>(null);

  // Stable anonymous id so visitors can keep one persisted conversation.
  useEffect(() => {
    const storageKey = "ready2go_chat_anon_id";
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      setAnonId(existing);
      return;
    }
    const next = crypto.randomUUID();
    localStorage.setItem(storageKey, next);
    setAnonId(next);
  }, []);

  const callChatAssistant = useCallback(
    async (body: Record<string, unknown>) => {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      return fetch(`${SUPABASE_URL}/functions/v1/chat-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${session?.access_token ?? SUPABASE_KEY}`,
        },
        body: JSON.stringify({ anonId, ...body }),
      });
    },
    [anonId, session?.access_token],
  );

  // Load a single persisted conversation for logged-in users or visitors.
  useEffect(() => {
    if (authLoading || !anonId) return;
    const historyKey = user?.id ?? anonId;
    if (historyLoadedForRef.current === historyKey) return;
    historyLoadedForRef.current = historyKey;

    (async () => {
      try {
        const res = await callChatAssistant({ action: "history" });
        const data = await res.json();
        if (Array.isArray(data?.messages) && data.messages.length > 0) {
          setMessages([
            WELCOME_MESSAGE,
            ...data.messages
              .filter((m: ChatMessage) => m.role === "user" || m.role === "assistant")
              .map((m: ChatMessage) => ({ role: m.role, content: m.content })),
          ]);
        }
      } catch (error) {
        console.error("chat history error", error);
      }
    })();
  }, [anonId, authLoading, callChatAssistant, user?.id]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: ChatMessage = { role: "user", content: trimmed };
      const nextMessages = [...messages, userMsg];
      setMessages([...nextMessages, { role: "assistant", content: "" }]);
      setInput("");
      setLoading(true);

      try {
        // Send only user/assistant turns (exclude welcome to keep context clean)
        const conversationForApi = nextMessages
          .filter((_, i) => !(i === 0 && nextMessages[0].role === "assistant" && nextMessages[0].content === WELCOME_MESSAGE.content))
          .map((m) => ({ role: m.role, content: m.content }));

        const res = await callChatAssistant({ action: "message", messages: conversationForApi });

        if (!res.ok || !res.body) {
          let errMsg = "Lo siento, ha habido un problema. Por favor inténtalo de nuevo o escríbenos a reservas@autoescuelago.es.";
          try {
            const j = await res.json();
            if (j?.error) errMsg = j.error;
          } catch {}
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "assistant", content: errMsg };
            return copy;
          });
          setLoading(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
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
              if (typeof delta === "string" && delta.length > 0) {
                assistantText += delta;
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = { role: "assistant", content: assistantText };
                  return copy;
                });
              }
            } catch {
              // ignore malformed lines
            }
          }
        }

      } catch (err) {
        console.error("chat error", err);
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content:
              "No he podido conectarme. Por favor inténtalo de nuevo en unos segundos o escríbenos a reservas@autoescuelago.es.",
          };
          return copy;
        });
      } finally {
        setLoading(false);
      }
    },
    [callChatAssistant, loading, messages],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const hasUserMessages = messages.some((m) => m.role === "user");

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="chat-fab"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeCurve }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Abrir chat de asistencia"
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[60] h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center hover:shadow-primary/60 transition-shadow"
          >
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-background animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: easeCurve }}
            className="fixed z-[60] bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[400px] h-[100dvh] sm:h-[600px] sm:max-h-[80vh] sm:rounded-2xl bg-background border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 via-background to-background">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm font-['Space_Grotesk'] truncate">Asistente Ready2Go</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    En línea
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar chat"
                className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <MessageBubble key={i} role={m.role} content={m.content} />
              ))}
              {loading && messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-1.5 px-1 py-2">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "120ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "240ms" }} />
                </div>
              )}

              {/* Suggested questions, only before the user has written */}
              {!hasUserMessages && !loading && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={onSubmit} className="border-t border-border p-3 bg-background">
              <div className="flex items-end gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta…"
                  disabled={loading}
                  className="flex-1 h-10 rounded-full px-4 text-sm bg-muted/60 border border-transparent focus:outline-none focus:border-primary/40 focus:bg-background transition-colors disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Enviar mensaje"
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-all shrink-0",
                    input.trim() && !loading
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed",
                  )}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Asistente virtual de Ready2Go
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: easeCurve }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap break-words",
          isUser
            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3.5 py-2 shadow-sm"
            : "text-foreground",
        )}
      >
        {content || (isUser ? "" : "…")}
      </div>
    </motion.div>
  );
}
