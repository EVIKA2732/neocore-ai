import { useState } from "react";
import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { Activity, Brain, Heart, Dna, Sparkles, Zap } from "lucide-react";

interface Therapy {
  id: string;
  name: string;
  icon: any;
  category: string;
  description: string;
  status: string;
  year: number;
  effectiveness: number;
}

const therapies: Therapy[] = [
  {
    id: "1",
    name: "Nano-Robots Réparateurs",
    icon: Sparkles,
    category: "Régénération Cellulaire",
    description: "Nano-robots autonomes capables de réparer les cellules endommagées au niveau moléculaire. Utilise l'IA pour identifier et corriger les anomalies génétiques.",
    status: "Opérationnel",
    year: 2045,
    effectiveness: 98
  },
  {
    id: "2",
    name: "Implant Neural Quantique",
    icon: Brain,
    category: "Augmentation Cognitive",
    description: "Interface cerveau-machine permettant l'augmentation des capacités cognitives, la restauration de la mémoire et l'accès direct aux réseaux neuronaux quantiques.",
    status: "Phase III",
    year: 2055,
    effectiveness: 94
  },
  {
    id: "3",
    name: "Thérapie Génique CRISPR-X",
    icon: Dna,
    category: "Modification Génétique",
    description: "Édition génétique avancée permettant l'élimination des maladies héréditaires et l'optimisation du code génétique humain pour une longévité accrue.",
    status: "Opérationnel",
    year: 2040,
    effectiveness: 96
  },
  {
    id: "4",
    name: "Cœur Biosynthétique",
    icon: Heart,
    category: "Organes Artificiels",
    description: "Organe cardiaque biosynthétique auto-régénérant avec capacité d'adaptation aux besoins métaboliques. Durée de vie estimée: 200 ans.",
    status: "Approuvé",
    year: 2050,
    effectiveness: 99
  },
  {
    id: "5",
    name: "Sérum de Régénération Cellulaire",
    icon: Zap,
    category: "Anti-Vieillissement",
    description: "Traitement révolutionnaire activant les télomérases et restaurant les cellules souches. Inverse le processus de vieillissement au niveau cellulaire.",
    status: "Phase II",
    year: 2060,
    effectiveness: 92
  },
  {
    id: "6",
    name: "Système Immunitaire Augmenté",
    icon: Activity,
    category: "Immunologie",
    description: "Réseau de nano-sentinelles surveillant constamment l'organisme et neutralisant virus, bactéries et cellules cancéreuses avant développement.",
    status: "Opérationnel",
    year: 2048,
    effectiveness: 97
  }
];

const Nanomedicine = () => {
  const [selectedTherapy, setSelectedTherapy] = useState<Therapy | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const categories = ["all", ...new Set(therapies.map(t => t.category))];
  
  const filteredTherapies = filter === "all" 
    ? therapies 
    : therapies.filter(t => t.category === filter);

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 grid-bg">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <Activity className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              NANOMÉDECINE 2110
            </h1>
          </div>
          <p className="text-muted-foreground">Thérapies & Augmentations du Futur</p>
          <p className="text-xs text-primary/60">⚠️ Contenu spéculatif à visée éducative</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <CyberCard className="p-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`
                    px-4 py-2 rounded border-2 transition-all text-sm font-orbitron
                    ${filter === cat 
                      ? 'bg-primary text-primary-foreground border-primary neon-glow' 
                      : 'bg-cyber-darker border-primary/30 text-primary hover:border-primary'
                    }
                  `}
                >
                  {cat === "all" ? "Toutes" : cat}
                </button>
              ))}
            </div>
          </CyberCard>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapies.map((therapy, index) => {
            const Icon = therapy.icon;
            return (
              <motion.div
                key={therapy.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedTherapy(therapy)}
              >
                <CyberCard 
                  className="p-6 space-y-4 cursor-pointer hover:scale-105 transition-transform h-full" 
                  glow
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-orbitron text-lg text-primary">
                          {therapy.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{therapy.category}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {therapy.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-primary/70">Efficacité</span>
                      <span className="text-primary font-mono">{therapy.effectiveness}%</span>
                    </div>
                    <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary/50"
                        initial={{ width: 0 }}
                        animate={{ width: `${therapy.effectiveness}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-primary/30">
                    <span className={`
                      text-xs px-3 py-1 rounded-full font-mono
                      ${therapy.status === 'Opérationnel' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : therapy.status === 'Approuvé'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }
                    `}>
                      {therapy.status}
                    </span>
                    <span className="text-xs text-primary/70 font-mono">
                      Est. {therapy.year}
                    </span>
                  </div>
                </CyberCard>
              </motion.div>
            );
          })}
        </div>

        {selectedTherapy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedTherapy(null)}
          >
            <CyberCard 
              className="max-w-2xl w-full p-8 space-y-6" 
              glow
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                {(() => {
                  const Icon = selectedTherapy.icon;
                  return <Icon className="h-12 w-12 text-primary" />;
                })()}
                <div className="flex-1">
                  <h2 className="text-2xl font-orbitron text-primary mb-2">
                    {selectedTherapy.name}
                  </h2>
                  <p className="text-primary/70">{selectedTherapy.category}</p>
                </div>
                <button
                  onClick={() => setSelectedTherapy(null)}
                  className="text-primary hover:text-primary/70 text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {selectedTherapy.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-cyber-darker p-4 rounded border border-primary/30">
                  <div className="text-primary/70 text-sm mb-2">Statut</div>
                  <div className="text-primary font-orbitron">{selectedTherapy.status}</div>
                </div>
                <div className="bg-cyber-darker p-4 rounded border border-primary/30">
                  <div className="text-primary/70 text-sm mb-2">Disponibilité</div>
                  <div className="text-primary font-orbitron">{selectedTherapy.year}</div>
                </div>
                <div className="col-span-2 bg-cyber-darker p-4 rounded border border-primary/30">
                  <div className="text-primary/70 text-sm mb-2">Taux d'Efficacité</div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-cyber-darker rounded-full overflow-hidden border border-primary/30">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary/50"
                        style={{ width: `${selectedTherapy.effectiveness}%` }}
                      />
                    </div>
                    <span className="text-primary font-orbitron text-xl">
                      {selectedTherapy.effectiveness}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-primary/30">
                <p className="text-xs text-primary/60 italic">
                  ⚠️ Cette thérapie est spéculative et à visée éducative uniquement.
                  Basée sur les tendances actuelles en nanotechnologie et médecine régénérative.
                </p>
              </div>
            </CyberCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Nanomedicine;
