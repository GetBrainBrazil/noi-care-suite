import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import noiLogo from "@/assets/noi-logo.png";

const signInSchema = z.object({
  email: z.string().trim().email({ message: "E-mail inválido" }).max(255),
  password: z.string().min(6, { message: "Senha deve ter ao menos 6 caracteres" }).max(100),
});

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Informe seu nome" }).max(100),
  email: z.string().trim().email({ message: "E-mail inválido" }).max(255),
  password: z.string().min(6, { message: "Senha deve ter ao menos 6 caracteres" }).max(100),
});

const Auth = () => {
  const [tab, setTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
    if (!parsed.success) {
      toast({ title: "Dados inválidos", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/dashboard");
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      fullName: fd.get("fullName"),
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast({ title: "Dados inválidos", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: parsed.data.fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Cadastro recebido", description: "Aguarde aprovação do administrador para acessar." });
    setTab("signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-muted opacity-60" />
      <Card className="relative z-10 w-full max-w-md border-border/50 shadow-xl animate-fade-in">
        <CardContent className="p-10">
          <div className="flex flex-col items-center mb-8">
            <img src={noiLogo} alt="NOI Odonto" width={90} height={90} className="mb-3" />
            <p className="text-sm text-muted-foreground tracking-widest uppercase font-body">Plataforma de Controle</p>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-in">E-mail</Label>
                  <Input id="email-in" name="email" type="email" placeholder="seu@email.com" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-in">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password-in"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? "Entrando..." : "Acessar Plataforma"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name-up">Nome completo</Label>
                  <Input id="name-up" name="fullName" placeholder="Seu nome" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-up">E-mail</Label>
                  <Input id="email-up" name="email" type="email" placeholder="seu@email.com" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-up">Senha</Label>
                  <Input id="password-up" name="password" type="password" placeholder="Mínimo 6 caracteres" required className="h-11" />
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? "Cadastrando..." : "Criar Conta"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Após o cadastro, aguarde a aprovação do administrador.
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground mt-8">
            NOI Odonto © 2026 — Todos os direitos reservados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
