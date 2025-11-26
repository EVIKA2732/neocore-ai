import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Play, RotateCcw, Trophy } from "lucide-react";
import { toast } from "sonner";

type Horse = {
  id: number;
  name: string;
  position: number;
  speed: number;
  color: string;
};

const TRACK_LENGTH = 100;
const INITIAL_HORSES: Horse[] = [
  { id: 1, name: "Cyber Star", position: 0, speed: 0, color: "hsl(190, 100%, 50%)" },
  { id: 2, name: "Neon Flash", position: 0, speed: 0, color: "hsl(330, 100%, 50%)" },
  { id: 3, name: "Quantum Bolt", position: 0, speed: 0, color: "hsl(280, 85%, 50%)" },
  { id: 4, name: "Plasma Runner", position: 0, speed: 0, color: "hsl(130, 100%, 50%)" },
];

const HorseRacing = () => {
  const [horses, setHorses] = useState<Horse[]>(INITIAL_HORSES);
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<Horse | null>(null);
  const [playerHorse, setPlayerHorse] = useState<number>(1);

  const resetRace = () => {
    setHorses(INITIAL_HORSES);
    setIsRacing(false);
    setWinner(null);
  };

  const startRace = () => {
    setIsRacing(true);
    setWinner(null);
    toast.info("🏁 La course commence !");
  };

  const updateRace = useCallback(() => {
    if (!isRacing || winner) return;

    setHorses((prevHorses) => {
      const newHorses = prevHorses.map((horse) => {
        const randomSpeed = Math.random() * 2 + 0.5;
        const newPosition = Math.min(horse.position + randomSpeed, TRACK_LENGTH);
        return { ...horse, position: newPosition, speed: randomSpeed };
      });

      const finisher = newHorses.find((h) => h.position >= TRACK_LENGTH);
      if (finisher) {
        setWinner(finisher);
        setIsRacing(false);
        if (finisher.id === playerHorse) {
          toast.success("🏆 Victoire ! Votre cheval a gagné !", {
            className: "neon-glow"
          });
        } else {
          toast("😔 Dommage, votre cheval n'a pas gagné cette fois");
        }
      }

      return newHorses;
    });
  }, [isRacing, winner, playerHorse]);

  useEffect(() => {
    if (!isRacing || winner) return;
    const interval = setInterval(updateRace, 50);
    return () => clearInterval(interval);
  }, [isRacing, winner, updateRace]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isRacing || winner) return;
      
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        setHorses((prev) =>
          prev.map((h) =>
            h.id === playerHorse
              ? { ...h, position: Math.min(h.position + 3, TRACK_LENGTH) }
              : h
          )
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isRacing, winner, playerHorse]);

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 grid-bg">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <Trophy className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              COURSE DE CHEVAUX CEI
            </h1>
          </div>
          <p className="text-muted-foreground">Choisissez votre cheval et appuyez sur ESPACE pour accélérer !</p>
        </motion.div>

        <CyberCard className="p-6 space-y-6" glow>
          {/* Horse selection */}
          <div className="space-y-2">
            <label className="text-sm font-orbitron text-primary">Choisissez votre cheval :</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {horses.map((horse) => (
                <button
                  key={horse.id}
                  onClick={() => setPlayerHorse(horse.id)}
                  disabled={isRacing}
                  className={`p-3 rounded border-2 transition-all ${
                    playerHorse === horse.id
                      ? "border-primary bg-primary/20 neon-glow"
                      : "border-primary/30 hover:border-primary/50"
                  } ${isRacing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="font-orbitron text-sm" style={{ color: horse.color }}>
                    {horse.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Race track */}
          <div className="relative bg-cyber-darker border-2 border-primary/30 rounded-lg p-6 overflow-hidden">
            <div className="space-y-4">
              {horses.map((horse, index) => (
                <div key={horse.id} className="relative">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-orbitron w-24" style={{ color: horse.color }}>
                      {horse.name}
                    </span>
                    {winner?.id === horse.id && (
                      <Trophy className="h-4 w-4 text-yellow-400 animate-pulse" />
                    )}
                  </div>
                  <div className="relative h-8 bg-background/50 rounded border border-primary/20">
                    {/* Finish line */}
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary/50" />
                    
                    {/* Horse */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1"
                      style={{
                        left: `${(horse.position / TRACK_LENGTH) * 100}%`,
                        transition: "left 0.05s linear",
                      }}
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${
                          horse.id === playerHorse ? "neon-glow-strong" : "neon-glow"
                        }`}
                        style={{ backgroundColor: horse.color }}
                      />
                      {isRacing && horse.speed > 0 && (
                        <motion.div
                          className="flex gap-0.5"
                          animate={{ opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 0.3, repeat: Infinity }}
                        >
                          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: horse.color }} />
                          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: horse.color }} />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>

            {winner && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-cyber-dark/90 backdrop-blur-sm"
              >
                <div className="text-center space-y-3">
                  <Trophy className="h-16 w-16 text-yellow-400 mx-auto animate-pulse" />
                  <h2 className="text-3xl font-orbitron font-black text-primary">
                    {winner.name} a gagné !
                  </h2>
                  {winner.id === playerHorse && (
                    <p className="text-accent text-xl">🎉 Félicitations !</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <CyberButton
              variant="primary"
              icon={Play}
              onClick={startRace}
              disabled={isRacing}
              fullWidth
            >
              {isRacing ? "Course en cours..." : "Démarrer la course"}
            </CyberButton>
            <CyberButton variant="accent" icon={RotateCcw} onClick={resetRace}>
              Reset
            </CyberButton>
          </div>

          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p>🎮 Appuyez sur ESPACE ou ↑ pour accélérer votre cheval pendant la course</p>
            <p>⚡ Les autres chevaux avancent automatiquement</p>
          </div>
        </CyberCard>
      </div>
    </div>
  );
};

export default HorseRacing;
