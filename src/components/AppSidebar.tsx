import { LayoutDashboard, MessageSquare, Upload, Settings, LifeBuoy, LogOut, Users, CalendarDays, Bot, Shield, UserCog } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import noiLogo from "@/assets/noi-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

type ModuleKey =
  | "dashboard" | "atendimento" | "leads" | "agenda"
  | "ia-config" | "upload" | "configuracoes" | "suporte";

const menuItems: { title: string; url: string; icon: any; module: ModuleKey }[] = [
  { title: "Visão Geral", url: "/dashboard", icon: LayoutDashboard, module: "dashboard" },
  { title: "Atendimento", url: "/atendimento", icon: MessageSquare, module: "atendimento" },
  { title: "Leads", url: "/leads", icon: Users, module: "leads" },
  { title: "Agenda", url: "/agenda", icon: CalendarDays, module: "agenda" },
  { title: "Config. IA", url: "/ia", icon: Bot, module: "ia-config" },
  { title: "Upload", url: "/upload", icon: Upload, module: "upload" },
  { title: "Configurações", url: "/configuracoes", icon: Settings, module: "configuracoes" },
  { title: "Suporte", url: "/suporte", icon: LifeBuoy, module: "suporte" },
];

const adminItems = [
  { title: "Usuários", url: "/usuarios", icon: UserCog },
  { title: "Cargos", url: "/cargos", icon: Shield },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { isAdmin, modules, signOut, profile } = useAuth();

  const visibleItems = menuItems.filter((i) => isAdmin || modules.includes(i.module));

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className={`px-4 py-5 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <img src={noiLogo} alt="NOI Odonto" className="w-9 h-9" />
          {!collapsed && (
            <div>
              <p className="text-base font-semibold text-sidebar-foreground leading-tight">NOI Odonto</p>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Plataforma de Controle</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/60 transition-colors rounded-lg px-3 py-2"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 mr-3 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupContent>
              {!collapsed && (
                <p className="px-5 pt-2 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Administração</p>
              )}
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className="hover:bg-sidebar-accent/60 transition-colors rounded-lg px-3 py-2"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="h-4 w-4 mr-3 shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && profile && (
          <div className="px-3 pb-2">
            <p className="text-xs font-medium text-foreground truncate">{profile.full_name || profile.email}</p>
            <p className="text-[10px] text-muted-foreground truncate">{profile.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors w-full px-3 py-2 rounded-lg hover:bg-sidebar-accent/60 ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
