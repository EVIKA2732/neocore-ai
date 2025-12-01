import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Play, RotateCcw, Trophy, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Horse {
  id: number;
  name: string;
  position: number;
  speed: number;
  color: string;
}

const TRACK_LENGTH = 100;
const FINISH_LINE = 95;

const HORSE_NAMES = [
  "Cyber Stallion",
  "Neon Runner", 
  "Quantum Dash",
  "Digital Thunder"
];

const HORSE_COLORS = [
  "#00d4ff",
  "#ff00ea",
  "#00ff9d",
  "#ffea00"
];

const HorseRacing = () => {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [playerHorse, setPlayerHorse] = useState<Horse | null>(null);
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<Horse | null>(null);
  const [terrain, setTerrain] = useState<number[]>([]);

  const initRace = useCallback(() => {
    const newHorses = HORSE_NAMES.map((name, idx) => ({
      id: idx,
      name,
      position: 0,
      speed: 0.5 + Math.random() * 0.5,
      color: HORSE_COLORS[idx]
    }));
    
    setHorses(newHorses);
    setPlayerHorse(newHorses[0]);
    setWinner(null);
    
    const newTerrain = Array.from({ length: 20 }, () => Math.random() > 0.7 ? 1 : 0);
    setTerrain(newTerrain);
  }, []);

  useEffect(() => {
    initRace();
  }, [initRace]);

  useEffect(() => {
    if (!isRacing || winner) return;

    const interval = setInterval(() => {
      setHorses(prev => {
        const updated = prev.map(horse => {
          if (horse.position >= FINISH_LINE) return horse;
          
          const terrainIndex = Math.floor(horse.position / 5);
          const terrainPenalty = terrain[terrainIndex] || 0;
          const baseSpeed = horse.id === 0 ? playerHorse!.speed : horse.speed;
          const actualSpeed = baseSpeed * (1 - terrainPenalty * 0.3);
          
          return {
            ...horse,
            position: Math.min(horse.position + actualSpeed, TRACK_LENGTH)
          };
        });

        const finisher = updated.find(h => h.position >= FINISH_LINE && !winner);
        if (finisher) {
          setWinner(finisher);
          setIsRacing(false);
          toast.success(`${finisher.name} remporte la course!`);
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRacing, winner, terrain, playerHorse]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRacing || !playerHorse || winner) return;

      if (e.key === 'ArrowRight') {
        setPlayerHorse(prev => prev ? { ...prev, speed: Math.min(prev.speed + 0.1, 2) } : null);
      } else if (e.key === 'ArrowLeft') {
        setPlayerHorse(prev => prev ? { ...prev, speed: Math.max(prev.speed - 0.1, 0.2) } : null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRacing, playerHorse, winner]);

  useEffect(() => {
    if (playerHorse) {
      setHorses(prev => prev.map(h => h.id === 0 ? { ...h, speed: playerHorse.speed } : h));
    }
  }, [playerHorse]);

  const startRace = () => {
    initRace();
    setIsRacing(true);
    toast.success("Course lancée! Utilisez les flèches pour contrôler votre cheval");
  };

  const resetRace = () => {
    initRace();
    setIsRacing(false);
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
            <Trophy className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              COURSE CYBER-CEI
            </h1>
          </div>
          <p className="text-muted-foreground">Course de chevaux futuriste contrôlée par IA</p>
        </motion.div>

        <CyberCard className="p-6 space-y-4" glow>
          <div className="relative bg-cyber-darker border-2 border-primary/30 rounded-lg p-6 min-h-[400px]">
            <div 
              className="absolute top-0 bottom-0 w-1 bg-primary/50"
              style={{ left: `${FINISH_LINE}%` }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-primary font-orbitron">
                ARRIVÉE
              </span>
            </div>

            <div className="absolute top-0 left-0 right-0 h-8 flex">
              {terrain.map((obstacle, idx) => (
                <div
                  key={idx}
                  className={`flex-1 border-r border-primary/10 ${
                    obstacle ? 'bg-yellow-500/20' : 'bg-cyber-darker'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-6 mt-12">
              {horses.map((horse) => (
                <motion.div
                  key={horse.id}
                  className="relative h-16"
                >
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-primary/10" />
                  
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2"
                    animate={{ left: `${horse.position}%` }}
                    transition={{ duration: 0.05, ease: "linear" }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span 
                        className="text-4xl drop-shadow-[0_0_10px_currentColor]"
                        style={{ color: horse.color }}
                      >
                        🏇
                      </span>
                      <span 
                        className="text-xs font-orbitron whitespace-nowrap"
                        style={{ color: horse.color }}
                      >
                        {horse.name}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <CyberCard className="p-6 bg-primary/10 border-2 border-primary">
                  <div className="text-center space-y-3">
                    <Trophy className="h-16 w-16 mx-auto text-primary animate-glow-pulse" />
                    <h2 className="text-2xl font-orbitron text-primary">
                      🏆 VAINQUEUR: {winner.name} 🏆
                    </h2>
                    {winner.id === 0 && (
                      <p className="text-accent">Félicitations ! Vous avez gagné !</p>
                    )}
                  </div>
                </CyberCard>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            <CyberButton
              variant="primary"
              icon={Play}
              onClick={startRace}
              disabled={isRacing}
              fullWidth
            >
              {isRacing ? "Course en cours..." : "Démarrer"}
            </CyberButton>
            <CyberButton
              variant="ghost"
              icon={RotateCcw}
              onClick={resetRace}
            >
              Reset
            </CyberButton>
          </div>

          <CyberCard className="p-4 bg-cyber-darker">
            <div className="space-y-2">
              <h3 className="font-orbitron text-sm text-primary mb-2">Contrôles</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Accélérer</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4 text-primary" />
                  <span>Ralentir</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Votre cheval : {horses[0]?.name} • Les zones jaunes ralentissent les chevaux
              </p>
            </div>
          </CyberCard>
        </CyberCard>
      </div>
    </div>
  );
};

export default HorseRacing;
