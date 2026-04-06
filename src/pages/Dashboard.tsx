import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, MessageSquare, TrendingUp, Bot, Calendar, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from "recharts";

const stats = [
  { label: "Total de Leads", value: "1.247", icon: Users, change: "+12%", up: true },
  { label: "Leads Qualificados", value: "384", icon: UserCheck, change: "+8%", up: true },
  { label: "Conversas Ativas", value: "56", icon: MessageSquare, change: "+23%", up: true },
  { label: "Taxa de Conversão", value: "31%", icon: TrendingUp, change: "+5%", up: true },
  { label: "Atendimentos IA", value: "892", icon: Bot, change: "+34%", up: true },
  { label: "Agendamentos", value: "127", icon: Calendar, change: "-3%", up: false },
  { label: "Tempo Médio Resposta", value: "1.2s", icon: Clock, change: "-18%", up: true },
  { label: "Satisfação", value: "96%", icon: TrendingUp, change: "+2%", up: true },
];

const monthlyData = [
  { month: "Jan", whatsapp: 120, instagram: 85 },
  { month: "Fev", whatsapp: 145, instagram: 92 },
  { month: "Mar", whatsapp: 160, instagram: 110 },
  { month: "Abr", whatsapp: 180, instagram: 130 },
  { month: "Mai", whatsapp: 200, instagram: 145 },
  { month: "Jun", whatsapp: 220, instagram: 155 },
];

const aiPerformanceData = [
  { day: "Seg", resolvidos: 42, escalados: 5 },
  { day: "Ter", resolvidos: 38, escalados: 8 },
  { day: "Qua", resolvidos: 55, escalados: 3 },
  { day: "Qui", resolvidos: 48, escalados: 6 },
  { day: "Sex", resolvidos: 62, escalados: 4 },
  { day: "Sáb", resolvidos: 28, escalados: 2 },
  { day: "Dom", resolvidos: 15, escalados: 1 },
];

const conversionFunnel = [
  { stage: "Leads Recebidos", value: 1247 },
  { stage: "Qualificados", value: 384 },
  { stage: "Agendados", value: 198 },
  { stage: "Compareceram", value: 156 },
  { stage: "Convertidos", value: 127 },
];

const channelData = [
  { name: "WhatsApp", value: 62, color: "hsl(142, 70%, 40%)" },
  { name: "Instagram", value: 38, color: "hsl(330, 80%, 55%)" },
];

const hourlyActivity = [
  { hour: "06h", msgs: 5 }, { hour: "07h", msgs: 12 }, { hour: "08h", msgs: 34 },
  { hour: "09h", msgs: 67 }, { hour: "10h", msgs: 82 }, { hour: "11h", msgs: 71 },
  { hour: "12h", msgs: 45 }, { hour: "13h", msgs: 58 }, { hour: "14h", msgs: 76 },
  { hour: "15h", msgs: 89 }, { hour: "16h", msgs: 95 }, { hour: "17h", msgs: 78 },
  { hour: "18h", msgs: 62 }, { hour: "19h", msgs: 48 }, { hour: "20h", msgs: 32 },
  { hour: "21h", msgs: 18 }, { hour: "22h", msgs: 8 },
];

const recentLeads = [
  { name: "Maria Silva", channel: "WhatsApp", status: "Qualificado", date: "Hoje, 14:32", procedure: "Lentes de Contato" },
  { name: "João Mendes", channel: "Instagram", status: "Novo", date: "Hoje, 13:10", procedure: "Clareamento" },
  { name: "Ana Oliveira", channel: "WhatsApp", status: "Em Atendimento", date: "Hoje, 11:45", procedure: "Implante" },
  { name: "Carlos Santos", channel: "Instagram", status: "Qualificado", date: "Ontem, 18:20", procedure: "Ortodontia" },
  { name: "Beatriz Lima", channel: "WhatsApp", status: "Agendado", date: "Ontem, 16:05", procedure: "Avaliação" },
  { name: "Roberto Alves", channel: "WhatsApp", status: "Novo", date: "Ontem, 14:30", procedure: "Prótese" },
  { name: "Fernanda Costa", channel: "Instagram", status: "Convertido", date: "Ontem, 10:15", procedure: "Lentes de Contato" },
];

