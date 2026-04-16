import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { useClinic } from "@/contexts/ClinicContext";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ClinicSwitcher() {
  const { clinics, activeClinic, switchClinic } = useClinic();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  if (!activeClinic || clinics.length === 0) return null;

  if (collapsed) {
    return (
      <div className="flex justify-center py-2" title={activeClinic.name}>
        <Building2 className="h-4 w-4 text-sidebar-foreground" />
      </div>
    );
  }

  return (
    <div className="px-3 pb-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={clinics.length < 2}
          className="w-full flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-2 hover:bg-sidebar-accent/60 transition-colors disabled:cursor-default disabled:opacity-90"
        >
          <Building2 className="h-4 w-4 shrink-0 text-sidebar-primary" />
          <div className="flex-1 text-left min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">
              Clínica
            </p>
            <p className="text-sm font-medium text-sidebar-foreground truncate mt-0.5">
              {activeClinic.name}
            </p>
          </div>
          {clinics.length > 1 && (
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {clinics.map((c) => (
            <DropdownMenuItem
              key={c.id}
              onClick={() => switchClinic(c.id)}
              className="flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              <span className="flex-1 truncate">{c.name}</span>
              {c.id === activeClinic.id && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
