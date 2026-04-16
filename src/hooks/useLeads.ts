import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useClinic } from "@/contexts/ClinicContext";
import { Database } from "@/integrations/supabase/types";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type LeadChannel = Database["public"]["Enums"]["lead_channel"];

export const LEAD_STATUSES: { value: LeadStatus; label: string; color: string }[] = [
  { value: "novo", label: "Novo", color: "bg-info" },
  { value: "qualificado", label: "Qualificado", color: "bg-success" },
  { value: "em_atendimento", label: "Em Atendimento", color: "bg-warning" },
  { value: "agendado", label: "Agendado", color: "bg-primary" },
  { value: "compareceu", label: "Compareceu", color: "bg-accent" },
  { value: "convertido", label: "Convertido", color: "bg-success" },
  { value: "perdido", label: "Perdido", color: "bg-destructive" },
];

export const LEAD_CHANNELS: { value: LeadChannel; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "indicacao", label: "Indicação" },
  { value: "manual", label: "Manual" },
  { value: "outro", label: "Outro" },
];

export function useLeads() {
  const { activeClinicId } = useClinic();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!activeClinicId) {
      setLeads([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("leads")
      .select("*")
      .eq("clinic_id", activeClinicId)
      .order("created_at", { ascending: false });
    setLeads(data ?? []);
    setLoading(false);
  }, [activeClinicId]);

  useEffect(() => {
    load();
  }, [load]);

  return { leads, loading, reload: load };
}
