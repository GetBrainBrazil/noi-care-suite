import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useClinic } from "@/contexts/ClinicContext";
import { useToast } from "@/hooks/use-toast";
import { Lead, LEAD_CHANNELS, LEAD_STATUSES, LeadChannel, LeadStatus } from "@/hooks/useLeads";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  lead?: Lead | null;
  onSaved: () => void;
}

export function LeadFormDialog({ open, onOpenChange, lead, onSaved }: Props) {
  const { activeClinicId } = useClinic();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", channel: "whatsapp" as LeadChannel,
    status: "novo" as LeadStatus, procedure_interest: "",
    estimated_value_brl: "", score: "", notes: "",
  });

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name ?? "", phone: lead.phone ?? "", email: lead.email ?? "",
        channel: lead.channel, status: lead.status,
        procedure_interest: lead.procedure_interest ?? "",
        estimated_value_brl: lead.estimated_value_brl?.toString() ?? "",
        score: lead.score?.toString() ?? "", notes: lead.notes ?? "",
      });
    } else {
      setForm({
        name: "", phone: "", email: "", channel: "whatsapp",
        status: "novo", procedure_interest: "",
        estimated_value_brl: "", score: "", notes: "",
      });
    }
  }, [lead, open]);

  const save = async () => {
    if (!activeClinicId || !form.name.trim()) return;
    setSaving(true);
    const payload = {
      clinic_id: activeClinicId,
      name: form.name.trim(),
      phone: form.phone || null,
      email: form.email || null,
      channel: form.channel,
      status: form.status,
      procedure_interest: form.procedure_interest || null,
      estimated_value_brl: form.estimated_value_brl ? Number(form.estimated_value_brl) : null,
      score: form.score ? Number(form.score) : null,
      notes: form.notes || null,
    };
    const { error } = lead
      ? await supabase.from("leads").update(payload).eq("id", lead.id)
      : await supabase.from("leads").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: lead ? "Lead atualizado" : "Lead criado" });
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{lead ? "Editar Lead" : "Novo Lead"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Nome *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Canal</Label>
              <Select value={form.channel} onValueChange={(v) => setForm({ ...form, channel: v as LeadChannel })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LEAD_CHANNELS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as LeadStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Procedimento de interesse</Label>
            <Input value={form.procedure_interest} onChange={(e) => setForm({ ...form, procedure_interest: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Valor estimado (R$)</Label>
              <Input type="number" value={form.estimated_value_brl} onChange={(e) => setForm({ ...form, estimated_value_brl: e.target.value })} />
            </div>
            <div>
              <Label>Score (0-100)</Label>
              <Input type="number" min={0} max={100} value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Notas</Label>
            <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={save} disabled={saving || !form.name.trim()}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
