import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Database, Loader2, BookOpen, Rocket, Brain, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIResult {
  title: string;
  category: string;
  description: string;
  technicalDetails: string[];
  futureYear: number;
  probability: string;
}

const NeopediaAI = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AIResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    { icon: Rocket, name: "Technologies Spatiales", color: "from-blue-500 to-cyan-500" },
    { icon: Brain, name: "Neurosciences", color: "from-purple-500 to-pink-500" },
    { icon: Zap, name: "Énergies Nouvelles", color: "from-yellow-500 to-orange-500" },
    { icon: BookOpen, name: "Civilisations", color: "from-green-500 to-emerald-500" },
  ];

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Requête vide",
        description: "Veuillez entrer une recherche",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-neopedia", {
        body: { query },
      });

      if (error) throw error;

      if (data?.result) {
        setResult(data.result);
      }
    } catch (error) {
      console.error("Erreur Neopedia AI:", error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer le résultat. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 grid-bg">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              NEOPEDIA IA
            </h1>
          </div>
          <p className="text-muted-foreground">Encyclopédie infinie générée par intelligence artificielle</p>
        </motion.div>

        <CyberCard className="p-6" glow>
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="font-orbitron text-primary">Recherche Futuriste</h3>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Ex: Vaisseaux interstellaires de 2075..."
                  className="pl-10 bg-cyber-darker border-primary/30 text-foreground"
                  disabled={isLoading}
                />
              </div>
              <CyberButton onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
              </CyberButton>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <motion.button
                    key={i}
                    onClick={() => setQuery(cat.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded border border-primary/30 bg-gradient-to-r ${cat.color} bg-opacity-10 hover:bg-opacity-20 transition-all`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-foreground">{cat.name}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </CyberCard>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CyberCard className="p-8" glow>
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <p className="text-primary font-orbitron">Génération de l'article futuriste...</p>
                  <div className="w-full bg-cyber-darker h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              </CyberCard>
            </motion.div>
          )}

          {!isLoading && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CyberCard className="p-8 space-y-6" glow>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="inline-block px-4 py-1 rounded-full bg-primary/20 border border-primary/50 mb-3">
                      <p className="text-xs font-orbitron text-primary">{result.category}</p>
                    </div>
                    <h2 className="text-3xl font-orbitron font-black text-primary mb-2">
                      {result.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Année: {result.futureYear}</span>
                      <span>•</span>
                      <span>Probabilité: {result.probability}</span>
                    </div>
                  </div>
                  <Sparkles className="h-8 w-8 text-primary animate-glow-pulse" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-orbitron text-primary mb-2">DESCRIPTION</h3>
                    <p className="text-foreground leading-relaxed">{result.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-orbitron text-primary mb-3">DÉTAILS TECHNIQUES</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {result.technicalDetails.map((detail, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-cyber-darker rounded border border-primary/20"
                        >
                          <Zap className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary/20">
                  <p className="text-xs text-muted-foreground text-center">
                    ⚠️ Article généré par IA. Contenu spéculatif et éducatif basé sur des tendances technologiques actuelles.
                  </p>
                </div>
              </CyberCard>
            </motion.div>
          )}

          {!isLoading && !result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CyberCard className="p-12 text-center">
                <Database className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
                <p className="text-muted-foreground font-orbitron">
                  Entrez une requête pour générer un article du futur
                </p>
              </CyberCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NeopediaAI;
