import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Search, Bot, User, MessageCircle, Phone, Zap, Pause, Play, ArrowRight, Clock, CheckCheck, AlertTriangle, Sparkles } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  channel: "WhatsApp" | "Instagram";
  unread: number;
  aiActive: boolean;
  status: "ai" | "human" | "waiting";
  sentiment: "positive" | "neutral" | "negative";
  procedure?: string;
}

interface Message {
  id: number;
  text: string;
  sender: "ai" | "lead" | "human";
  time: string;
  status?: "sent" | "delivered" | "read";
  confidence?: number;
}

const contacts: Contact[] = [
  { id: 1, name: "Maria Silva", lastMessage: "Gostaria de agendar uma avaliação", time: "14:32", channel: "WhatsApp", unread: 2, aiActive: true, status: "ai", sentiment: "positive", procedure: "Lentes de Contato" },
  { id: 2, name: "João Mendes", lastMessage: "Quanto custa o clareamento?", time: "13:10", channel: "Instagram", unread: 0, aiActive: true, status: "ai", sentiment: "neutral", procedure: "Clareamento" },
  { id: 3, name: "Ana Oliveira", lastMessage: "Perfeito, obrigada!", time: "11:45", channel: "WhatsApp", unread: 0, aiActive: false, status: "human", sentiment: "positive", procedure: "Implante" },
  { id: 4, name: "Carlos Santos", lastMessage: "Vocês trabalham com lentes?", time: "Ontem", channel: "Instagram", unread: 1, aiActive: true, status: "ai", sentiment: "neutral", procedure: "Lentes" },
  { id: 5, name: "Beatriz Lima", lastMessage: "Confirmo presença dia 15", time: "Ontem", channel: "WhatsApp", unread: 0, aiActive: true, status: "ai", sentiment: "positive", procedure: "Avaliação" },
  { id: 6, name: "Roberto Alves", lastMessage: "Boa tarde, preciso remarcar", time: "Ontem", channel: "WhatsApp", unread: 0, aiActive: false, status: "waiting", sentiment: "negative", procedure: "Ortodontia" },
  { id: 7, name: "Lucia Fernandes", lastMessage: "Não estou satisfeita com...", time: "Ontem", channel: "Instagram", unread: 3, aiActive: false, status: "human", sentiment: "negative", procedure: "Prótese" },
];

