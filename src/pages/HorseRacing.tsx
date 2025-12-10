import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Play, RotateCcw, Trophy, ArrowRight, ArrowLeft, Layers, Square } from "lucide-react";
import { toast } from "sonner";

interface Horse {
  id: number;
  name: string;
  position: number;
  speed: number;
  color: string;
  lane: number;
}

const TRACK_LENGTH = 100;
const FINISH_LINE = 92;

const HORSE_NAMES = [
  "Cyber Stallion",
  "Neon Runner", 
  "Quantum Dash",
  "Digital Thunder",
  "Pixel Storm",
  "Chrome Blazer"
];

const HORSE_COLORS = [
  "#00d4ff",
  "#ff00ea",
  "#00ff9d",
  "#ffea00",
  "#ff6b00",
  "#b400ff"
];

const HorseRacing = () => {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [playerHorse, setPlayerHorse] = useState<Horse | null>(null);
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<Horse | null>(null);
  const [terrain, setTerrain] = useState<number[]>([]);
  const [is3D, setIs3D] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const gameLoopRef = useRef<number>();

  const initRace = useCallback(() => {
    // All horses start with similar base speeds - more balanced
    const baseSpeed = 0.35;
    const newHorses = HORSE_NAMES.map((name, idx) => ({
      id: idx,
      name,
      position: 0,
      speed: baseSpeed + Math.random() * 0.25, // 0.35-0.60 range
      color: HORSE_COLORS[idx],
      lane: idx
    }));
    
    // Player horse starts at average speed - can win or lose
    setHorses(newHorses);
    setPlayerHorse({ ...newHorses[0], speed: 0.42 });
    setWinner(null);
    setCountdown(null);
    
    // More varied terrain
    const newTerrain = Array.from({ length: 25 }, () => Math.random() > 0.7 ? 1 : 0);
    setTerrain(newTerrain);
  }, []);

  useEffect(() => {
    initRace();
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [initRace]);

  // Game loop
  useEffect(() => {
    if (!isRacing || winner) return;

    let lastTime = performance.now();
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 16.67; // Normalize to ~60fps
      lastTime = currentTime;

      setHorses(prev => {
        const updated = prev.map(horse => {
          if (horse.position >= FINISH_LINE) return horse;
          
          const terrainIndex = Math.floor(horse.position / 4);
          const terrainPenalty = terrain[terrainIndex] || 0;
          const baseSpeed = horse.id === 0 ? (playerHorse?.speed || 0.42) : horse.speed;
          
          // More balanced randomness - AI horses have significant variation
          // This allows any horse to win, including player losing
          const randomFactor = 0.85 + Math.random() * 0.35; // 0.85 - 1.20
          const staminaVariation = horse.id === 0 ? 1 : (0.95 + Math.random() * 0.15); // AI stamina
          const actualSpeed = baseSpeed * (1 - terrainPenalty * 0.2) * randomFactor * staminaVariation * deltaTime;
          
          return {
            ...horse,
            position: Math.min(horse.position + actualSpeed, TRACK_LENGTH)
          };
        });

        const finisher = updated.find(h => h.position >= FINISH_LINE);
        if (finisher && !winner) {
          setWinner(finisher);
          setIsRacing(false);
          const isPlayer = finisher.id === 0;
          toast[isPlayer ? 'success' : 'info'](
            `${finisher.name} ${isPlayer ? 'remporte la course ! 🏆' : 'a gagné...'}`
          );
        }

        return updated;
      });

      if (!winner) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isRacing, winner, terrain, playerHorse?.speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRacing || winner) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        // Smaller boost, max speed capped lower
        setPlayerHorse(prev => prev ? { ...prev, speed: Math.min(prev.speed + 0.04, 0.85) } : null);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        // Can slow down more
        setPlayerHorse(prev => prev ? { ...prev, speed: Math.max(prev.speed - 0.03, 0.2) } : null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRacing, winner]);

  const startRace = () => {
    initRace();
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          setIsRacing(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetRace = () => {
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
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
          <p className="text-muted-foreground">Course futuriste • Contrôles clavier</p>
        </motion.div>

        {/* View Toggle */}
        <div className="flex justify-center">
          <CyberButton
            variant={is3D ? "primary" : "ghost"}
            icon={Layers}
            onClick={() => setIs3D(!is3D)}
          >
            {is3D ? "Vue 3D" : "Vue 2D"}
          </CyberButton>
        </div>

        <CyberCard className="p-6 space-y-4" glow>
          {/* Race Track */}
          <div 
            className={`relative border-2 border-primary/30 rounded-lg overflow-hidden transition-all duration-500 ${
              is3D ? 'bg-gradient-to-b from-cyber-darker via-cyber-dark to-cyber-darker transform perspective-1000 rotateX-10' : 'bg-cyber-darker'
            }`}
            style={is3D ? { 
              transform: 'perspective(800px) rotateX(15deg)', 
              transformOrigin: 'center bottom',
              minHeight: '450px'
            } : { minHeight: '400px' }}
          >
            {/* Countdown Overlay */}
            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-cyber-dark/80"
                >
                  <span className="text-8xl font-orbitron font-black text-primary text-glow animate-pulse">
                    {countdown}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Finish Line */}
            <div 
              className="absolute top-0 bottom-0 w-2 bg-gradient-to-b from-primary via-accent to-primary z-10"
              style={{ left: `${FINISH_LINE}%` }}
            >
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-primary font-orbitron whitespace-nowrap">
                🏁 ARRIVÉE
              </span>
            </div>

            {/* Terrain Indicators */}
            <div className="absolute top-0 left-0 right-0 h-6 flex opacity-50">
              {terrain.map((obstacle, idx) => (
                <div
                  key={idx}
                  className={`flex-1 border-r border-primary/10 ${
                    obstacle ? 'bg-yellow-500/30' : ''
                  }`}
                  title={obstacle ? 'Zone ralentie' : ''}
                />
              ))}
            </div>

            {/* Race Lanes */}
            <div className="pt-10 pb-4 px-4 space-y-2">
              {horses.map((horse) => (
                <motion.div
                  key={horse.id}
                  className="relative h-14"
                  style={is3D ? { 
                    transform: `translateZ(${horse.lane * -20}px)`,
                    opacity: 1 - (horse.lane * 0.05)
                  } : {}}
                >
                  {/* Lane Line */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-primary/20" />
                  
                  {/* Horse */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 z-10"
                    animate={{ left: `${horse.position}%` }}
                    transition={{ duration: 0.05, ease: "linear" }}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <motion.span 
                        className={`text-3xl drop-shadow-lg ${horse.id === 0 ? 'text-4xl' : ''}`}
                        style={{ 
                          filter: `drop-shadow(0 0 10px ${horse.color})`,
                        }}
                        animate={isRacing && horse.position < FINISH_LINE ? {
                          y: [0, -3, 0],
                          rotate: [0, 5, -5, 0]
                        } : {}}
                        transition={{ duration: 0.3, repeat: Infinity }}
                      >
                        🏇
                      </motion.span>
                      <span 
                        className="text-[10px] font-orbitron whitespace-nowrap px-1 py-0.5 rounded"
                        style={{ 
                          color: horse.color,
                          backgroundColor: 'rgba(0,0,0,0.7)'
                        }}
                      >
                        {horse.id === 0 ? '★ ' : ''}{horse.name}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Winner Banner */}
          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <CyberCard 
                  className="p-6 border-2 border-primary"
                  glow
                >
                  <div className="text-center space-y-3">
                    <Trophy className="h-16 w-16 mx-auto animate-bounce" style={{ color: winner.color }} />
                    <h2 className="text-2xl font-orbitron" style={{ color: winner.color }}>
                      🏆 {winner.name} 🏆
                    </h2>
                    {winner.id === 0 ? (
                      <p className="text-accent font-bold">Félicitations ! Vous avez gagné !</p>
                    ) : (
                      <p className="text-muted-foreground">Votre cheval est arrivé en position {
                        horses.sort((a, b) => b.position - a.position).findIndex(h => h.id === 0) + 1
                      }</p>
                    )}
                  </div>
                </CyberCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex gap-3">
            <CyberButton
              variant="primary"
              icon={Play}
              onClick={startRace}
              disabled={isRacing || countdown !== null}
              fullWidth
            >
              {countdown !== null ? "Préparation..." : isRacing ? "Course en cours..." : "Démarrer"}
            </CyberButton>
            <CyberButton
              variant="ghost"
              icon={RotateCcw}
              onClick={resetRace}
            >
              Reset
            </CyberButton>
          </div>

          {/* Instructions */}
          <CyberCard className="p-4 bg-cyber-darker">
            <div className="space-y-3">
              <h3 className="font-orbitron text-sm text-primary">🎮 Contrôles</h3>
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded">
                  <ArrowRight className="h-5 w-5 text-primary" />
                  <span className="text-primary font-bold">Accélérer</span>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded">
                  <ArrowLeft className="h-5 w-5 text-accent" />
                  <span className="text-accent font-bold">Ralentir</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>Votre cheval : <span className="text-primary font-bold">★ {horses[0]?.name}</span></p>
                <p>⚠️ Les zones jaunes ralentissent les chevaux</p>
                {isRacing && playerHorse && (
                  <p className="text-primary">Vitesse actuelle : {(playerHorse.speed * 100).toFixed(0)}%</p>
                )}
              </div>
            </div>
          </CyberCard>
        </CyberCard>
      </div>
    </div>
  );
};

export default HorseRacing;