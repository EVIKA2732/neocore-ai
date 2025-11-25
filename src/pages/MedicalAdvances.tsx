import { useState } from "react";
import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { Heart, Microscope, Brain, Dna, Activity, Pill } from "lucide-react";

interface MedicalEra {
  year: number;
  title: string;
  description: string;
  advances: {
    icon: any;
    name: string;
    detail: string;
  }[];
}

const MEDICAL_ERAS: MedicalEra[] = [
  {
    year: 2030,
    title: "L'Ère des Nano-Diagnostics",
    description: "Détection précoce et personnalisation des traitements",
    advances: [
      {
        icon: Microscope,
        name: "Nano-capteurs implantables",
        detail: "Surveillance continue des biomarqueurs sanguins en temps réel"
      },
      {
        icon: Dna,
        name: "Thérapie génique CRISPR-X",
        detail: "Correction génétique ciblée pour 50+ maladies héréditaires"
      },
      {
        icon: Brain,
        name: "Interfaces neuronales médicales",
        detail: "Traitement des paralysies et troubles neurologiques"
      }
    ]
  },
  {
    year: 2040,
    title: "La Médecine Régénérative",
    description: "Reconstruction tissulaire et organes artificiels",
    advances: [
      {
        icon: Heart,
        name: "Organes bio-imprimés",
        detail: "Impression 3D d'organes fonctionnels à partir de cellules souches"
      },
      {
        icon: Activity,
        name: "Nano-robots chirurgicaux",
        detail: "Interventions micro-invasives guidées par IA"
      },
      {
        icon: Pill,
        name: "Médicaments intelligents",
        detail: "Libération ciblée et dosage adaptatif selon les besoins"
      }
    ]
  },
  {
    year: 2050,
    title: "L'Immortalité Cellulaire",
    description: "Ralentissement du vieillissement et longévité accrue",
    advances: [
      {
        icon: Dna,
        name: "Thérapie télomérienne",
        detail: "Régénération des télomères pour prolonger la vie cellulaire"
      },
      {
        icon: Brain,
        name: "Upload neuronal partiel",
        detail: "Sauvegarde et restauration de patterns neuronaux"
      },
      {
        icon: Microscope,
        name: "Éradication du cancer",
        detail: "Détection et destruction automatique des cellules cancéreuses"
      }
    ]
  },
  {
    year: 2060,
    title: "La Fusion Bio-Digitale",
    description: "Augmentation humaine et symbiose homme-machine",
    advances: [
      {
        icon: Brain,
        name: "Implants cognitifs",
        detail: "Augmentation de la mémoire et des capacités intellectuelles"
      },
      {
        icon: Activity,
        name: "Exosquelettes biologiques",
        detail: "Muscles artificiels intégrés au système nerveux"
      },
      {
        icon: Heart,
        name: "Cœur artificiel perpétuel",
        detail: "Organe synthétique auto-alimenté par bio-électricité"
      }
    ]
  },
  {
    year: 2070,
    title: "La Médecine Quantique",
    description: "Manipulation de la matière au niveau subatomique",
    advances: [
      {
        icon: Microscope,
        name: "Réparation quantique ADN",
        detail: "Correction d'erreurs génétiques au niveau quantique"
      },
      {
        icon: Pill,
        name: "Nano-médecine quantique",
        detail: "Robots moléculaires opérant à l'échelle quantique"
      },
      {
        icon: Brain,
        name: "Conscience distribuée",
        detail: "Réseau neuronal partagé entre cerveaux biologiques et IA"
      }
    ]
  },
  {
    year: 2080,
    title: "Le Corps Modulaire",
    description: "Remplacement et amélioration d'organes à volonté",
    advances: [
      {
        icon: Activity,
        name: "Organes plug-and-play",
        detail: "Remplacement instantané d'organes défaillants"
      },
      {
        icon: Dna,
        name: "Reprogrammation cellulaire totale",
        detail: "Transformation complète du génome en quelques heures"
      },
      {
        icon: Heart,
        name: "Système cardiovasculaire synthétique",
        detail: "Remplacement complet du réseau sanguin par fluide intelligent"
      }
    ]
  },
  {
    year: 2090,
    title: "La Post-Biologie",
    description: "Au-delà de la biologie traditionnelle",
    advances: [
      {
        icon: Brain,
        name: "Transfert de conscience",
        detail: "Migration complète de l'esprit vers substrat synthétique"
      },
      {
        icon: Microscope,
        name: "Corps à géométrie variable",
        detail: "Transformation physique contrôlée par la pensée"
      },
      {
        icon: Pill,
        name: "Auto-évolution dirigée",
        detail: "Contrôle conscient de sa propre évolution biologique"
      }
    ]
  },
  {
    year: 2100,
    title: "L'Humanité Transcendée",
    description: "Fusion complète du biologique et du technologique",
    advances: [
      {
        icon: Brain,
        name: "Conscience distribuée globale",
        detail: "Réseau neuronal planétaire interconnecté"
      },
      {
        icon: Heart,
        name: "Corps multi-substrats",
        detail: "Existence simultanée dans plusieurs formes physiques"
      },
      {
        icon: Dna,
        name: "Génome universel adaptatif",
        detail: "ADN auto-modifiant pour s'adapter à tout environnement"
      }
    ]
  }
];

