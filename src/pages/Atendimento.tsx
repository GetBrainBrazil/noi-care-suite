import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search, Bot, User, MessageCircle } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  channel: "WhatsApp" | "Instagram";
  unread: number;
}

interface Message {
  id: number;
  text: string;
  sender: "ai" | "lead";
  time: string;
}

const contacts: Contact[] = [
  { id: 1, name: "Maria Silva", lastMessage: "Gostaria de agendar uma avaliação", time: "14:32", channel: "WhatsApp", unread: 2 },
  { id: 2, name: "João Mendes", lastMessage: "Quanto custa o clareamento?", time: "13:10", channel: "Instagram", unread: 0 },
  { id: 3, name: "Ana Oliveira", lastMessage: "Perfeito, obrigada!", time: "11:45", channel: "WhatsApp", unread: 0 },
  { id: 4, name: "Carlos Santos", lastMessage: "Vocês trabalham com lentes?", time: "Ontem", channel: "Instagram", unread: 1 },
  { id: 5, name: "Beatriz Lima", lastMessage: "Confirmo presença dia 15", time: "Ontem", channel: "WhatsApp", unread: 0 },
  { id: 6, name: "Roberto Alves", lastMessage: "Boa tarde, preciso remarcar", time: "Ontem", channel: "WhatsApp", unread: 0 },
];

const conversations: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Olá! 😊 Bem-vinda à NOI Odonto. Sou a assistente virtual e estou aqui para ajudá-la. Como posso auxiliar?", sender: "ai", time: "14:25" },
    { id: 2, text: "Oi! Gostaria de agendar uma avaliação para lentes de contato dental", sender: "lead", time: "14:28" },
    { id: 3, text: "Que ótimo, Maria! Temos horários disponíveis esta semana. Você prefere período da manhã ou da tarde?", sender: "ai", time: "14:28" },
    { id: 4, text: "Prefiro pela manhã, se possível na quinta-feira", sender: "lead", time: "14:30" },
    { id: 5, text: "Perfeito! Temos disponibilidade na quinta-feira às 9h ou às 10h30. Qual prefere? A consulta de avaliação é gratuita e dura aproximadamente 40 minutos.", sender: "ai", time: "14:30" },
    { id: 6, text: "Gostaria de agendar às 9h, por favor!", sender: "lead", time: "14:32" },
  ],
  2: [
    { id: 1, text: "Olá! Bem-vindo à NOI Odonto! 🦷 Como posso ajudá-lo?", sender: "ai", time: "13:05" },
    { id: 2, text: "Quanto custa o clareamento dental?", sender: "lead", time: "13:10" },
  ],
};

const Atendimento = () => {
  const [selected, setSelected] = useState(1);
  const [search, setSearch] = useState("");
  const msgs = conversations[selected] || [];
  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in h-[calc(100vh-7rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-display font-semibold text-foreground">Central de Atendimento</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie suas conversas com leads</p>
      </div>

      <div className="flex h-[calc(100%-4rem)] border border-border/50 rounded-lg overflow-hidden bg-card shadow-sm">
        {/* Contact List */}
        <div className="w-80 border-r border-border/50 flex flex-col">
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contato..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 bg-muted/30 border-border/40 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => setSelected(contact.id)}
                className={`w-full text-left px-4 py-3 border-b border-border/20 hover:bg-muted/30 transition-colors ${selected === contact.id ? "bg-muted/50" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-foreground">{contact.name}</span>
                  <span className="text-xs text-muted-foreground">{contact.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">{contact.lastMessage}</p>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${contact.channel === "WhatsApp" ? "border-whatsapp/40 text-whatsapp" : "border-instagram/40 text-instagram"}`}>
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
                <p className="font-medium text-sm text-foreground">{contacts.find(c => c.id === selected)?.name}</p>
                <p className="text-xs text-muted-foreground">Online agora</p>
              </div>
            </div>
            <Badge variant="outline" className={contacts.find(c => c.id === selected)?.channel === "WhatsApp" ? "border-whatsapp/40 text-whatsapp" : "border-instagram/40 text-instagram"}>
              {contacts.find(c => c.id === selected)?.channel}
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/10">
            {msgs.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === "ai" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[70%] ${msg.sender === "ai" ? "order-1" : ""}`}>
                  <div className={`flex items-center gap-1.5 mb-1 ${msg.sender === "ai" ? "" : "justify-end"}`}>
                    {msg.sender === "ai" ? (
                      <>
                        <Bot className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-medium text-primary">IA NOI</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] font-medium text-muted-foreground">Lead</span>
                        <MessageCircle className="h-3 w-3 text-muted-foreground" />
                      </>
                    )}
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "ai"
                      ? "bg-card border border-border/50 text-foreground rounded-tl-sm"
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-muted-foreground mt-1 ${msg.sender === "ai" ? "" : "text-right"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border/50">
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
