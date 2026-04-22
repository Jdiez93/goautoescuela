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
    const [{ data: rolesData }, { data: profileData }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("profiles").select("full_name, email, phone, avatar_url").eq("user_id", userId).maybeSingle(),
    ]);
    const userRoles = (rolesData ?? []).map((r) => r.role as UserRole);
    setRoles(userRoles);
    setProfile(profileData ?? null);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchUserData(session.user.id), 0);
      } else {
        setRoles([]);
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

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
