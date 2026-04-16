import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { useClinic } from "@/contexts/ClinicContext";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ClinicSwitcher() {
  const { clinics, activeClinic, switchClinic } = useClinic();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  if (!activeClinic || clinics.length === 0) return null;

  const sorted = [...clinics].sort((a, b) => a.name.localeCompare(b.name));
  const initial = activeClinic.name.charAt(0).toUpperCase();

  const handleSwitch = (id: string, name: string) => {
    if (id === activeClinic.id) return;
    switchClinic(id);
    toast.success(`Unidade alterada para ${name}`);
  };

  if (collapsed) {
    return (
      <div className="flex justify-center py-2" title={activeClinic.name}>
        <div className="h-8 w-8 rounded-md bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center text-sm font-semibold">
          {initial}
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 pb-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={clinics.length < 2}
          className="w-full flex items-center gap-2.5 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-2.5 py-2 hover:bg-sidebar-accent/60 transition-colors disabled:cursor-default disabled:opacity-90"
        >
          <div className="h-9 w-9 shrink-0 rounded-md bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center text-sm font-bold">
            {initial}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">
              Unidade
            </p>
            <p className="text-sm font-medium text-sidebar-foreground truncate mt-1">
              {activeClinic.name}
            </p>
          </div>
          {clinics.length > 1 && (
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Trocar de unidade
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sorted.map((c) => {
            const isActive = c.id === activeClinic.id;
            return (
              <DropdownMenuItem
                key={c.id}
                onClick={() => handleSwitch(c.id, c.name)}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  isActive && "bg-accent/60 font-medium"
                )}
              >
                <div className="h-6 w-6 rounded bg-primary/10 text-primary grid place-items-center text-xs font-semibold">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 truncate">{c.name}</span>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
