import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Phone, Mail, Calendar, MoreHorizontal, ArrowUpRight, User } from "lucide-react";

const leads = [
  { id: 1, name: "Maria Silva", phone: "(11) 99123-4567", email: "maria@email.com", channel: "WhatsApp", status: "Qualificado", procedure: "Lentes de Contato", value: "R$ 8.500", date: "06/04/2026", score: 92 },
  { id: 2, name: "João Mendes", phone: "(11) 98765-4321", email: "joao@email.com", channel: "Instagram", status: "Novo", procedure: "Clareamento", value: "R$ 1.200", date: "06/04/2026", score: 45 },
  { id: 3, name: "Ana Oliveira", phone: "(11) 97654-3210", email: "ana@email.com", channel: "WhatsApp", status: "Agendado", procedure: "Implante", value: "R$ 12.000", date: "05/04/2026", score: 78 },
  { id: 4, name: "Carlos Santos", phone: "(21) 99876-5432", email: "carlos@email.com", channel: "Instagram", status: "Qualificado", procedure: "Ortodontia", value: "R$ 6.000", date: "05/04/2026", score: 85 },
  { id: 5, name: "Beatriz Lima", phone: "(11) 96543-2109", email: "beatriz@email.com", channel: "WhatsApp", status: "Convertido", procedure: "Avaliação", value: "R$ 350", date: "04/04/2026", score: 98 },
  { id: 6, name: "Roberto Alves", phone: "(11) 95432-1098", email: "roberto@email.com", channel: "WhatsApp", status: "Perdido", procedure: "Prótese", value: "R$ 4.500", date: "04/04/2026", score: 20 },
  { id: 7, name: "Fernanda Costa", phone: "(21) 94321-0987", email: "fernanda@email.com", channel: "Instagram", status: "Convertido", procedure: "Lentes de Contato", value: "R$ 9.000", date: "03/04/2026", score: 95 },
  { id: 8, name: "Pedro Rocha", phone: "(11) 93210-9876", email: "pedro@email.com", channel: "WhatsApp", status: "Em Atendimento", procedure: "Clareamento", value: "R$ 1.500", date: "03/04/2026", score: 62 },
];

const statusColors: Record<string, string> = {
  Novo: "bg-info/15 text-info",
  Qualificado: "bg-success/15 text-success",
  "Em Atendimento": "bg-warning/15 text-warning",
  Agendado: "bg-primary/15 text-primary",
  Convertido: "bg-success/20 text-success",
  Perdido: "bg-destructive/15 text-destructive",
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
};

const Leads = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    if (tab === "all") return matchSearch;
    return matchSearch && l.status === tab;
  });

  const pipelineStages = [
    { label: "Novos", count: leads.filter(l => l.status === "Novo").length, color: "bg-info" },
    { label: "Qualificados", count: leads.filter(l => l.status === "Qualificado").length, color: "bg-success" },
    { label: "Agendados", count: leads.filter(l => l.status === "Agendado").length, color: "bg-primary" },
    { label: "Convertidos", count: leads.filter(l => l.status === "Convertido").length, color: "bg-success" },
    { label: "Perdidos", count: leads.filter(l => l.status === "Perdido").length, color: "bg-destructive" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Gestão de Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">Pipeline e acompanhamento de leads</p>
        </div>
        <Button className="gap-2">
          <User className="h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-5 gap-3">
        {pipelineStages.map(stage => (
          <Card key={stage.label} className="border-border/50 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className={`w-3 h-3 rounded-full ${stage.color} mx-auto mb-2`} />
              <p className="text-2xl font-semibold text-foreground">{stage.count}</p>
              <p className="text-[11px] text-muted-foreground">{stage.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar lead..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
            <TabsTrigger value="Novo" className="text-xs">Novos</TabsTrigger>
            <TabsTrigger value="Qualificado" className="text-xs">Qualificados</TabsTrigger>
            <TabsTrigger value="Agendado" className="text-xs">Agendados</TabsTrigger>
            <TabsTrigger value="Convertido" className="text-xs">Convertidos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Leads Table */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Lead</th>
                <th className="text-left py-3 px-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Canal</th>
                <th className="text-left py-3 px-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Procedimento</th>
                <th className="text-left py-3 px-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Valor Est.</th>
                <th className="text-left py-3 px-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Score</th>
                <th className="text-left py-3 px-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Data</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-[11px] text-muted-foreground">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className={`text-[10px] ${lead.channel === "WhatsApp" ? "border-whatsapp/30 text-whatsapp" : "border-instagram/30 text-instagram"}`}>
                      {lead.channel}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{lead.procedure}</td>
                  <td className="py-3 px-4 font-medium text-foreground">{lead.value}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${scoreColor(lead.score)}`}>{lead.score}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{lead.date}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leads;
