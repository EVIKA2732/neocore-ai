import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Brain, Sparkles, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type TimeFrame = "court" | "moyen" | "long";
type Category = "tech" | "perso" | "pro" | "sante" | "global";

interface Prediction {
  id: string;
  question: string;
  timeframe: TimeFrame;
  category: Category;
  prediction: string;
  probability: number;
  factors: string[];
  timestamp: Date;
}

const FuturePredictions = () => {
  const [question, setQuestion] = useState("");
  const [timeframe, setTimeframe] = useState<TimeFrame>("moyen");
  const [category, setCategory] = useState<Category>("tech");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generatePrediction = async () => {
    if (!question.trim()) {
      toast.error("Veuillez poser une question");
      return;
    }

    setIsAnalyzing(true);

    // Simulation d'analyse
    setTimeout(() => {
      const probabilityBase = Math.random() * 40 + 40; // 40-80%
      
      const timeframeText = {
        court: "d'ici 1-2 ans",
        moyen: "d'ici 3-5 ans",
        long: "d'ici 10-20 ans"
      };

      const scenarios = {
        tech: [
          `Forte probabilité d'adoption généralisée ${timeframeText[timeframe]}`,
          `Évolution technologique progressive avec plusieurs étapes clés`,
          `Intégration dans les systèmes existants de façon graduelle`,
          `Apparition de standards industriels pour réguler l'innovation`
        ],
        perso: [
          `Évolution positive probable si les conditions actuelles persistent`,
          `Nécessité d'adaptation et d'apprentissage continu`,
          `Opportunités de croissance personnelle significatives`,
          `Collaboration et réseau seront des facteurs déterminants`
        ],
        pro: [
          `Transformation du marché du travail dans ce secteur`,
          `Nouvelles compétences requises pour rester compétitif`,
          `Automatisation partielle mais rôle humain essentiel`,
          `Émergence de nouveaux modèles économiques hybrides`
        ],
        sante: [
          `Avancées médicales progressives basées sur l'IA`,
          `Personnalisation accrue des traitements`,
          `Prévention devenant aussi importante que le curatif`,
          `Accessibilité variable selon les régions du monde`
        ],
        global: [
          `Tendance mondiale vers une convergence technologique`,
          `Défis climatiques influençant toutes les décisions`,
          `Redistribution géopolitique du pouvoir économique`,
          `Collaboration internationale cruciale pour le succès`
        ]
      };

      const factors = [
        "Vitesse d'adoption technologique",
        "Contexte économique global",
        "Régulations et cadre légal",
        "Acceptation sociale et culturelle",
        "Investissements et financements",
        "Niveau de concurrence dans le secteur"
      ].sort(() => Math.random() - 0.5).slice(0, 4);

      const newPrediction: Prediction = {
        id: Date.now().toString(),
        question: question,
        timeframe,
        category,
        prediction: scenarios[category][Math.floor(Math.random() * scenarios[category].length)],
        probability: Math.round(probabilityBase),
        factors,
        timestamp: new Date()
      };

      setPredictions(prev => [newPrediction, ...prev]);
      setQuestion("");
      setIsAnalyzing(false);
      toast.success("Prédiction générée");
    }, 2000);
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
            <Brain className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              ORACLE CYBERNÉTIQUE
            </h1>
          </div>
          <p className="text-muted-foreground">
            Prédictions analytiques basées sur les tendances et probabilités
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CyberCard className="p-6 space-y-4" glow>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-orbitron text-lg text-primary">Poser une question</h2>
            </div>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Comment l'IA va-t-elle évoluer dans le domaine médical ?"
              className="w-full bg-cyber-darker border border-primary/30 rounded p-3 text-foreground placeholder:text-muted-foreground resize-none focus:border-primary focus:outline-none"
              rows={3}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Horizon temporel</label>
                <div className="flex gap-2">
                  {["court", "moyen", "long"].map((tf) => (
                    <CyberButton
                      key={tf}
                      variant={timeframe === tf ? "primary" : "ghost"}
                      onClick={() => setTimeframe(tf as TimeFrame)}
                      fullWidth
                    >
                      {tf === "court" ? "Court" : tf === "moyen" ? "Moyen" : "Long"}
                    </CyberButton>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-cyber-darker border border-primary/30 rounded p-2 text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="tech">Technologie</option>
                  <option value="perso">Personnel</option>
                  <option value="pro">Professionnel</option>
                  <option value="sante">Santé</option>
                  <option value="global">Global</option>
                </select>
              </div>
            </div>

            <CyberButton
              variant="primary"
              icon={Brain}
              onClick={generatePrediction}
              disabled={isAnalyzing}
              fullWidth
            >
              {isAnalyzing ? "Analyse en cours..." : "Générer prédiction"}
            </CyberButton>

            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
              <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-400">
                Les prédictions sont basées sur des analyses probabilistes et des tendances actuelles. 
                Elles ne constituent pas des certitudes et doivent être interprétées avec discernement.
              </p>
            </div>
          </CyberCard>
        </motion.div>

        {/* Predictions List */}
        <div className="space-y-4">
          <AnimatePresence>
            {predictions.map((pred, index) => (
              <motion.div
                key={pred.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard className="p-6" glow>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-orbitron text-lg text-primary mb-2">
                          {pred.question}
                        </h3>
                        <div className="flex gap-2 mb-3">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            {pred.timeframe === "court" ? "Court terme" : pred.timeframe === "moyen" ? "Moyen terme" : "Long terme"}
                          </span>
                          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded capitalize">
                            {pred.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Probabilité</div>
                        <div className="text-2xl font-orbitron text-primary">
                          {pred.probability}%
                        </div>
                      </div>
                    </div>

                    <div className="bg-cyber-darker p-4 rounded border border-primary/20">
                      <div className="flex items-start gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary mt-1" />
                        <p className="text-foreground">{pred.prediction}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-orbitron text-primary mb-2">Facteurs influents</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {pred.factors.map((factor, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-cyber-darker p-2 rounded border border-primary/10 text-muted-foreground"
                          >
                            • {factor}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-primary/10">
                      <Clock className="h-3 w-3" />
                      <span>Analysé le {pred.timestamp.toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </AnimatePresence>

          {predictions.length === 0 && (
            <CyberCard className="p-12 text-center">
              <Brain className="h-16 w-16 mx-auto mb-4 text-primary/30" />
              <p className="text-muted-foreground">
                Aucune prédiction générée. Posez votre première question ci-dessus.
              </p>
            </CyberCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default FuturePredictions;
