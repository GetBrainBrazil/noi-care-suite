import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useClinic } from "@/contexts/ClinicContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import UsuariosPanel from "@/components/settings/UsuariosPanel";
import CargosPanel from "@/components/settings/CargosPanel";
import ClinicasPanel from "@/components/settings/ClinicasPanel";

const Configuracoes = () => {
  const { isAdmin } = useAuth();
  const { activeClinic, isClinicAdmin, refresh } = useClinic();
  const canManageHere = isAdmin || isClinicAdmin;
  const [tab, setTab] = useState(canManageHere ? "usuarios" : "ajustes");
  const [form, setForm] = useState({ name: "", cnpj: "", phone: "", email: "", address: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activeClinic) {
      setForm({
        name: activeClinic.name,
        cnpj: activeClinic.cnpj ?? "",
        phone: activeClinic.phone ?? "",
        email: activeClinic.email ?? "",
        address: activeClinic.address ?? "",
      });
    }
  }, [activeClinic]);

  const saveClinic = async () => {
    if (!activeClinic) return;
    setSaving(true);
    const { error } = await supabase.from("clinics").update({
      name: form.name.trim(),
      cnpj: form.cnpj.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
    }).eq("id", activeClinic.id);
    setSaving(false);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Clínica atualizada" });
    refresh();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie acessos, equipe e dados da clínica
          {activeClinic && <> · <span className="font-medium text-foreground">{activeClinic.name}</span></>}
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted/50">
          {canManageHere && <TabsTrigger value="usuarios">Usuários</TabsTrigger>}
          {canManageHere && <TabsTrigger value="cargos">Cargos & Permissões</TabsTrigger>}
          {isAdmin && <TabsTrigger value="clinicas">Clínicas</TabsTrigger>}
          <TabsTrigger value="ajustes">Ajustes da Clínica</TabsTrigger>
        </TabsList>

        {canManageHere && (
          <TabsContent value="usuarios" className="mt-4"><UsuariosPanel /></TabsContent>
        )}
        {canManageHere && (
          <TabsContent value="cargos" className="mt-4"><CargosPanel /></TabsContent>
        )}
        {isAdmin && (
          <TabsContent value="clinicas" className="mt-4"><ClinicasPanel /></TabsContent>
        )}

        <TabsContent value="ajustes" className="mt-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Dados da Clínica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80">Nome da Clínica</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-muted/30 border-border/40" disabled={!canManageHere} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80">CNPJ</Label>
                  <Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} className="bg-muted/30 border-border/40" disabled={!canManageHere} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80">Telefone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-muted/30 border-border/40" disabled={!canManageHere} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80">E-mail</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-muted/30 border-border/40" disabled={!canManageHere} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm text-foreground/80">Endereço</Label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="bg-muted/30 border-border/40" disabled={!canManageHere} />
                </div>
              </div>
              {canManageHere && (
                <div className="flex justify-end pt-2">
                  <Button className="text-sm" onClick={saveClinic} disabled={saving || !activeClinic}>
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
