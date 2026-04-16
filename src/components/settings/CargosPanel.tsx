import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Shield, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ALL_MODULES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "atendimento", label: "Atendimento" },
  { key: "leads", label: "Leads" },
  { key: "agenda", label: "Agenda" },
  { key: "ia-config", label: "Config. IA" },
  { key: "upload", label: "Upload" },
  { key: "suporte", label: "Suporte" },
  { key: "configuracoes", label: "Configurações" },
] as const;

interface Role {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  role_permissions: { module: string }[];
}

const CargosPanel = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("roles")
      .select("*, role_permissions(module)")
      .order("is_system", { ascending: false })
      .order("name");
    setRoles((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const togglePermission = async (roleId: string, module: string, enabled: boolean) => {
    if (enabled) {
      const { error } = await supabase.from("role_permissions").insert({ role_id: roleId, module: module as any });
      if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      const { error } = await supabase.from("role_permissions").delete().eq("role_id", roleId).eq("module", module as any);
      if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
    load();
  };

  const createRole = async () => {
    if (!newName.trim()) return toast({ title: "Nome obrigatório", variant: "destructive" });
    const { error } = await supabase.from("roles").insert({ name: newName.trim(), description: newDesc.trim() || null });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Cargo criado" });
    setNewName(""); setNewDesc(""); setOpen(false);
    load();
  };

  const deleteRole = async (id: string) => {
    if (!confirm("Excluir este cargo? Usuários perderão essa atribuição.")) return;
    const { error } = await supabase.from("roles").delete().eq("id", id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Cargo excluído" });
    load();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Cargos & Permissões</h1>
          <p className="text-muted-foreground text-sm mt-1">Defina o que cada cargo pode acessar</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5"><Plus className="h-4 w-4" /> Novo Cargo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Criar novo cargo</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Financeiro" />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Opcional" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={createRole}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Carregando...</p>
      ) : (
        <div className="grid gap-4">
          {roles.map((role) => {
            const enabledModules = new Set(role.role_permissions.map((p) => p.module));
            return (
              <Card key={role.id} className="border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {role.name}
                      {role.is_system && (
                        <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="h-2.5 w-2.5" /> Sistema
                        </span>
                      )}
                    </CardTitle>
                    {role.description && <p className="text-xs text-muted-foreground">{role.description}</p>}
                  </div>
                  {!role.is_system && (
                    <button onClick={() => deleteRole(role.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Módulos permitidos</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ALL_MODULES.map((m) => {
                      const checked = enabledModules.has(m.key);
                      const isAdminRole = role.name === "Administrador";
                      return (
                        <label
                          key={m.key}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border border-border/40 transition-colors ${isAdminRole ? "opacity-60 cursor-not-allowed" : "hover:bg-muted/30 cursor-pointer"}`}
                        >
                          <Checkbox
                            checked={checked}
                            disabled={isAdminRole}
                            onCheckedChange={(v) => togglePermission(role.id, m.key, !!v)}
                          />
                          <span className="text-sm">{m.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CargosPanel;
