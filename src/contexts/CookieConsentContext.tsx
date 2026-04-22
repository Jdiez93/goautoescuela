import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CookieCategories = {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

type CookieConsentContextValue = {
  consent: CookieCategories | null;
  hasDecided: boolean;
  showBanner: boolean;
  showSettings: boolean;
  loading: boolean;
  acceptAll: () => Promise<void>;
  rejectAll: () => Promise<void>;
  savePreferences: (prefs: Omit<CookieCategories, "necessary">) => Promise<void>;
  openSettings: () => void;
  closeSettings: () => void;
  revokeConsent: () => Promise<void>;
};

const ANON_COOKIE_NAME = "ago_anon_id";
const POLICY_VERSION = "v1";

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

// --- Helpers cookie (solo para el anon_id, que es técnico/necesario) ---
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function getOrCreateAnonId(): string {
  let id = getCookie(ANON_COOKIE_NAME);
  if (!id) {
    id = crypto.randomUUID();
    setCookie(ANON_COOKIE_NAME, id, 365);
  }
  return id;
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieCategories | null>(null);
  const [hasDecided, setHasDecided] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [anonId, setAnonId] = useState<string>("");

  // Cargar consentimiento desde la base de datos al iniciar
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const id = getOrCreateAnonId();
      if (cancelled) return;
      setAnonId(id);

      try {
        const { data, error } = await supabase
          .from("cookie_consents")
          .select("necessary, preferences, analytics, marketing")
          .eq("anon_id", id)
          .maybeSingle();

        if (cancelled) return;

        if (!error && data) {
          setConsent({
            necessary: true,
            preferences: data.preferences,
            analytics: data.analytics,
            marketing: data.marketing,
          });
          setHasDecided(true);
        } else {
          setShowBanner(true);
        }
      } catch {
        if (!cancelled) setShowBanner(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(
    async (value: CookieCategories) => {
      if (!anonId) return;

      // Optimistic UI
      setConsent(value);
      setHasDecided(true);
      setShowBanner(false);

      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id ?? null;

        // Comprobar si ya existe para hacer update vs insert
        const { data: existing } = await supabase
          .from("cookie_consents")
          .select("id")
          .eq("anon_id", anonId)
          .maybeSingle();

        const payload = {
          anon_id: anonId,
          user_id: userId,
          necessary: true,
          preferences: value.preferences,
          analytics: value.analytics,
          marketing: value.marketing,
          policy_version: POLICY_VERSION,
          user_agent: navigator.userAgent.slice(0, 500),
          source_url: window.location.pathname,
        };

        if (existing) {
          await supabase
            .from("cookie_consents")
            .update(payload)
            .eq("anon_id", anonId);
        } else {
          await supabase.from("cookie_consents").insert(payload);
        }
      } catch (err) {
        console.error("Error guardando consentimiento de cookies", err);
      }
    },
    [anonId],
  );

  const acceptAll = useCallback(
    () => persist({ necessary: true, preferences: true, analytics: true, marketing: true }),
    [persist],
  );

  const rejectAll = useCallback(
    () => persist({ necessary: true, preferences: false, analytics: false, marketing: false }),
    [persist],
  );

  const savePreferences = useCallback(
    async (prefs: Omit<CookieCategories, "necessary">) => {
      await persist({ necessary: true, ...prefs });
      setShowSettings(false);
    },
    [persist],
  );

  const openSettings = useCallback(() => setShowSettings(true), []);
  const closeSettings = useCallback(() => setShowSettings(false), []);

  const revokeConsent = useCallback(async () => {
    if (anonId) {
      try {
        await supabase.from("cookie_consents").delete().eq("anon_id", anonId);
      } catch {
        // los visitantes no admin no pueden borrar; lo desactivamos en BD igualmente
        try {
          await supabase
            .from("cookie_consents")
            .update({
              preferences: false,
              analytics: false,
              marketing: false,
            })
            .eq("anon_id", anonId);
        } catch {
          // ignore
        }
      }
    }
    deleteCookie(ANON_COOKIE_NAME);
    setConsent(null);
    setHasDecided(false);
    setShowSettings(false);
    setAnonId(getOrCreateAnonId());
    setShowBanner(true);
  }, [anonId]);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasDecided,
        showBanner,
        showSettings,
        loading,
        acceptAll,
        rejectAll,
        savePreferences,
        openSettings,
        closeSettings,
        revokeConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
}
