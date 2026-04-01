import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, FileImage, FileText, CheckCircle2, Clock, XCircle } from "lucide-react";

interface UploadedFile {
  name: string;
  type: string;
  size: string;
  status: "concluído" | "processando" | "erro";
  date: string;
}

const uploadedFiles: UploadedFile[] = [
  { name: "radiografia_maria_silva.jpg", type: "JPEG", size: "2.4 MB", status: "concluído", date: "01/04/2026" },
  { name: "contrato_joao_mendes.pdf", type: "PDF", size: "540 KB", status: "concluído", date: "01/04/2026" },
  { name: "tomografia_ana.png", type: "PNG", size: "8.1 MB", status: "processando", date: "01/04/2026" },
  { name: "orcamento_carlos.pdf", type: "PDF", size: "320 KB", status: "concluído", date: "31/03/2026" },
  { name: "foto_antes_beatriz.jpg", type: "JPEG", size: "3.7 MB", status: "erro", date: "31/03/2026" },
];

const statusConfig = {
  "concluído": { icon: CheckCircle2, className: "text-success" },
  "processando": { icon: Clock, className: "text-warning" },
  "erro": { icon: XCircle, className: "text-destructive" },
};

const Upload = () => {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Upload de Arquivos</h1>
        <p className="text-muted-foreground text-sm mt-1">Envie documentos e imagens dos pacientes</p>
      </div>

      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${dragOver ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50"}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); }}
      >
        <CardContent className="p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <UploadIcon className="h-7 w-7 text-primary" />
          </div>
          <p className="text-xl font-semibold text-foreground mb-2">Arraste e solte seus arquivos aqui</p>
          <p className="text-sm text-muted-foreground mb-4">ou clique para selecionar do computador</p>
          <div className="flex gap-3">
            <Badge variant="secondary" className="gap-1.5">
              <FileImage className="h-3 w-3" /> JPEG, PNG
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <FileText className="h-3 w-3" /> PDF
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Tamanho máximo: 25 MB por arquivo</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Arquivos Enviados</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Arquivo</th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo</th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Tamanho</th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, i) => {
                const StatusIcon = statusConfig[file.status].icon;
                return (
                  <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{file.name}</td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className="text-xs">{file.type}</Badge>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{file.size}</td>
                    <td className="py-3 px-2">
                      <div className={`flex items-center gap-1.5 ${statusConfig[file.status].className}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium capitalize">{file.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">{file.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
