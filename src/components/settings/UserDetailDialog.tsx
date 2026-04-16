import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ShieldCheck, Building2, Mail, Phone, Calendar, MapPin, Stethoscope,
  IdCard, Pencil, Save, X, Sparkles, Clock, Hash, Plus, Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useClinic } from "@/contexts/ClinicContext";

export interface UserDetail {
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

interface ClinicMembership {
  clinic_id: string;
  clinic_name: string;
  role_name: string | null;
  modules: string[];
}

interface Props {
  user: UserDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canEdit: boolean;
  activeClinicId: string | null;
  onChanged?: () => void;
}

const SPECIALIZATIONS = [
  "Ortodontia", "Implantodontia", "Endodontia", "Periodontia",
  "Estética", "Odontopediatria", "Cirurgia", "Prótese", "Clínico Geral",
];

const moduleLabels: Record<string, string> = {
  dashboard: "Dashboard", atendimento: "Atendimento", leads: "Leads",
  agenda: "Agenda", "ia-config": "IA Config", upload: "Upload",
  suporte: "Suporte", configuracoes: "Configurações",
};

const formatDate = (s?: string | null) => {
  if (!s) return "—";
  try { return new Date(s).toLocaleDateString("pt-BR"); } catch { return "—"; }
};
const formatDateTime = (s?: string | null) => {
  if (!s) return "—";
  try { return new Date(s).toLocaleString("pt-BR"); } catch { return "—"; }
};

export function UserDetailDialog({ user, open, onOpenChange, canEdit, activeClinicId, onChanged }: Props) {
  const [memberships, setMemberships] = useState<ClinicMembership[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<UserDetail>>({});

  useEffect(() => {
    if (!user || !open) return;
    setEditing(false);
    setForm({
      phone: user.phone ?? "",
      birth_date: user.birth_date ?? "",
      address: user.address ?? "",
      cro: user.cro ?? "",
      specializations: user.specializations ?? [],
      procedures: user.procedures ?? [],
      bio: user.bio ?? "",
    });

    (async () => {
      const { data } = await supabase
        .from("clinic_members")
        .select("clinic_id, clinics(name), roles(name, role_permissions(module))")
        .eq("user_id", user.user_id);
      const mapped: ClinicMembership[] = (data ?? []).map((m: any) => ({
        clinic_id: m.clinic_id,
        clinic_name: m.clinics?.name ?? "—",
        role_name: m.roles?.name ?? null,
        modules: (m.roles?.role_permissions ?? []).map((p: any) => p.module),
      }));
      setMemberships(mapped);
    })();
  }, [user, open]);

  if (!user) return null;

  const initials = (user.full_name || user.email).slice(0, 2).toUpperCase();
  const activeMembership = memberships.find((m) => m.clinic_id === activeClinicId);
  const isDentist = !!activeMembership?.role_name?.toLowerCase().includes("dentista");
  const activeModules = activeMembership?.modules ?? [];

  const toggleSpec = (spec: string) => {
    const cur = form.specializations ?? [];
    setForm({
      ...form,
      specializations: cur.includes(spec) ? cur.filter((s) => s !== spec) : [...cur, spec],
    });
  };

  const save = async () => {
    setSaving(true);
    const procedures = typeof (form.procedures as any) === "string"
      ? (form.procedures as any).split(",").map((s: string) => s.trim()).filter(Boolean)
      : form.procedures;
    const payload: any = {
      phone: form.phone || null,
      birth_date: form.birth_date || null,
      address: form.address || null,
      cro: form.cro || null,
      specializations: form.specializations?.length ? form.specializations : null,
      procedures: procedures?.length ? procedures : null,
      bio: form.bio || null,
    };
    const { error } = await supabase.from("profiles").update(payload).eq("user_id", user.user_id);
    setSaving(false);
    if (error) return toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    toast({ title: "Dados atualizados" });
    setEditing(false);
    onChanged?.();
  };

  const proceduresValue = Array.isArray(form.procedures)
    ? (form.procedures as string[]).join(", ")
    : (form.procedures as any) ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Detalhes do usuário</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-border/50">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center text-xl font-semibold text-primary ring-1 ring-primary/15 shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold truncate">{user.full_name || "Sem nome"}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5 truncate">
              <Mail className="h-3.5 w-3.5 shrink-0" /> {user.email}
            </p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <Badge
                variant="outline"
                className={user.status === "approved"
                  ? "border-success/40 text-success bg-success/10"
                  : user.status === "pending"
                  ? "border-warning/40 text-warning bg-warning/10"
                  : "border-destructive/40 text-destructive bg-destructive/10"}
              >
                {user.status === "approved" ? "Ativo" : user.status === "pending" ? "Pendente" : "Rejeitado"}
              </Badge>
              {isDentist && (
                <Badge className="bg-primary/15 text-primary hover:bg-primary/15 gap-1">
                  <Stethoscope className="h-3 w-3" /> Dentista
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Acesso & Permissões */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5" /> Acesso & Permissões
          </h3>
          <div className="space-y-2">
            {memberships.length === 0 ? (
              <p className="text-sm text-muted-foreground">Não vinculado a nenhuma unidade.</p>
            ) : (
              memberships.map((m) => (
                <div
                  key={m.clinic_id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    m.clinic_id === activeClinicId ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/20"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium truncate">{m.clinic_name}</span>
                    {m.clinic_id === activeClinicId && (
                      <Badge variant="outline" className="h-5 text-[10px] border-primary/40 text-primary">Atual</Badge>
                    )}
                  </div>
                  <Badge variant="secondary" className="font-normal">{m.role_name ?? "Sem cargo"}</Badge>
                </div>
              ))
            )}
          </div>
          {activeModules.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Módulos liberados na unidade atual</p>
              <div className="flex flex-wrap gap-1.5">
                {activeModules.map((mod) => (
                  <Badge key={mod} variant="outline" className="font-normal text-xs">
                    {moduleLabels[mod] ?? mod}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </section>

        <Separator />

        {/* Dados Profissionais */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5" /> Dados Profissionais
            </h3>
            {canEdit && !editing && (
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="h-7 gap-1.5">
                <Pencil className="h-3.5 w-3.5" /> Editar
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">CRO</Label>
                  <Input value={form.cro ?? ""} onChange={(e) => setForm({ ...form, cro: e.target.value })} placeholder="Ex: CRO-RJ 12345" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Telefone / WhatsApp</Label>
                  <Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(21) 99999-9999" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Especializações</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SPECIALIZATIONS.map((s) => {
                    const active = form.specializations?.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSpec(s)}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:border-primary/40"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Procedimentos / Áreas de atuação (separados por vírgula)</Label>
                <Input
                  value={proceduresValue}
                  onChange={(e) => setForm({ ...form, procedures: e.target.value as any })}
                  placeholder="Ex: Clareamento, Facetas, Lentes de contato"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Bio / Mini currículo</Label>
                <Textarea
                  value={form.bio ?? ""}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Breve descrição profissional"
                  rows={3}
                />
              </div>
              <Separator />
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contato & Pessoal</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Data de nascimento</Label>
                  <Input type="date" value={form.birth_date ?? ""} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Endereço</Label>
                  <Input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Rua, número, bairro" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoRow icon={IdCard} label="CRO" value={user.cro} />
              <InfoRow icon={Phone} label="Telefone" value={user.phone} />
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Especializações</p>
                {user.specializations?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {user.specializations.map((s) => (
                      <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">—</p>}
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Procedimentos / Áreas</p>
                {user.procedures?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {user.procedures.map((s) => (
                      <Badge key={s} variant="outline" className="font-normal">{s}</Badge>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">—</p>}
              </div>
              {user.bio && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Bio</p>
                  <p className="text-sm leading-relaxed">{user.bio}</p>
                </div>
              )}
              <Separator className="col-span-2 my-1" />
              <InfoRow icon={Calendar} label="Nascimento" value={formatDate(user.birth_date)} />
              <InfoRow icon={MapPin} label="Endereço" value={user.address} />
            </div>
          )}
        </section>

        <Separator />

        {/* Sistema */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
            <Clock className="h-3.5 w-3.5" /> Sistema
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoRow icon={Calendar} label="Cadastrado em" value={formatDateTime(user.created_at)} />
            <InfoRow icon={Clock} label="Último acesso" value={user.last_sign_in_at ? formatDateTime(user.last_sign_in_at) : "—"} />
            <div className="col-span-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span className="font-mono truncate">{user.user_id}</span>
            </div>
          </div>
        </section>

        <DialogFooter>
          {editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                <X className="h-4 w-4 mr-1.5" /> Cancelar
              </Button>
              <Button onClick={save} disabled={saving}>
                <Save className="h-4 w-4 mr-1.5" /> {saving ? "Salvando..." : "Salvar"}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="text-sm">{value || "—"}</p>
    </div>
  );
}
