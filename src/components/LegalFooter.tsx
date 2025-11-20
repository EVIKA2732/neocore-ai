import { AlertTriangle } from "lucide-react";

export const LegalFooter = () => {
  return (
    <div className="fixed bottom-16 left-0 right-0 bg-cyber-darker/95 border-t border-primary/20 backdrop-blur-sm z-40">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="h-3 w-3 text-primary" />
          <p className="text-center">
            ⚠️ Contenu spéculatif, éducatif, non médical, non juridique et non professionnel. 
            NEOCORE AI ne fournit aucun conseil relevant d'une profession réglementée.
          </p>
        </div>
      </div>
    </div>
  );
};
