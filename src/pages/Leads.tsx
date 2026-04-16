import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, LayoutGrid, List, Loader2 } from "lucide-react";
import { useLeads, LEAD_STATUSES, LEAD_CHANNELS, Lead, LeadStatus, LeadChannel } from "@/hooks/useLeads";
import { LeadFormDialog } from "@/components/crm/LeadFormDialog";
import { LeadDetailDrawer } from "@/components/crm/LeadDetailDrawer";
import { LeadKanban } from "@/components/crm/LeadKanban";

const fmtBRL = (v: number | null) =>
  v == null ? "—" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

const Leads = () => {
  const { leads, loading, reload } = useLeads();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [channelFilter, setChannelFilter] = useState<LeadChannel | "all">("all");
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (channelFilter !== "all" && l.channel !== channelFilter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.procedure_interest?.toLowerCase().includes(q)
      );
    });
  }, [leads, search, statusFilter, channelFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const conv = leads.filter((l) => l.status === "convertido").length;
    const pipeline = leads
      .filter((l) => !["convertido", "perdido"].includes(l.status))
      .reduce((s, l) => s + Number(l.estimated_value_brl ?? 0), 0);
    return { total, conv, pipeline, rate: total ? Math.round((conv / total) * 100) : 0 };
  }, [leads]);

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (l: Lead) => { setEditing(l); setFormOpen(true); setDrawerOpen(false); };
  const openDetail = (l: Lead) => { setSelected(l); setDrawerOpen(true); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Mini CRM</h1>
          <p className="text-muted-foreground text-sm mt-1">Pipeline de leads e oportunidades</p>
        </div>
        <Button className="gap-2" onClick={openNew}>
          <Plus className="h-4 w-4" /> Novo Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total de leads" value={stats.total.toString()} />
        <StatCard label="Convertidos" value={stats.conv.toString()} accent="text-success" />
        <StatCard label="Taxa de conversão" value={`${stats.rate}%`} accent="text-primary" />
        <StatCard label="Pipeline ativo" value={fmtBRL(stats.pipeline)} accent="text-foreground" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome, telefone, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="h-9 w-[160px] text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {LEAD_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={channelFilter} onValueChange={(v) => setChannelFilter(v as any)}>
          <SelectTrigger className="h-9 w-[140px] text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os canais</SelectItem>
            {LEAD_CHANNELS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="ml-auto">
          <TabsList className="h-9">
            <TabsTrigger value="kanban" className="text-xs gap-1.5"><LayoutGrid className="h-3.5 w-3.5" /> Pipeline</TabsTrigger>
            <TabsTrigger value="table" className="text-xs gap-1.5"><List className="h-3.5 w-3.5" /> Tabela</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando leads...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground mb-4">
              {leads.length === 0 ? "Nenhum lead ainda. Crie o primeiro!" : "Nenhum lead corresponde aos filtros."}
            </p>
            {leads.length === 0 && <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Criar lead</Button>}
          </CardContent>
        </Card>
      ) : view === "kanban" ? (
        <LeadKanban leads={filtered} onSelect={openDetail} onChanged={reload} />
      ) : (
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr className="border-b border-border/50">
                  <Th>Lead</Th><Th>Canal</Th><Th>Procedimento</Th>
                  <Th>Valor Est.</Th><Th>Score</Th><Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => {
                  const status = LEAD_STATUSES.find((s) => s.value === lead.status);
                  const channel = LEAD_CHANNELS.find((c) => c.value === lead.channel);
                  return (
                    <tr key={lead.id} onClick={() => openDetail(lead)}
                      className="border-b border-border/30 last:border-0 hover:bg-muted/30 cursor-pointer transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground">{lead.name}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.phone ?? "—"}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px]">{channel?.label}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{lead.procedure_interest ?? "—"}</td>
                      <td className="py-3 px-4 font-medium">{fmtBRL(lead.estimated_value_brl ? Number(lead.estimated_value_brl) : null)}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          (lead.score ?? 0) >= 80 ? "text-success" : (lead.score ?? 0) >= 50 ? "text-warning" : "text-muted-foreground"
                        }`}>{lead.score ?? "—"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-[10px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${status?.color} mr-1.5`} />
                          {status?.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <LeadFormDialog open={formOpen} onOpenChange={setFormOpen} lead={editing} onSaved={reload} />
      <LeadDetailDrawer
        lead={selected} open={drawerOpen} onOpenChange={setDrawerOpen}
        onEdit={openEdit} onDeleted={reload}
      />
    </div>
  );
};

const StatCard = ({ label, value, accent = "text-foreground" }: { label: string; value: string; accent?: string }) => (
  <Card className="border-border/50 shadow-sm">
    <CardContent className="p-4">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${accent}`}>{value}</p>
    </CardContent>
  </Card>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left py-3 px-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{children}</th>
);

export default Leads;
