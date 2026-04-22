import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type CookieCategories = {
  necessary: true; // siempre activas
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

type CookieConsentContextValue = {
  consent: CookieCategories | null;
  hasDecided: boolean;
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: Omit<CookieCategories, "necessary">) => void;
  openSettings: () => void;
  closeSettings: () => void;
  revokeConsent: () => void;
};

const STORAGE_KEY = "autoescuelago_cookie_consent_v1";

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieCategories | null>(null);
  const [hasDecided, setHasDecided] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CookieCategories;
        setConsent(parsed);
        setHasDecided(true);
      } else {
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  const persist = useCallback((value: CookieCategories) => {
    setConsent(value);
    setHasDecided(true);
    setShowBanner(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      localStorage.setItem(`${STORAGE_KEY}_date`, new Date().toISOString());
    } catch {
      // ignore
    }
  }, []);

  const acceptAll = useCallback(() => {
    persist({ necessary: true, preferences: true, analytics: true, marketing: true });
  }, [persist]);

  const rejectAll = useCallback(() => {
    persist({ necessary: true, preferences: false, analytics: false, marketing: false });
  }, [persist]);

  const savePreferences = useCallback(
    (prefs: Omit<CookieCategories, "necessary">) => {
      persist({ necessary: true, ...prefs });
      setShowSettings(false);
    },
    [persist],
  );

  const openSettings = useCallback(() => setShowSettings(true), []);
  const closeSettings = useCallback(() => setShowSettings(false), []);

  const revokeConsent = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(`${STORAGE_KEY}_date`);
    } catch {
      // ignore
    }
    setConsent(null);
    setHasDecided(false);
    setShowSettings(false);
    setShowBanner(true);
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasDecided,
        showBanner,
        showSettings,
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
