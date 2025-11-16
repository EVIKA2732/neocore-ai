import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Clock, Zap, Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

interface Era {
  year: number;
  name: string;
  theme: 'blue' | 'rose' | 'green' | 'orange' | 'purple';
  description: string;
  atmosphere: string;
  particles: number;
}

const eras: Era[] = [
  {
    year: 2025,
    name: "L'Aube Technologique",
    theme: 'blue',
    description: "Début de l'ère quantique. Les premiers ordinateurs quantiques commerciaux apparaissent.",
    atmosphere: "Optimisme numérique",
    particles: 20
  },
  {
    year: 2040,
    name: "Renaissance Cybernétique",
    theme: 'purple',
    description: "Fusion homme-machine. Les premiers implants neuronaux deviennent courants.",
    atmosphere: "Transhumanisme émergent",
    particles: 40
  },
  {
    year: 2060,
    name: "Ère Stellaire",
    theme: 'green',
    description: "Colonisation de Mars. L'humanité devient une espèce interplanétaire.",
    atmosphere: "Expansion cosmique",
    particles: 60
  },
  {
    year: 2080,
    name: "Singularité Proche",
    theme: 'orange',
    description: "Les IA générales dépassent l'intelligence humaine. Nouvelle révolution cognitive.",
    atmosphere: "Convergence IA-Humain",
    particles: 80
  },
  {
    year: 2110,
    name: "Civilisation Quantique",
    theme: 'rose',
    description: "Civilisation post-singularité. Conscience collective et réseaux neuronaux globaux.",
    atmosphere: "Harmonie cybernétique",
    particles: 100
  }
];

const TimeTravel = () => {
  const [selectedEra, setSelectedEra] = useState<Era>(eras[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { setTheme } = useTheme();

  const travelToEra = (era: Era) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    toast.info(`Voyage vers ${era.year}...`, { className: "neon-glow" });
    
    setTimeout(() => {
      setSelectedEra(era);
      setTheme(era.theme);
      setIsTransitioning(false);
      toast.success(`Arrivée en ${era.year} - ${era.name}`, { className: "neon-glow" });
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 grid-bg relative overflow-hidden">
      {/* Particules animées selon l'ère */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: selectedEra.particles }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <Clock className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              VOYAGE TEMPOREL
            </h1>
          </div>
          <p className="text-muted-foreground">Exploration chronologique 2025-2110</p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedEra.year}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <CyberCard className="p-8 space-y-6" glow>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                  <div>
                    <h2 className="text-4xl font-orbitron text-primary text-glow">
                      {selectedEra.year}
                    </h2>
                    <h3 className="text-xl font-orbitron text-primary/80">
                      {selectedEra.name}
                    </h3>
                  </div>
                </div>
                <Zap className={`h-8 w-8 text-primary ${isTransitioning ? 'animate-spin' : ''}`} />
              </div>

              <div className="space-y-4">
                <p className="text-lg text-foreground leading-relaxed">
                  {selectedEra.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-cyber-darker p-4 rounded border border-primary/30">
                    <div className="text-primary/70 text-sm mb-2">Atmosphère</div>
                    <div className="text-primary font-orbitron">{selectedEra.atmosphere}</div>
                  </div>
                  <div className="bg-cyber-darker p-4 rounded border border-primary/30">
                    <div className="text-primary/70 text-sm mb-2">Thème Interface</div>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-4 h-4 rounded-full`}
                        style={{ 
                          backgroundColor: selectedEra.theme === 'blue' ? '#3b82f6' :
                                         selectedEra.theme === 'rose' ? '#ec4899' :
                                         selectedEra.theme === 'green' ? '#10b981' :
                                         selectedEra.theme === 'orange' ? '#f97316' :
                                         '#a855f7'
                        }}
                      />
                      <div className="text-primary font-orbitron capitalize">{selectedEra.theme}</div>
                    </div>
                  </div>
                </div>
              </div>

              {isTransitioning && (
                <div className="text-center py-8">
                  <motion.div
                    className="text-primary font-orbitron text-xl"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ⚡ Distorsion temporelle en cours...
                  </motion.div>
                </div>
              )}
            </CyberCard>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CyberCard className="p-6" glow>
            <h3 className="font-orbitron text-xl text-primary mb-6 text-center">
              Sélectionnez une Époque
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {eras.map((era) => (
                <CyberButton
                  key={era.year}
                  variant={selectedEra.year === era.year ? 'primary' : 'ghost'}
                  onClick={() => travelToEra(era)}
                  disabled={isTransitioning}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <span className="text-2xl font-orbitron">{era.year}</span>
                  <span className="text-xs">{era.name.split(' ')[0]}</span>
                </CyberButton>
              ))}
            </div>
          </CyberCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CyberCard className="p-6" glow>
            <div className="space-y-3">
              <h4 className="font-orbitron text-primary">Timeline de l'Humanité</h4>
              <div className="relative h-2 bg-cyber-darker rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${((selectedEra.year - 2025) / (2110 - 2025)) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-xs text-primary/70 font-mono">
                <span>2025</span>
                <span>Vous êtes ici: {selectedEra.year}</span>
                <span>2110</span>
              </div>
            </div>
          </CyberCard>
        </motion.div>
      </div>
    </div>
  );
};

export default TimeTravel;
