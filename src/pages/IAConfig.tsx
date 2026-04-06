import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles, Clock, Shield, MessageSquare, Zap, Brain, Settings } from "lucide-react";
import { useState } from "react";

const quickReplies = [
  { id: 1, trigger: "horário", response: "Nosso horário de funcionamento é de segunda a sexta, das 8h às 18h, e sábados das 8h às 12h." },
  { id: 2, trigger: "endereço", response: "Estamos localizados na Av. Paulista, 1000 - Sala 302, São Paulo - SP." },
  { id: 3, trigger: "valores", response: "Os valores variam conforme o procedimento. Posso agendar uma avaliação gratuita para que a doutora possa indicar o melhor tratamento e apresentar os valores?" },
  { id: 4, trigger: "lentes", response: "As Lentes de Contato Dental são uma solução estética que proporciona um sorriso natural e harmonioso. O procedimento é minimamente invasivo. Deseja agendar uma avaliação?" },
];

const IAConfig = () => {
  const [tab, setTab] = useState("geral");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Configuração da IA</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie o comportamento do agente virtual</p>
        </div>
        <Badge variant="outline" className="border-success/40 text-success gap-1.5 px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          IA Ativa
        </Badge>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-semibold text-foreground">2.847</p>
              <p className="text-[11px] text-muted-foreground">Mensagens Enviadas (mês)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-semibold text-foreground">94%</p>
              <p className="text-[11px] text-muted-foreground">Taxa de Resolução</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-xl font-semibold text-foreground">1.2s</p>
              <p className="text-[11px] text-muted-foreground">Tempo Médio de Resposta</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xl font-semibold text-foreground">6%</p>
              <p className="text-[11px] text-muted-foreground">Taxa de Escalação</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="geral" className="gap-1.5"><Settings className="h-3.5 w-3.5" /> Geral</TabsTrigger>
          <TabsTrigger value="personalidade" className="gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Personalidade</TabsTrigger>
          <TabsTrigger value="respostas" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Respostas Rápidas</TabsTrigger>
          <TabsTrigger value="regras" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> Regras</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-4 space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-resposta WhatsApp</Label>
                  <p className="text-xs text-muted-foreground">IA responde automaticamente novas mensagens no WhatsApp</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-resposta Instagram</Label>
                  <p className="text-xs text-muted-foreground">IA responde automaticamente DMs do Instagram</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Agendamento Automático</Label>
                  <p className="text-xs text-muted-foreground">IA pode agendar consultas automaticamente</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Qualificação Automática de Leads</Label>
                  <p className="text-xs text-muted-foreground">IA classifica leads com base na conversa</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Escalação Automática</Label>
                  <p className="text-xs text-muted-foreground">Transferir para humano quando confiança {"<"} 70%</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Horário de Funcionamento da IA</Label>
                <div className="flex items-center gap-3">
                  <Input defaultValue="07:00" type="time" className="w-32 h-9 text-sm" />
                  <span className="text-sm text-muted-foreground">até</span>
                  <Input defaultValue="22:00" type="time" className="w-32 h-9 text-sm" />
                </div>
                <p className="text-xs text-muted-foreground">Fora deste horário, a IA envia mensagem de ausência</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalidade" className="mt-4 space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Personalidade e Tom de Voz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nome do Assistente</Label>
                <Input defaultValue="Assistente NOI" className="h-9 text-sm max-w-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Prompt de Sistema</Label>
                <Textarea
                  rows={6}
                  className="text-sm"
                  defaultValue={`Você é a assistente virtual da NOI Odonto, uma clínica odontológica de alto padrão em São Paulo. 

Seu tom deve ser: profissional, acolhedor, empático e sofisticado. Use emojis com moderação. Sempre chame o paciente pelo primeiro nome.

Objetivos principais:
1. Qualificar o lead (identificar procedimento de interesse)
2. Agendar uma avaliação gratuita
3. Fornecer informações sobre procedimentos
4. Nunca fornecer valores específicos — direcionar para avaliação

Procedimentos oferecidos: Lentes de Contato Dental, Clareamento, Implantes, Ortodontia, Facetas, Próteses.`}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Mensagem de Boas-vindas (WhatsApp)</Label>
                <Textarea rows={3} className="text-sm" defaultValue="Olá! 😊 Bem-vindo(a) à NOI Odonto. Sou a assistente virtual e estou aqui para ajudá-lo(a). Como posso auxiliar?" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Mensagem de Boas-vindas (Instagram)</Label>
                <Textarea rows={3} className="text-sm" defaultValue="Oi! 💜 Obrigada por nos seguir! Sou a assistente virtual da NOI Odonto. Posso ajudar com informações sobre nossos tratamentos ou agendar uma avaliação gratuita. Como posso ajudar?" />
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="respostas" className="mt-4 space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Respostas Rápidas Configuradas</CardTitle>
              <Button variant="outline" size="sm">+ Nova Resposta</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickReplies.map(qr => (
                  <div key={qr.id} className="p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">Gatilho: "{qr.trigger}"</Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 text-xs">Editar</Button>
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive">Remover</Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{qr.response}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regras" className="mt-4 space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Regras de Negócio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Nunca informar preços</Label>
                  <p className="text-xs text-muted-foreground">IA sempre redireciona para avaliação presencial</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Limite de mensagens por conversa</Label>
                  <p className="text-xs text-muted-foreground">Após 10 mensagens sem conversão, escalar para humano</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Follow-up automático</Label>
                  <p className="text-xs text-muted-foreground">Enviar mensagem de acompanhamento após 24h sem resposta</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Detectar sentimento negativo</Label>
                  <p className="text-xs text-muted-foreground">Escalar automaticamente quando o lead demonstrar insatisfação</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Lembrete pré-consulta</Label>
                  <p className="text-xs text-muted-foreground">Enviar lembrete automático 24h antes da consulta</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IAConfig;
