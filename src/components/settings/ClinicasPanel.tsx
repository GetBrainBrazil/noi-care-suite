import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Building2, Plus, Power, PowerOff, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useClinic } from "@/contexts/ClinicContext";

interface Clinic {
  id: string; name: string; cnpj: string | null; phone: string | null;
  email: string | null; address: string | null; is_active: boolean;
}

const empty = { name: "", cnpj: "", phone: "", email: "", address: "" };

const ClinicasPanel = () => {
  const { refresh } = useClinic();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Clinic | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("clinics").select("*").order("name");
    setClinics((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (c: Clinic) => {
    setEditing(c);
    setForm({
      name: c.name, cnpj: c.cnpj ?? "", phone: c.phone ?? "",
      email: c.email ?? "", address: c.address ?? "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) return toast({ title: "Nome obrigatório", variant: "destructive" });
    const payload = {
      name: form.name.trim(),
      cnpj: form.cnpj.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
    };
    const { error } = editing
      ? await supabase.from("clinics").update(payload).eq("id", editing.id)
      : await supabase.from("clinics").insert(payload);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: editing ? "Clínica atualizada" : "Clínica criada" });
    setOpen(false);
    await load();
    await refresh();
  };

  const toggleActive = async (c: Clinic) => {
    const { error } = await supabase.from("clinics").update({ is_active: !c.is_active }).eq("id", c.id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: c.is_active ? "Clínica desativada" : "Clínica ativada" });
    load();
    refresh();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Clínicas</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie as unidades da rede</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5" onClick={openNew}><Plus className="h-4 w-4" /> Nova Clínica</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar clínica" : "Nova clínica"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: NOI Odonto Barra" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>CNPJ</Label>
                  <Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Telefone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>E-mail</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Endereço</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={save}>{editing ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Carregando...</p>
      ) : clinics.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma clínica cadastrada.</p>
      ) : (
        <div className="grid gap-3">
          {clinics.map((c) => (
            <Card key={c.id} className="border-border/50 shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1 min-w-0">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    {c.name}
                    {!c.is_active && (
                      <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        Inativa
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground truncate">
                    {[c.cnpj, c.phone, c.email].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => toggleActive(c)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title={c.is_active ? "Desativar" : "Ativar"}>
                    {c.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                  </button>
                </div>
              </CardHeader>
              {c.address && (
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">{c.address}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClinicasPanel;
