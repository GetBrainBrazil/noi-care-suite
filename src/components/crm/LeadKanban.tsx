import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lead, LEAD_STATUSES, LeadStatus } from "@/hooks/useLeads";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";

interface Props {
  leads: Lead[];
  onSelect: (l: Lead) => void;
  onChanged: () => void;
}

const fmtBRL = (v: number | null) =>
  v == null ? null : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

export function LeadKanban({ leads, onSelect, onChanged }: Props) {
  const { toast } = useToast();

  const onDragEnd = async (r: DropResult) => {
    if (!r.destination) return;
    const newStatus = r.destination.droppableId as LeadStatus;
    if (newStatus === r.source.droppableId) return;
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", r.draggableId);
    if (error) {
      toast({ title: "Erro ao mover lead", description: error.message, variant: "destructive" });
      return;
    }
    onChanged();
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {LEAD_STATUSES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.value);
          return (
            <Droppable key={stage.value} droppableId={stage.value}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-shrink-0 w-72 rounded-lg border bg-muted/30 p-2 transition-colors ${
                    snapshot.isDraggingOver ? "bg-primary/5 border-primary/30" : "border-border/50"
                  }`}
                >
                  <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                      <span className="text-sm font-medium">{stage.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] h-5">{stageLeads.length}</Badge>
                  </div>
                  <div className="space-y-2 min-h-[80px]">
                    {stageLeads.map((lead, idx) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={idx}>
                        {(prov, snap) => (
                          <Card
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            onClick={() => onSelect(lead)}
                            className={`p-3 cursor-pointer hover:shadow-md transition-all border-border/50 ${
                              snap.isDragging ? "shadow-lg rotate-1" : ""
                            }`}
                          >
                            <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                            {lead.procedure_interest && (
                              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                                {lead.procedure_interest}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              {lead.phone ? (
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Phone className="h-2.5 w-2.5" /> {lead.phone}
                                </span>
                              ) : <span />}
                              {lead.estimated_value_brl != null && (
                                <span className="text-[10px] font-semibold text-success">
                                  {fmtBRL(Number(lead.estimated_value_brl))}
                                </span>
                              )}
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {stageLeads.length === 0 && (
                      <p className="text-[11px] text-muted-foreground text-center py-4">Vazio</p>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}
