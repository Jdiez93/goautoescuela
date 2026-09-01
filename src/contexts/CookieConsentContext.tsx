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
const CONSENT_LS_KEY = "ago_cookie_consent";
const POLICY_VERSION = "v1";

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

// --- Helpers cookie (solo para el anon_id, que es tecnico/necesario) ---
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

// --- localStorage helpers para consentimiento ---
function readLocalConsent(): CookieCategories | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.necessary === true) {
      return {
        necessary: true,
        preferences: !!parsed.preferences,
        analytics: !!parsed.analytics,
        marketing: !!parsed.marketing,
      };
    }
  } catch {
    // ignore corrupt localStorage
  }
  return null;
}

function writeLocalConsent(value: CookieCategories) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_LS_KEY, JSON.stringify(value));
  } catch {
    // ignore localStorage errors
  }
}

function deleteLocalConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_LS_KEY);
  } catch {
    // ignore
  }
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieCategories | null>(null);
  const [hasDecided, setHasDecided] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [anonId, setAnonId] = useState<string>("");

  // Cargar consentimiento: primero localStorage (instantaneo), luego sincroniza con BD
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const id = getOrCreateAnonId();
      if (cancelled) return;
      setAnonId(id);

      // 1. Comprobar localStorage primero para evitar parpadeo del banner
      const local = readLocalConsent();
      if (local) {
        setConsent(local);
        setHasDecided(true);
        setShowBanner(false);
        setLoading(false);
        // Sincronizar con BD en segundo plano (via RPC segura)
        try {
          await supabase.rpc("upsert_cookie_consent", {
            p_anon_id: id,
            p_preferences: local.preferences,
            p_analytics: local.analytics,
            p_marketing: local.marketing,
            p_policy_version: POLICY_VERSION,
            p_user_agent: navigator.userAgent.slice(0, 500),
            p_source_url: window.location.pathname,
          });
        } catch {
          // ignorar errores de sincronizacion en segundo plano
        }
        return;
      }

      // 2. Si no hay localStorage, consultar BD (via RPC segura)
      try {
        const { data: rows, error } = await supabase.rpc("get_cookie_consent", { p_anon_id: id });
        const data = rows?.[0] ?? null;

        if (cancelled) return;

        if (!error && data) {
          const value: CookieCategories = {
            necessary: true,
            preferences: data.preferences,
            analytics: data.analytics,
            marketing: data.marketing,
          };
          setConsent(value);
          writeLocalConsent(value);
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

      // Optimistic UI + localStorage
      setConsent(value);
      setHasDecided(true);
      setShowBanner(false);
      writeLocalConsent(value);

      try {
        await supabase.rpc("upsert_cookie_consent", {
          p_anon_id: anonId,
          p_preferences: value.preferences,
          p_analytics: value.analytics,
          p_marketing: value.marketing,
          p_policy_version: POLICY_VERSION,
          p_user_agent: navigator.userAgent.slice(0, 500),
          p_source_url: window.location.pathname,
        });
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
        await supabase.rpc("delete_cookie_consent", { p_anon_id: anonId });
      } catch {
        // si no se puede borrar, lo desactivamos en BD igualmente
        try {
          await supabase.rpc("upsert_cookie_consent", {
            p_anon_id: anonId,
            p_preferences: false,
            p_analytics: false,
            p_marketing: false,
            p_policy_version: POLICY_VERSION,
          });
        } catch {
          // ignore
        }
      }
    }
    deleteCookie(ANON_COOKIE_NAME);
    deleteLocalConsent();
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
