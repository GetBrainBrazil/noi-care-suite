import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LifeBuoy, Send } from "lucide-react";

const Suporte = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-semibold text-foreground">Suporte</h1>
        <p className="text-muted-foreground text-sm mt-1">Precisa de ajuda? Abra um ticket para nossa equipe</p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <LifeBuoy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-display font-semibold">Abertura de Ticket</CardTitle>
              <p className="text-xs text-muted-foreground">Preencha o formulário e retornaremos em até 24h</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-foreground/80">Título do Problema</Label>
            <Input placeholder="Descreva brevemente o problema" className="bg-muted/30 border-border/40" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-foreground/80">Categoria</Label>
            <Select>
              <SelectTrigger className="bg-muted/30 border-border/40">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Bug / Erro no Sistema</SelectItem>
                <SelectItem value="duvida">Dúvida de Uso</SelectItem>
                <SelectItem value="melhoria">Sugestão de Melhoria</SelectItem>
                <SelectItem value="integracao">Integração WhatsApp / Instagram</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-foreground/80">Descrição Detalhada</Label>
            <Textarea
              placeholder="Descreva o problema com o máximo de detalhes possível..."
              className="bg-muted/30 border-border/40 min-h-[140px] resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button className="gap-2 text-sm">
              <Send className="h-4 w-4" /> Enviar Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Suporte;
