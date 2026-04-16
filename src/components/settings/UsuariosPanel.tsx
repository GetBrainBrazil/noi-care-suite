import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, UserCog, UserPlus, Building2, MoreHorizontal, Shield, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useClinic } from "@/contexts/ClinicContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { UserDetailDialog, type UserDetail } from "./UserDetailDialog";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  phone?: string | null;
  birth_date?: string | null;
  address?: string | null;
  cro?: string | null;
  specializations?: string[] | null;
  procedures?: string[] | null;
  bio?: string | null;
  last_sign_in_at?: string | null;
}
interface Role { id: string; name: string }
interface Membership { user_id: string; clinic_id: string; role_id: string; clinics: { name: string } | null; }

const statusBadge: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  approved: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
};
const statusLabel: Record<string, string> = { pending: "Pendente", approved: "Aprovado", rejected: "Rejeitado" };

const UsuariosPanel = () => {
  const { activeClinic, activeClinicId, clinics, isClinicAdmin } = useClinic();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("approved");
  const [addOpen, setAddOpen] = useState(false);
  const [addUserId, setAddUserId] = useState<string>("");
  const [addClinicId, setAddClinicId] = useState<string>("");
  const [addRoleId, setAddRoleId] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: profilesData }, { data: rolesData }, { data: memData }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("roles").select("id, name").order("name"),
      supabase.from("clinic_members").select("user_id, clinic_id, role_id, clinics(name)"),
    ]);
    setProfiles((profilesData as any) ?? []);
    setRoles((rolesData as any) ?? []);
    setMemberships((memData as any) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (userId: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("profiles").update({ status }).eq("user_id", userId);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: status === "approved" ? "Usuário aprovado" : "Usuário rejeitado" });
    load();
  };

  const assignRoleInActiveClinic = async (userId: string, roleId: string) => {
    if (!activeClinicId) return toast({ title: "Selecione uma clínica ativa", variant: "destructive" });
    // Upsert membership for the active clinic
    await supabase.from("clinic_members").delete()
      .eq("user_id", userId).eq("clinic_id", activeClinicId);
    const { error } = await supabase.from("clinic_members")
      .insert({ user_id: userId, clinic_id: activeClinicId, role_id: roleId });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: `Cargo atribuído em ${activeClinic?.name}` });
    load();
  };

  const removeFromClinic = async (userId: string, clinicId: string) => {
    const { error } = await supabase.from("clinic_members").delete()
      .eq("user_id", userId).eq("clinic_id", clinicId);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Removido da clínica" });
    load();
  };

  const addToOtherClinic = async () => {
    if (!addUserId || !addClinicId || !addRoleId) {
      return toast({ title: "Preencha todos os campos", variant: "destructive" });
    }
    const { error } = await supabase.from("clinic_members")
      .insert({ user_id: addUserId, clinic_id: addClinicId, role_id: addRoleId });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Usuário adicionado à clínica" });
    setAddOpen(false);
    setAddUserId(""); setAddClinicId(""); setAddRoleId("");
    load();
  };

  const membershipFor = (userId: string, clinicId: string | null) =>
    memberships.find((m) => m.user_id === userId && m.clinic_id === clinicId);

  // Show only members of the active clinic + all pending profiles (which have no clinic yet)
  const activeMemberIds = new Set(
    memberships.filter((m) => m.clinic_id === activeClinicId).map((m) => m.user_id)
  );

  const visibleProfiles = profiles.filter((p) => {
    if (p.status === "pending") return true; // show all pending so admin can approve + assign
    return activeMemberIds.has(p.user_id);
  });

  const filtered = visibleProfiles.filter((u) => (tab === "all" ? true : u.status === tab));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold">Usuários</h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            Gerenciando <span className="font-medium text-foreground">{activeClinic?.name ?? "—"}</span>
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-1.5">
              <UserPlus className="h-4 w-4" /> Adicionar a outra clínica
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Adicionar usuário a outra clínica</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <label className="text-sm">Usuário</label>
                <Select value={addUserId} onValueChange={setAddUserId}>
                  <SelectTrigger><SelectValue placeholder="Escolha um usuário aprovado" /></SelectTrigger>
                  <SelectContent>
                    {profiles.filter((p) => p.status === "approved").map((p) => (
                      <SelectItem key={p.user_id} value={p.user_id}>
                        {p.full_name || p.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm">Clínica</label>
                <Select value={addClinicId} onValueChange={setAddClinicId}>
                  <SelectTrigger><SelectValue placeholder="Escolha a clínica" /></SelectTrigger>
                  <SelectContent>
                    {clinics.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm">Cargo</label>
                <Select value={addRoleId} onValueChange={setAddRoleId}>
                  <SelectTrigger><SelectValue placeholder="Escolha o cargo" /></SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancelar</Button>
              <Button onClick={addToOtherClinic}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="approved">Ativos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCog className="h-4 w-4" /> {filtered.length} usuário(s)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Carregando...</p>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Nenhum usuário nesta categoria.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered.map((u) => {
                    const memHere = membershipFor(u.user_id, activeClinicId);
                    const otherClinics = memberships.filter(
                      (m) => m.user_id === u.user_id && m.clinic_id !== activeClinicId
                    );
                    const roleName = roles.find((r) => r.id === memHere?.role_id)?.name;
                    const initials = (u.full_name || u.email).slice(0, 2).toUpperCase();
                    return (
                      <div
                        key={u.id}
                        onClick={() => { setSelectedUser(u as UserDetail); setDetailOpen(true); }}
                        className="group relative flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md cursor-pointer transition-all"
                      >
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-semibold text-primary shrink-0 ring-1 ring-primary/10">
                          {initials}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{u.full_name || "Sem nome"}</p>
                            {u.status === "pending" && (
                              <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-warning/40 text-warning">
                                Pendente
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            {roleName ? (
                              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] gap-1 font-normal">
                                <ShieldCheck className="h-3 w-3" />
                                {roleName}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-muted-foreground font-normal">
                                Sem cargo
                              </Badge>
                            )}
                            {otherClinics.length > 0 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{otherClinics.length} {otherClinics.length === 1 ? "unidade" : "unidades"}
                              </span>
                            )}
                          </div>
                        </div>

                        {isClinicAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Shield className="h-3 w-3" /> Cargo em {activeClinic?.name}
                              </DropdownMenuLabel>
                              {roles.map((r) => (
                                <DropdownMenuItem
                                  key={r.id}
                                  onClick={() => assignRoleInActiveClinic(u.user_id, r.id)}
                                  className="cursor-pointer text-sm"
                                >
                                  {r.name}
                                  {memHere?.role_id === r.id && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              {u.status !== "approved" && (
                                <DropdownMenuItem onClick={() => updateStatus(u.user_id, "approved")} className="cursor-pointer text-sm">
                                  <Check className="h-3.5 w-3.5 mr-2" /> Aprovar usuário
                                </DropdownMenuItem>
                              )}
                              {memHere && (
                                <DropdownMenuItem
                                  onClick={() => removeFromClinic(u.user_id, activeClinicId!)}
                                  className="cursor-pointer text-sm text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Remover desta unidade
                                </DropdownMenuItem>
                              )}
                              {u.status !== "rejected" && (
                                <DropdownMenuItem
                                  onClick={() => updateStatus(u.user_id, "rejected")}
                                  className="cursor-pointer text-sm text-destructive focus:text-destructive"
                                >
                                  <X className="h-3.5 w-3.5 mr-2" /> Rejeitar usuário
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UserDetailDialog
        user={selectedUser}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        canEdit={isClinicAdmin}
        activeClinicId={activeClinicId}
        onChanged={load}
      />
    </div>
  );
};

export default UsuariosPanel;