const conversations: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Olá! 😊 Bem-vinda à NOI Odonto. Sou a assistente virtual e estou aqui para ajudá-la. Como posso auxiliar?", sender: "ai", time: "14:25", confidence: 0.98 },
    { id: 2, text: "Oi! Gostaria de agendar uma avaliação para lentes de contato dental", sender: "lead", time: "14:28", status: "read" },
    { id: 3, text: "Que ótimo, Maria! Temos horários disponíveis esta semana. Você prefere período da manhã ou da tarde? 🗓️", sender: "ai", time: "14:28", confidence: 0.95 },
    { id: 4, text: "Prefiro pela manhã, se possível na quinta-feira", sender: "lead", time: "14:30", status: "read" },
    { id: 5, text: "Perfeito! Temos disponibilidade na quinta-feira às 9h ou às 10h30. Qual prefere? A consulta de avaliação é gratuita e dura aproximadamente 40 minutos.", sender: "ai", time: "14:30", confidence: 0.97 },
    { id: 6, text: "Gostaria de agendar às 9h, por favor!", sender: "lead", time: "14:32", status: "read" },
    { id: 7, text: "Agendamento confirmado! ✅ Quinta-feira, dia 18/04, às 9h com a Dra. Camila. Enviarei um lembrete na véspera. Precisa de mais alguma informação?", sender: "ai", time: "14:32", confidence: 0.99 },
  ],
  2: [
    { id: 1, text: "Olá! Bem-vindo à NOI Odonto! 🦷 Como posso ajudá-lo?", sender: "ai", time: "13:05", confidence: 0.98 },
    { id: 2, text: "Quanto custa o clareamento dental?", sender: "lead", time: "13:10", status: "read" },
    { id: 3, text: "Ótima escolha! Na NOI Odonto oferecemos duas modalidades de clareamento:\n\n💎 Clareamento a Laser (em consultório): sessão de ~1h\n🏠 Clareamento Caseiro: kit personalizado\n\nOs valores variam conforme a avaliação. Posso agendar uma consulta gratuita para a Dra. Camila avaliar e indicar o melhor tratamento?", sender: "ai", time: "13:10", confidence: 0.92 },
  ],
  3: [
    { id: 1, text: "Olá Ana! 😊 A Dra. Camila pediu para confirmar seu retorno de implante.", sender: "ai", time: "11:20", confidence: 0.96 },
    { id: 2, text: "Sim! Pode confirmar para o dia 20", sender: "lead", time: "11:30", status: "read" },
    { id: 3, text: "Ana, aqui é a Dra. Camila. Seu retorno está confirmado para dia 20 às 14h. Lembre-se de continuar tomando a medicação prescrita. Qualquer dúvida, estou por aqui! 💜", sender: "human", time: "11:40" },
    { id: 4, text: "Perfeito, obrigada!", sender: "lead", time: "11:45", status: "read" },
  ],
  7: [
    { id: 1, text: "Olá Lucia! Como posso ajudá-la?", sender: "ai", time: "09:00", confidence: 0.98 },
    { id: 2, text: "Não estou satisfeita com o resultado da minha prótese. Preciso falar com a dentista.", sender: "lead", time: "09:05", status: "read" },
    { id: 3, text: "Sinto muito por qualquer desconforto, Lucia. Vou transferir você para nossa equipe clínica para um atendimento mais personalizado. Um momento, por favor.", sender: "ai", time: "09:05", confidence: 0.88 },
    { id: 4, text: "Lucia, boa tarde. Aqui é a Dra. Camila. Li sua mensagem e entendo sua preocupação. Podemos agendar um retorno para amanhã ou depois? Farei todos os ajustes necessários sem custo adicional.", sender: "human", time: "09:15" },
  ],
};

const sentimentEmoji: Record<string, string> = {
  positive: "😊",
  neutral: "😐",
  negative: "😟",
};

const statusLabel: Record<string, { text: string; color: string }> = {
  ai: { text: "IA Atendendo", color: "bg-primary/15 text-primary" },
  human: { text: "Atend. Humano", color: "bg-info/15 text-info" },
  waiting: { text: "Aguardando", color: "bg-warning/15 text-warning" },
};

