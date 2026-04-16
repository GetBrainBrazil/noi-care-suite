import { Outlet } from "react-router-dom";
import { Building2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useClinic } from "@/contexts/ClinicContext";

const ClinicPill = () => {
  const { activeClinic } = useClinic();
  if (!activeClinic) return null;
  return (
    <div className="ml-auto flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs">
      <Building2 className="h-3.5 w-3.5 text-primary" />
      <span className="text-muted-foreground">Unidade:</span>
      <span className="font-medium text-foreground">{activeClinic.name}</span>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center gap-3 border-b border-border/50 px-4 bg-card/50 backdrop-blur-sm">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <ClinicPill />
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
