import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Atendimento from "./pages/Atendimento";
import Leads from "./pages/Leads";
import Agenda from "./pages/Agenda";
import IAConfig from "./pages/IAConfig";
import Upload from "./pages/Upload";
import Configuracoes from "./pages/Configuracoes";
import Suporte from "./pages/Suporte";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<ProtectedRoute module="dashboard"><Dashboard /></ProtectedRoute>} />
              <Route path="/atendimento" element={<ProtectedRoute module="atendimento"><Atendimento /></ProtectedRoute>} />
              <Route path="/leads" element={<ProtectedRoute module="leads"><Leads /></ProtectedRoute>} />
              <Route path="/agenda" element={<ProtectedRoute module="agenda"><Agenda /></ProtectedRoute>} />
              <Route path="/ia" element={<ProtectedRoute module="ia-config"><IAConfig /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute module="upload"><Upload /></ProtectedRoute>} />
              <Route path="/configuracoes" element={<ProtectedRoute module="configuracoes"><Configuracoes /></ProtectedRoute>} />
              <Route path="/suporte" element={<ProtectedRoute module="suporte"><Suporte /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
