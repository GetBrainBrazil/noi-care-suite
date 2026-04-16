import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lead, LEAD_CHANNELS, LEAD_STATUSES } from "@/hooks/useLeads";
import { Mail, Phone, User, Calendar, Tag, FileText, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onEdit: (l: Lead) => void;
  onDeleted: () => void;
}

const fmtBRL = (v: number | null) =>
  v == null ? "—" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const fmtDate = (s: string | null) =>
  s ? new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

export function LeadDetailDrawer({ lead, open, onOpenChange, onEdit, onDeleted }: Props) {
  const { toast } = useToast();
  if (!lead) return null;

  const status = LEAD_STATUSES.find((s) => s.value === lead.status);
  const channel = LEAD_CHANNELS.find((c) => c.value === lead.channel);

  const handleDelete = async () => {
    const { error } = await supabase.from("leads").delete().eq("id", lead.id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Lead excluído" });
    onDeleted();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                {lead.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div>
                <SheetTitle className="text-left">{lead.name}</SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                  {status && (
                    <Badge variant="secondary" className="text-[10px]">
                      <span className={`w-1.5 h-1.5 rounded-full ${status.color} mr-1.5`} />
                      {status.label}
                    </Badge>
                  )}
                  {channel && <Badge variant="outline" className="text-[10px]">{channel.label}</Badge>}
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onEdit(lead)}>
            <Pencil className="h-3.5 w-3.5" /> Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5 text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" /> Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir lead?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todas as conversas e follow-ups vinculados também serão removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Separator className="my-4" />

        <Section title="Contato">
          <Row icon={<Phone className="h-3.5 w-3.5" />} label="Telefone" value={lead.phone ?? "—"} />
          <Row icon={<Mail className="h-3.5 w-3.5" />} label="E-mail" value={lead.email ?? "—"} />
          <Row icon={<User className="h-3.5 w-3.5" />} label="CPF" value={lead.cpf ?? "—"} />
        </Section>

        <Section title="Comercial">
          <Row icon={<Tag className="h-3.5 w-3.5" />} label="Procedimento" value={lead.procedure_interest ?? "—"} />
          <Row label="Valor estimado" value={fmtBRL(lead.estimated_value_brl ? Number(lead.estimated_value_brl) : null)} />
          <Row label="Score" value={lead.score != null ? `${lead.score} / 100` : "—"} />
          <Row label="Origem" value={lead.source_campaign ?? lead.referral_source ?? "—"} />
        </Section>

        <Section title="Atividade">
          <Row icon={<Calendar className="h-3.5 w-3.5" />} label="Última interação" value={fmtDate(lead.last_interaction_at)} />
          <Row label="Criado em" value={fmtDate(lead.created_at)} />
        </Section>

        {lead.notes && (
          <Section title="Notas">
            <div className="flex gap-2 text-sm text-muted-foreground">
              <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p className="whitespace-pre-wrap">{lead.notes}</p>
            </div>
          </Section>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium text-foreground text-right truncate max-w-[60%]">{value}</span>
    </div>
  );
}
