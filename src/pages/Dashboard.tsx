import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, MessageSquare, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "Total de Leads", value: "1.247", icon: Users, change: "+12%" },
  { label: "Leads Qualificados", value: "384", icon: UserCheck, change: "+8%" },
  { label: "Conversas Ativas", value: "56", icon: MessageSquare, change: "+23%" },
  { label: "Taxa de Conversão", value: "31%", icon: TrendingUp, change: "+5%" },
];

const monthlyData = [
  { month: "Jan", whatsapp: 120, instagram: 85 },
  { month: "Fev", whatsapp: 145, instagram: 92 },
  { month: "Mar", whatsapp: 160, instagram: 110 },
  { month: "Abr", whatsapp: 180, instagram: 130 },
  { month: "Mai", whatsapp: 200, instagram: 145 },
  { month: "Jun", whatsapp: 220, instagram: 155 },
];

const channelData = [
  { name: "WhatsApp", value: 62, color: "hsl(142, 70%, 40%)" },
  { name: "Instagram", value: 38, color: "hsl(330, 80%, 55%)" },
];

const recentLeads = [
  { name: "Maria Silva", channel: "WhatsApp", status: "Qualificado", date: "Hoje, 14:32" },
  { name: "João Mendes", channel: "Instagram", status: "Novo", date: "Hoje, 13:10" },
  { name: "Ana Oliveira", channel: "WhatsApp", status: "Em Atendimento", date: "Hoje, 11:45" },
  { name: "Carlos Santos", channel: "Instagram", status: "Qualificado", date: "Ontem, 18:20" },
  { name: "Beatriz Lima", channel: "WhatsApp", status: "Agendado", date: "Ontem, 16:05" },
  { name: "Roberto Alves", channel: "WhatsApp", status: "Novo", date: "Ontem, 14:30" },
];

const statusColors: Record<string, string> = {
  Novo: "bg-info/15 text-info",
  Qualificado: "bg-success/15 text-success",
  "Em Atendimento": "bg-warning/15 text-warning",
  Agendado: "bg-primary/15 text-primary",
};

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Visão Geral</h1>
        <p className="text-muted-foreground text-sm mt-1">Acompanhe suas métricas e leads em tempo real</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium text-success">{stat.change}</span>
              </div>
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Leads por Canal</CardTitle>
            <p className="text-xs text-muted-foreground">Comparativo mensal — WhatsApp vs Instagram</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData} barGap={4}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(40,15%,90%)", fontSize: 12 }}
                />
                <Bar dataKey="whatsapp" name="WhatsApp" fill="hsl(142, 70%, 40%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="instagram" name="Instagram" fill="hsl(330, 80%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Distribuição</CardTitle>
            <p className="text-xs text-muted-foreground">Origem dos leads ativos</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={channelData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {channelData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-2">
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

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Leads Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Canal</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, i) => (
                  <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{lead.name}</td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className={lead.channel === "WhatsApp" ? "border-whatsapp/30 text-whatsapp" : "border-instagram/30 text-instagram"}>
                        {lead.channel}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">{lead.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
