import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppModule =
  | "dashboard"
  | "atendimento"
  | "leads"
  | "agenda"
  | "ia-config"
  | "upload"
  | "suporte"
  | "configuracoes";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  status: "pending" | "approved" | "rejected";
  avatar_url: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: string[];
  modules: AppModule[];
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [modules, setModules] = useState<AppModule[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (uid: string) => {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", uid)
      .maybeSingle();

    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("role_id, roles(name, role_permissions(module))")
      .eq("user_id", uid);

    setProfile(profileData as Profile | null);

    const roleNames: string[] = [];
    const moduleSet = new Set<AppModule>();
    (rolesData ?? []).forEach((row: any) => {
      if (row.roles?.name) roleNames.push(row.roles.name);
      (row.roles?.role_permissions ?? []).forEach((rp: any) => moduleSet.add(rp.module));
    });
    setRoles(roleNames);
    setModules(Array.from(moduleSet));
  };

  const refresh = async () => {
    if (user?.id) await loadUserData(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setTimeout(() => loadUserData(newSession.user.id), 0);
      } else {
        setProfile(null);
        setRoles([]);
        setModules([]);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadUserData(s.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setRoles([]);
    setModules([]);
  };

  const isAdmin = roles.includes("Administrador");

  return (
    <AuthContext.Provider value={{ user, session, profile, roles, modules, isAdmin, loading, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