const MedicalAdvances = () => {
  const [selectedYear, setSelectedYear] = useState(2030);
  const selectedEra = MEDICAL_ERAS.find(era => era.year === selectedYear) || MEDICAL_ERAS[0];

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 grid-bg">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <Heart className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              AVANCÉES MÉDICALES
            </h1>
          </div>
          <p className="text-muted-foreground">Evolution de la médecine 2030-2100</p>
        </motion.div>

        <CyberCard className="p-6" glow>
          <div className="space-y-4">
            <h3 className="font-orbitron text-primary mb-4">Timeline Médicale</h3>
            
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-cyber-darker -translate-y-1/2" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary to-accent -translate-y-1/2 transition-all duration-500"
                style={{ width: `${((selectedYear - 2030) / (2100 - 2030)) * 100}%` }}
              />

              <div className="relative flex justify-between">
                {MEDICAL_ERAS.map((era) => (
                  <button
                    key={era.year}
                    onClick={() => setSelectedYear(era.year)}
                    className={`flex flex-col items-center gap-2 transition-all ${
                      selectedYear === era.year ? 'scale-110' : 'scale-100 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedYear === era.year 
                        ? 'bg-primary border-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]' 
                        : 'bg-cyber-dark border-primary/30'
                    }`} />
                    <span className={`text-xs font-orbitron ${
                      selectedYear === era.year ? 'text-primary font-bold' : 'text-muted-foreground'
                    }`}>
                      {era.year}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CyberCard>

        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CyberCard className="p-8" glow>
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-white font-orbitron font-bold">
                  {selectedEra.year}
                </div>
                <h2 className="text-3xl font-orbitron text-primary">
                  {selectedEra.title}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {selectedEra.description}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {selectedEra.advances.map((advance, index) => {
                  const Icon = advance.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-cyber-darker p-6 rounded border border-primary/20 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded border border-primary/30">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="font-orbitron text-primary font-bold">{advance.name}</h4>
                      </div>
                      <p className="text-sm text-foreground">{advance.detail}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </CyberCard>
        </motion.div>

        <CyberCard className="p-4 bg-accent/10 border-accent/30">
          <p className="text-sm text-center text-muted-foreground">
            ⚠️ Contenu spéculatif et éducatif. Ces prévisions sont basées sur des tendances actuelles et ne constituent pas des certitudes scientifiques. NEOCORE AI ne fournit aucun conseil médical.
          </p>
        </CyberCard>
      </div>
    </div>
  );
};

export default MedicalAdvances;
