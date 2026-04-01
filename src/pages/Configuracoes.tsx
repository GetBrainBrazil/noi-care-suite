import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2, UserPlus } from "lucide-react";

const teamMembers = [
  { name: "Dra. Ana Beatriz", email: "dra.ana@noiodonto.com", role: "Administrador", avatar: "AB" },
  { name: "Dr. Ricardo Lopes", email: "dr.ricardo@noiodonto.com", role: "Dentista", avatar: "RL" },
  { name: "Camila Ferreira", email: "camila@noiodonto.com", role: "Recepção", avatar: "CF" },
  { name: "Lucas Martins", email: "lucas@noiodonto.com", role: "Marketing", avatar: "LM" },
];

const roleColors: Record<string, string> = {
  Administrador: "bg-primary/15 text-primary",
  Dentista: "bg-info/15 text-info",
  Recepção: "bg-success/15 text-success",
  Marketing: "bg-warning/15 text-warning",
};

const Configuracoes = () => {
  const [tab, setTab] = useState("usuarios");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie usuários e dados da clínica</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="usuarios">Gestão de Usuários</TabsTrigger>
          <TabsTrigger value="ajustes">Ajustes da Clínica</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="mt-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Membros da Equipe</CardTitle>
              <Button size="sm" className="gap-1.5 text-xs">
                <UserPlus className="h-3.5 w-3.5" /> Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[member.role]}`}>
                        {member.role}
                      </span>
                      <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ajustes" className="mt-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Dados da Clínica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80">Nome da Clínica</Label>
                  <Input defaultValue="NOI Odonto" className="bg-muted/30 border-border/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80">CNPJ</Label>
                  <Input defaultValue="12.345.678/0001-90" className="bg-muted/30 border-border/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80">Telefone</Label>
                  <Input defaultValue="(11) 98765-4321" className="bg-muted/30 border-border/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80">E-mail</Label>
                  <Input defaultValue="contato@noiodonto.com" className="bg-muted/30 border-border/40" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm text-foreground/80">Endereço</Label>
                  <Input defaultValue="Av. Paulista, 1000 — Bela Vista, São Paulo - SP" className="bg-muted/30 border-border/40" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button className="text-sm">Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
