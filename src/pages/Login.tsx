import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import noiLogo from "@/assets/noi-logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-muted opacity-60" />
      <Card className="relative z-10 w-full max-w-md border-border/50 shadow-xl animate-fade-in">
        <CardContent className="p-10">
          <div className="flex flex-col items-center mb-10">
            <img src={noiLogo} alt="NOI Odonto" width={100} height={100} className="mb-3" />
            <p className="text-sm text-muted-foreground tracking-widest uppercase font-body">Odontologia de Excelência</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground/80">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                defaultValue="dra.ana@noiodonto.com"
                className="h-11 bg-muted/50 border-border/60 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground/80">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  defaultValue="password123"
                  className="h-11 bg-muted/50 border-border/60 focus:border-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Esqueceu a senha?
              </button>
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-medium tracking-wide">
              Acessar Plataforma
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-8">
            NOI Odonto © 2026 — Todos os direitos reservados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
