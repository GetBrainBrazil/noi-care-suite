import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import UsuariosPanel from "@/components/settings/UsuariosPanel";
import CargosPanel from "@/components/settings/CargosPanel";

const Configuracoes = () => {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState(isAdmin ? "usuarios" : "ajustes");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie acessos, equipe e dados da clínica</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted/50">
          {isAdmin && <TabsTrigger value="usuarios">Usuários</TabsTrigger>}
          {isAdmin && <TabsTrigger value="cargos">Cargos & Permissões</TabsTrigger>}
          <TabsTrigger value="ajustes">Ajustes da Clínica</TabsTrigger>
        </TabsList>

        {isAdmin && (
          <TabsContent value="usuarios" className="mt-4">
            <UsuariosPanel />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="cargos" className="mt-4">
            <CargosPanel />
          </TabsContent>
        )}

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
