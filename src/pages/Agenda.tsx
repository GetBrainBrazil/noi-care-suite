import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react";

const today = [
  { id: 1, time: "08:00", patient: "Fernanda Costa", procedure: "Lentes de Contato - Moldagem", duration: "1h30", doctor: "Dra. Camila", status: "confirmed", channel: "WhatsApp", phone: "(21) 94321-0987" },
  { id: 2, time: "09:00", patient: "Maria Silva", procedure: "Avaliação - Lentes de Contato", duration: "40min", doctor: "Dra. Camila", status: "confirmed", channel: "WhatsApp", phone: "(11) 99123-4567" },
  { id: 3, time: "10:00", patient: "Lucas Pereira", procedure: "Clareamento a Laser", duration: "1h", doctor: "Dr. Ricardo", status: "confirmed", channel: "Instagram", phone: "(11) 91234-5678" },
  { id: 4, time: "11:00", patient: "Juliana Martins", procedure: "Ortodontia - Manutenção", duration: "30min", doctor: "Dra. Camila", status: "pending", channel: "WhatsApp", phone: "(11) 92345-6789" },
  { id: 5, time: "14:00", patient: "Ana Oliveira", procedure: "Implante - Retorno", duration: "45min", doctor: "Dr. Ricardo", status: "confirmed", channel: "WhatsApp", phone: "(11) 97654-3210" },
  { id: 6, time: "15:00", patient: "Marcos Ribeiro", procedure: "Avaliação Geral", duration: "30min", doctor: "Dra. Camila", status: "cancelled", channel: "Instagram", phone: "(21) 93456-7890" },
  { id: 7, time: "16:00", patient: "Patrícia Gomes", procedure: "Facetas - Preparação", duration: "2h", doctor: "Dra. Camila", status: "confirmed", channel: "WhatsApp", phone: "(11) 94567-8901" },
];

const week = [
  { day: "Seg 07", count: 8, confirmed: 7, pending: 1 },
  { day: "Ter 08", count: 6, confirmed: 5, pending: 1 },
  { day: "Qua 09", count: 9, confirmed: 6, pending: 3 },
  { day: "Qui 10", count: 7, confirmed: 7, pending: 0 },
  { day: "Sex 11", count: 5, confirmed: 4, pending: 1 },
  { day: "Sáb 12", count: 3, confirmed: 2, pending: 1 },
];

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  confirmed: { icon: CheckCircle, color: "text-success", label: "Confirmado" },
  pending: { icon: AlertCircle, color: "text-warning", label: "Pendente" },
  cancelled: { icon: XCircle, color: "text-destructive", label: "Cancelado" },
};

const Agenda = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Agenda</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerenciamento de consultas e agendamentos</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Week Overview */}
      <div className="grid grid-cols-6 gap-3">
        {week.map(d => (
          <Card key={d.day} className={`border-border/50 shadow-sm ${d.day.startsWith("Seg") ? "ring-2 ring-primary/30" : ""}`}>
            <CardContent className="p-3 text-center">
              <p className="text-xs font-medium text-muted-foreground mb-1">{d.day}</p>
              <p className="text-2xl font-semibold text-foreground">{d.count}</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-[10px] text-success">{d.confirmed} ✓</span>
                {d.pending > 0 && <span className="text-[10px] text-warning">{d.pending} ⏳</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{today.length}</p>
                <p className="text-xs text-muted-foreground">Consultas Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{today.filter(t => t.status === "confirmed").length}</p>
                <p className="text-xs text-muted-foreground">Confirmados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{today.filter(t => t.status === "pending").length}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{today.filter(t => t.status === "cancelled").length}</p>
                <p className="text-xs text-muted-foreground">Cancelados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Agenda de Hoje — Segunda, 07 de Abril</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {today.map(apt => {
              const sc = statusConfig[apt.status];
              const StatusIcon = sc.icon;
              return (
                <div
                  key={apt.id}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                    apt.status === "cancelled" ? "border-border/30 opacity-50" : "border-border/50 hover:bg-muted/30"
                  }`}
                >
                  <div className="w-16 text-center shrink-0">
                    <p className="text-lg font-semibold text-foreground">{apt.time}</p>
                    <p className="text-[10px] text-muted-foreground">{apt.duration}</p>
                  </div>
                  <div className="w-px h-10 bg-border/50" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-foreground">{apt.patient}</p>
                      <Badge variant="outline" className={`text-[9px] px-1 py-0 ${apt.channel === "WhatsApp" ? "border-whatsapp/30 text-whatsapp" : "border-instagram/30 text-instagram"}`}>
                        {apt.channel === "WhatsApp" ? "WA" : "IG"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{apt.procedure}</p>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">{apt.doctor}</div>
                  <div className="flex items-center gap-1 shrink-0">
                    <StatusIcon className={`h-4 w-4 ${sc.color}`} />
                    <span className={`text-xs font-medium ${sc.color}`}>{sc.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda;
