import { AlertTriangle } from "lucide-react";

export const LegalFooter = () => {
  return (
    <div className="fixed bottom-16 left-0 right-0 bg-cyber-darker/90 border-t border-primary/10 backdrop-blur-sm z-40">
      <div className="max-w-7xl mx-auto px-2 py-1">
        <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground/80">
          <AlertTriangle className="h-2.5 w-2.5 text-primary/70 flex-shrink-0" />
          <p className="text-center truncate">
            ⚠️ Contenu spéculatif · Non médical · Non juridique
          </p>
        </div>
      </div>
    </div>
  );
};
