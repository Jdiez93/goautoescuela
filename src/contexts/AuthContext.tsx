import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "student" | "teacher" | "admin";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: UserRole | null;
  roles: UserRole[];
  isAdmin: boolean;
  isTeacher: boolean;
  profile: { full_name: string; email: string; phone: string; avatar_url: string } | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  role: null,
  roles: [],
  isAdmin: false,
  isTeacher: false,
  profile: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Pick the highest-privilege role for default routing/UX (admin > teacher > student)
const pickPrimaryRole = (roles: UserRole[]): UserRole | null => {
  if (roles.includes("admin")) return "admin";
  if (roles.includes("teacher")) return "teacher";
  if (roles.includes("student")) return "student";
  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [profile, setProfile] = useState<AuthContextType["profile"]>(null);

  const fetchUserData = async (userId: string) => {
    const [{ data: rolesData, error: rolesError }, { data: profileData, error: profileError }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("profiles").select("full_name, email, phone, avatar_url").eq("user_id", userId).maybeSingle(),
    ]);

    if (rolesError) throw rolesError;
    if (profileError) throw profileError;

    const userRoles = (rolesData ?? []).map((r) => r.role as UserRole);
    setRoles(userRoles);
    setProfile(profileData ?? null);
  };

  useEffect(() => {
    const syncSessionState = async (nextSession: Session | null) => {
      setLoading(true);
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      try {
        if (nextSession?.user) {
          await fetchUserData(nextSession.user.id);
        } else {
          setRoles([]);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error loading auth context data:", error);
        setRoles([]);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSessionState(nextSession);
    });

    void supabase.auth.getSession().then(({ data: { session } }) => syncSessionState(session));

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const role = pickPrimaryRole(roles);
  const isAdmin = roles.includes("admin");
  const isTeacher = roles.includes("teacher");

  return (
    <AuthContext.Provider value={{ user, session, loading, role, roles, isAdmin, isTeacher, profile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