const statusColors: Record<string, string> = {
  Novo: "bg-info/15 text-info",
  Qualificado: "bg-success/15 text-success",
  "Em Atendimento": "bg-warning/15 text-warning",
  Agendado: "bg-primary/15 text-primary",
  Convertido: "bg-success/20 text-success",
};

const aiActivity = [
  { time: "14:35", event: "Agendamento confirmado", lead: "Maria Silva", channel: "WhatsApp" },
  { time: "14:28", event: "Lead qualificado automaticamente", lead: "João Mendes", channel: "Instagram" },
  { time: "13:50", event: "Informações enviadas", lead: "Pedro Rocha", channel: "WhatsApp" },
  { time: "13:22", event: "Escalado para humano", lead: "Lucia Fernandes", channel: "Instagram" },
  { time: "12:45", event: "Follow-up enviado", lead: "Ana Oliveira", channel: "WhatsApp" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Visão Geral</h1>
          <p className="text-muted-foreground text-sm mt-1">Acompanhe suas métricas e leads em tempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-success/40 text-success gap-1.5 px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            IA Ativa
          </Badge>
          <Badge variant="outline" className="text-muted-foreground px-3 py-1">Últimos 30 dias</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-4 w-4 text-primary" />
                <span className={`text-[11px] font-medium flex items-center gap-0.5 ${stat.up ? "text-success" : "text-destructive"}`}>
                  {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Leads por Canal</CardTitle>
            <p className="text-xs text-muted-foreground">Comparativo mensal — WhatsApp vs Instagram</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} barGap={4}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(240,8%,91%)", fontSize: 12 }} />
                <Bar dataKey="whatsapp" name="WhatsApp" fill="hsl(142, 70%, 40%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="instagram" name="Instagram" fill="hsl(330, 80%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Distribuição</CardTitle>
            <p className="text-xs text-muted-foreground">Origem dos leads ativos</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={channelData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {channelData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-1">
              {channelData.map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name} ({c.value}%)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 - AI Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Performance da IA</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Atendimentos resolvidos vs escalados</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={aiPerformanceData} barGap={2}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="resolvidos" name="Resolvidos pela IA" fill="hsl(300, 52%, 37%)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="escalados" name="Escalados" fill="hsl(300, 20%, 80%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Atividade por Horário</CardTitle>
            <p className="text-xs text-muted-foreground">Mensagens recebidas hoje</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={hourlyActivity}>
                <XAxis dataKey="hour" axisLine={false} tickLine={false} className="text-xs" interval={2} />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="msgs" name="Mensagens" stroke="hsl(300, 52%, 37%)" fill="hsl(300, 52%, 37%)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Funil de Conversão</CardTitle>
            <p className="text-xs text-muted-foreground">Da captação ao fechamento</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {conversionFunnel.map((stage, i) => {
              const pct = Math.round((stage.value / conversionFunnel[0].value) * 100);
              return (
                <div key={stage.stage}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{stage.stage}</span>
                    <span className="font-medium text-foreground">{stage.value}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: `hsl(300, ${52 - i * 8}%, ${37 + i * 8}%)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Leads */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Leads Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2.5 px-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                    <th className="text-left py-2.5 px-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Canal</th>
                    <th className="text-left py-2.5 px-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Procedimento</th>
                    <th className="text-left py-2.5 px-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left py-2.5 px-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead, i) => (
                    <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-2 font-medium text-foreground text-sm">{lead.name}</td>
                      <td className="py-2.5 px-2">
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${lead.channel === "WhatsApp" ? "border-whatsapp/30 text-whatsapp" : "border-instagram/30 text-instagram"}`}>
                          {lead.channel}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-2 text-sm text-muted-foreground">{lead.procedure}</td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColors[lead.status]}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-muted-foreground text-xs">{lead.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AI Activity Feed */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Atividade da IA</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Ações automáticas recentes</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiActivity.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{item.event}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{item.lead}</span>
                      <Badge variant="outline" className={`text-[9px] px-1 py-0 ${item.channel === "WhatsApp" ? "border-whatsapp/30 text-whatsapp" : "border-instagram/30 text-instagram"}`}>
                        {item.channel === "WhatsApp" ? "WA" : "IG"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground ml-auto">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
