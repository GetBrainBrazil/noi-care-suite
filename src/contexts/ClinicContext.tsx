import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Clinic {
  id: string;
  name: string;
  cnpj: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  is_active: boolean;
}

type AppModule =
  | "dashboard" | "atendimento" | "leads" | "agenda"
  | "ia-config" | "upload" | "suporte" | "configuracoes";

interface ClinicContextValue {
  clinics: Clinic[];
  activeClinic: Clinic | null;
  activeClinicId: string | null;
  switchClinic: (id: string) => void;
  clinicModules: AppModule[];
  isClinicAdmin: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ClinicContext = createContext<ClinicContextValue | undefined>(undefined);
const STORAGE_KEY = "noi.activeClinicId";

export function ClinicProvider({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [activeClinicId, setActiveClinicId] = useState<string | null>(null);
  const [clinicModules, setClinicModules] = useState<AppModule[]>([]);
  const [isClinicAdmin, setIsClinicAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadClinics = useCallback(async () => {
    if (!user) {
      setClinics([]);
      setActiveClinicId(null);
      setLoading(false);
      return;
    }
    setLoading(true);

    // Super admin sees all active clinics; others see only those they're members of
    const { data } = isAdmin
      ? await supabase.from("clinics").select("*").order("name")
      : await supabase
          .from("clinics")
          .select("*, clinic_members!inner(user_id)")
          .eq("clinic_members.user_id", user.id)
          .order("name");

    const list = (data ?? []).map((c: any) => ({
      id: c.id, name: c.name, cnpj: c.cnpj, phone: c.phone,
      email: c.email, address: c.address, is_active: c.is_active,
    })) as Clinic[];

    setClinics(list);

    const stored = localStorage.getItem(STORAGE_KEY);
    const next = list.find((c) => c.id === stored)?.id ?? list[0]?.id ?? null;
    setActiveClinicId(next);
    if (next) localStorage.setItem(STORAGE_KEY, next);
    setLoading(false);
  }, [user, isAdmin]);

  const loadClinicPermissions = useCallback(async (clinicId: string) => {
    if (!user) return;
    if (isAdmin) {
      // Super admin = full access
      setIsClinicAdmin(true);
      setClinicModules([
        "dashboard","atendimento","leads","agenda","ia-config","upload","suporte","configuracoes",
      ]);
      return;
    }
    const { data } = await supabase
      .from("clinic_members")
      .select("role_id, roles(name, role_permissions(module))")
      .eq("user_id", user.id)
      .eq("clinic_id", clinicId)
      .maybeSingle();

    const roleName: string = (data as any)?.roles?.name ?? "";
    const perms: AppModule[] = ((data as any)?.roles?.role_permissions ?? [])
      .map((rp: any) => rp.module as AppModule);
    setIsClinicAdmin(roleName === "Administrador");
    setClinicModules(perms);
  }, [user, isAdmin]);

  useEffect(() => { loadClinics(); }, [loadClinics]);

  useEffect(() => {
    if (activeClinicId) loadClinicPermissions(activeClinicId);
    else { setClinicModules([]); setIsClinicAdmin(false); }
  }, [activeClinicId, loadClinicPermissions]);

  const switchClinic = (id: string) => {
    setActiveClinicId(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const activeClinic = clinics.find((c) => c.id === activeClinicId) ?? null;

  return (
    <ClinicContext.Provider value={{
      clinics, activeClinic, activeClinicId, switchClinic,
      clinicModules, isClinicAdmin, loading, refresh: loadClinics,
    }}>
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error("useClinic must be used within ClinicProvider");
  return ctx;
}
