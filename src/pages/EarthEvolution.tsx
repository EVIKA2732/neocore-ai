import { useState } from "react";
import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Globe, Calendar, TrendingUp } from "lucide-react";

const TIMELINE_YEARS = [2025, 2035, 2045, 2055, 2065, 2075, 2085, 2095, 2100];

interface EraData {
  year: number;
  title: string;
  description: string;
  color: string;
  events: string[];
}

const ERA_DATA: EraData[] = [
  {
    year: 2025,
    title: "L'Éveil Technologique",
    description: "Début de l'ère de l'IA générative et de l'automatisation massive",
    color: "from-blue-500 to-cyan-500",
    events: [
      "Premier assistant IA personnel universel",
      "Véhicules autonomes niveau 4 standardisés",
      "Début de l'Internet quantique commercial"
    ]
  },
  {
    year: 2035,
    title: "La Révolution Verte",
    description: "Transition énergétique mondiale et restauration écologique",
    color: "from-green-500 to-emerald-500",
    events: [
      "80% d'énergie renouvelable mondiale",
      "Première ville 100% neutre en carbone",
      "Technologie de capture carbone à grande échelle"
    ]
  },
  {
    year: 2045,
    title: "L'Ère de Mars",
    description: "Première colonie permanente sur Mars et expansion spatiale",
    color: "from-red-500 to-orange-500",
    events: [
      "1000 habitants permanents sur Mars",
      "Premier bébé né hors de la Terre",
      "Exploitation minière d'astéroïdes opérationnelle"
    ]
  },
  {
    year: 2055,
    title: "La Fusion Homme-Machine",
    description: "Interfaces cerveau-ordinateur et augmentation humaine",
    color: "from-purple-500 to-pink-500",
    events: [
      "Implants neuronaux grand public",
      "Réalité augmentée permanente via lentilles",
      "Première conscience hybride certifiée"
    ]
  },
  {
    year: 2065,
    title: "La Médecine Quantique",
    description: "Nano-médecine et éradication des maladies majeures",
    color: "from-cyan-500 to-blue-500",
    events: [
      "Cancer devenu maladie chronique gérable",
      "Nano-robots médicaux standards",
      "Espérance de vie moyenne: 120 ans"
    ]
  },
  {
    year: 2075,
    title: "Les Cités Intelligentes",
    description: "Mégapoles auto-régulées et architecture organique",
    color: "from-indigo-500 to-violet-500",
    events: [
      "Première ville de 100 millions d'habitants",
      "Architecture auto-réparatrice",
      "Transport par hyperloop intercontinental"
    ]
  },
  {
    year: 2085,
    title: "L'Intelligence Distribuée",
    description: "Réseau neuronal planétaire et conscience collective",
    color: "from-yellow-500 to-amber-500",
    events: [
      "Réseau neuronal global opérationnel",
      "Traduction universelle instantanée",
      "Première IA avec droits légaux"
    ]
  },
  {
    year: 2095,
    title: "L'Expansion Galactique",
    description: "Exploration de systèmes stellaires proches",
    color: "from-pink-500 to-rose-500",
    events: [
      "Première sonde vers Alpha Centauri",
      "Colonies sur 12 corps célestes",
      "Population hors Terre: 10 millions"
    ]
  },
  {
    year: 2100,
    title: "L'Humanité 2.0",
    description: "Civilisation post-humaine et harmonie planétaire",
    color: "from-violet-500 to-purple-500",
    events: [
      "Paix mondiale consolidée",
      "Fusion complète physique-numérique",
      "Début de l'ère post-scarcité"
    ]
  }
];

const EarthEvolution = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const selectedEra = ERA_DATA.find(era => era.year === selectedYear) || ERA_DATA[0];

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 grid-bg">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <Globe className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              ÉVOLUTION TERRESTRE
            </h1>
          </div>
          <p className="text-muted-foreground">Chronologie spéculative 2025-2100</p>
        </motion.div>

        {/* Timeline */}
        <CyberCard className="p-6" glow>
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-orbitron text-primary">Timeline</h3>
            </div>

            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-cyber-darker -translate-y-1/2" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary to-accent -translate-y-1/2 transition-all duration-500"
                style={{ width: `${((selectedYear - 2025) / (2100 - 2025)) * 100}%` }}
              />

              {/* Year markers */}
              <div className="relative flex justify-between">
                {TIMELINE_YEARS.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`flex flex-col items-center gap-2 transition-all ${
                      selectedYear === year ? 'scale-110' : 'scale-100 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedYear === year 
                        ? 'bg-primary border-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]' 
                        : 'bg-cyber-dark border-primary/30'
                    }`} />
                    <span className={`text-xs font-orbitron ${
                      selectedYear === year ? 'text-primary font-bold' : 'text-muted-foreground'
                    }`}>
                      {year}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CyberCard>

        {/* Era Details */}
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CyberCard className="p-8" glow>
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${selectedEra.color} text-white font-orbitron font-bold`}>
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
                {selectedEra.events.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-cyber-darker p-4 rounded border border-primary/20"
                  >
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CyberCard>
        </motion.div>

        {/* Globe Placeholder (would be 3D globe with react-globe.gl) */}
        <CyberCard className="p-8" glow>
          <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Globe className="h-32 w-32 text-primary/50" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <p className="text-primary font-orbitron text-lg">Globe 3D Interactif</p>
                <p className="text-muted-foreground text-sm">
                  Visualisation de l'évolution planétaire
                </p>
              </div>
            </div>
          </div>
        </CyberCard>

        {/* Disclaimer */}
        <CyberCard className="p-4 bg-accent/10 border-accent/30">
          <p className="text-sm text-center text-muted-foreground">
            ⚠️ Contenu spéculatif et éducatif. Ces prédictions sont basées sur des tendances actuelles
            et ne constituent pas des prévisions scientifiques certaines.
          </p>
        </CyberCard>
      </div>
    </div>
  );
};

export default EarthEvolution;
