import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, UserCog } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserRow {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  user_roles: { role_id: string; roles: { name: string } | null }[];
}
interface Role { id: string; name: string }

const statusBadge: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  approved: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
};
const statusLabel: Record<string, string> = { pending: "Pendente", approved: "Aprovado", rejected: "Rejeitado" };

const UsuariosPanel = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");

  const load = async () => {
    setLoading(true);
    const [{ data: profilesData }, { data: rolesData }] = await Promise.all([
      supabase.from("profiles").select("*, user_roles(role_id, roles(name))").order("created_at", { ascending: false }),
      supabase.from("roles").select("id, name").order("name"),
    ]);
    setUsers((profilesData as any) ?? []);
    setRoles((rolesData as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (userId: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("profiles").update({ status }).eq("user_id", userId);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: status === "approved" ? "Usuário aprovado" : "Usuário rejeitado" });
    load();
  };

  const assignRole = async (userId: string, roleId: string) => {
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role_id: roleId });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Cargo atribuído" });
    load();
  };

  const filtered = users.filter((u) => (tab === "all" ? true : u.status === tab));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold">Usuários</h1>
        <p className="text-muted-foreground text-sm mt-1">Aprove novos cadastros e gerencie cargos</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="approved">Aprovados</TabsTrigger>
          <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><UserCog className="h-4 w-4" /> {filtered.length} usuário(s)</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Carregando...</p>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Nenhum usuário nesta categoria.</p>
              ) : (
                <div className="space-y-3">
                  {filtered.map((u) => {
                    const currentRoleId = u.user_roles[0]?.role_id ?? "";
                    return (
                      <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                            {(u.full_name || u.email).slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{u.full_name || "Sem nome"}</p>
                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[u.status]}`}>
                            {statusLabel[u.status]}
                          </span>
                          <Select value={currentRoleId} onValueChange={(v) => assignRole(u.user_id, v)}>
                            <SelectTrigger className="h-8 w-[160px] text-xs">
                              <SelectValue placeholder="Atribuir cargo" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((r) => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {u.status !== "approved" && (
                            <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={() => updateStatus(u.user_id, "approved")}>
                              <Check className="h-3.5 w-3.5" /> Aprovar
                            </Button>
                          )}
                          {u.status !== "rejected" && (
                            <Button size="sm" variant="outline" className="h-8 gap-1 text-xs text-destructive hover:text-destructive" onClick={() => updateStatus(u.user_id, "rejected")}>
                              <X className="h-3.5 w-3.5" /> Rejeitar
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsuariosPanel;
