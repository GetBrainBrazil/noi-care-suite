import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ShieldAlert } from "lucide-react";

type AppModule =
  | "dashboard"
  | "atendimento"
  | "leads"
  | "agenda"
  | "ia-config"
  | "upload"
  | "suporte"
  | "configuracoes";

interface Props {
  children: React.ReactNode;
  module?: AppModule;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, module, adminOnly }: Props) {
  const { user, profile, modules, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-sm">Carregando...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;

  if (profile?.status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full border-border/50">
          <CardContent className="p-8 text-center space-y-3">
            <Clock className="h-10 w-10 text-warning mx-auto" />
            <h2 className="text-xl font-semibold">Aguardando aprovação</h2>
            <p className="text-sm text-muted-foreground">
              Seu cadastro foi recebido. Um administrador precisa aprovar seu acesso antes de você entrar na plataforma.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profile?.status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full border-border/50">
          <CardContent className="p-8 text-center space-y-3">
            <ShieldAlert className="h-10 w-10 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Acesso negado</h2>
            <p className="text-sm text-muted-foreground">Seu acesso foi rejeitado. Entre em contato com o administrador.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  if (module && !isAdmin && !modules.includes(module)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