const Atendimento = () => {
  const [selected, setSelected] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [aiEnabled, setAiEnabled] = useState(true);
  const msgs = conversations[selected] || [];
  const selectedContact = contacts.find(c => c.id === selected);

  const filteredContacts = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "ai") return matchSearch && c.status === "ai";
    if (filter === "human") return matchSearch && c.status === "human";
    if (filter === "waiting") return matchSearch && c.status === "waiting";
    return matchSearch;
  });

  const aiStats = {
    active: contacts.filter(c => c.status === "ai").length,
    resolved: 42,
    avgTime: "1.2s",
    satisfaction: "96%",
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-7rem)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Central de Atendimento</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie suas conversas com leads</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">IA Auto-Resposta</span>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>
        </div>
      </div>

      {/* AI Quick Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{aiStats.active}</p>
              <p className="text-[10px] text-muted-foreground">Conversas IA Ativa</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCheck className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{aiStats.resolved}</p>
              <p className="text-[10px] text-muted-foreground">Resolvidos Hoje</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-info" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{aiStats.avgTime}</p>
              <p className="text-[10px] text-muted-foreground">Tempo Médio</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{aiStats.satisfaction}</p>
              <p className="text-[10px] text-muted-foreground">Satisfação</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex h-[calc(100%-10rem)] border border-border/50 rounded-lg overflow-hidden bg-card shadow-sm">
        {/* Contact List */}
        <div className="w-80 border-r border-border/50 flex flex-col">
          <div className="p-3 border-b border-border/50 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contato..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 bg-muted/30 border-border/40 text-sm"
              />
            </div>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="w-full h-8">
                <TabsTrigger value="all" className="text-[11px] flex-1 h-6">Todos</TabsTrigger>
                <TabsTrigger value="ai" className="text-[11px] flex-1 h-6">🤖 IA</TabsTrigger>
                <TabsTrigger value="human" className="text-[11px] flex-1 h-6">👤 Humano</TabsTrigger>
                <TabsTrigger value="waiting" className="text-[11px] flex-1 h-6">⏳ Espera</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => setSelected(contact.id)}
                className={`w-full text-left px-4 py-3 border-b border-border/20 hover:bg-muted/30 transition-colors ${selected === contact.id ? "bg-muted/50" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{contact.name}</span>
                    <span className="text-xs">{sentimentEmoji[contact.sentiment]}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{contact.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">{contact.lastMessage}</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusLabel[contact.status].color}`}>
                      {contact.status === "ai" ? "IA" : contact.status === "human" ? "H" : "⏳"}
                    </span>
                    <Badge variant="outline" className={`text-[9px] px-1 py-0 ${contact.channel === "WhatsApp" ? "border-whatsapp/40 text-whatsapp" : "border-instagram/40 text-instagram"}`}>
                      {contact.channel === "WhatsApp" ? "WA" : "IG"}
                    </Badge>
                    {contact.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">{contact.unread}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-foreground">{selectedContact?.name}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusLabel[selectedContact?.status || "ai"].color}`}>
                    {statusLabel[selectedContact?.status || "ai"].text}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{selectedContact?.procedure}</p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">{sentimentEmoji[selectedContact?.sentiment || "neutral"]} Sentimento</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedContact?.status === "ai" && (
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                  <Pause className="h-3 w-3" />
                  Pausar IA
                </Button>
              )}
              {selectedContact?.status !== "ai" && (
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                  <Play className="h-3 w-3" />
                  Ativar IA
                </Button>
              )}
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <ArrowRight className="h-3 w-3" />
                Transferir
              </Button>
              <Badge variant="outline" className={selectedContact?.channel === "WhatsApp" ? "border-whatsapp/40 text-whatsapp" : "border-instagram/40 text-instagram"}>
                {selectedContact?.channel}
              </Badge>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/10">
            {msgs.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === "lead" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[70%]">
                  <div className={`flex items-center gap-1.5 mb-1 ${msg.sender === "lead" ? "justify-end" : ""}`}>
                    {msg.sender === "ai" && (
                      <>
                        <Bot className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-medium text-primary">IA NOI</span>
                        {msg.confidence && (
                          <span className="text-[9px] text-muted-foreground ml-1">({Math.round(msg.confidence * 100)}% confiança)</span>
                        )}
                      </>
                    )}
                    {msg.sender === "human" && (
                      <>
                        <User className="h-3 w-3 text-info" />
                        <span className="text-[10px] font-medium text-info">Dra. Camila</span>
                      </>
                    )}
                    {msg.sender === "lead" && (
                      <>
                        <span className="text-[10px] font-medium text-muted-foreground">Lead</span>
                        <MessageCircle className="h-3 w-3 text-muted-foreground" />
                      </>
                    )}
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === "ai"
                      ? "bg-card border border-primary/20 text-foreground rounded-tl-sm"
                      : msg.sender === "human"
                      ? "bg-info/10 border border-info/20 text-foreground rounded-tl-sm"
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${msg.sender === "lead" ? "justify-end" : ""}`}>
                    <p className="text-[10px] text-muted-foreground">{msg.time}</p>
                    {msg.status === "read" && <CheckCheck className="h-3 w-3 text-info" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-[10px] text-muted-foreground">Sugestão IA: "Agendamento confirmado! Deseja enviar lembrete automático?"</span>
              <Button variant="ghost" size="sm" className="h-5 text-[10px] text-primary px-2">Usar</Button>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Digite sua mensagem..." className="h-10 bg-muted/30 border-border/40 text-sm" />
              <Button size="icon" className="h-10 w-10 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Atendimento;
