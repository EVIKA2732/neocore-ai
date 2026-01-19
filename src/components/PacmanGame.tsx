import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { CyberCard } from "./CyberCard";
import { CyberButton } from "./CyberButton";
import { Play, RotateCcw, Trophy } from "lucide-react";

const GRID_SIZE = 15;
const CELL_SIZE = 28;

interface Position {
  x: number;
  y: number;
}

interface Ghost {
  pos: Position;
  direction: Position;
  color: string;
}

export const PacmanGame = () => {
  const [pacman, setPacman] = useState<Position>({ x: 7, y: 7 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [ghosts, setGhosts] = useState<Ghost[]>([
    { pos: { x: 1, y: 1 }, direction: { x: 1, y: 0 }, color: "#ff0000" },
    { pos: { x: 13, y: 1 }, direction: { x: -1, y: 0 }, color: "#00ffff" },
    { pos: { x: 1, y: 13 }, direction: { x: 0, y: -1 }, color: "#ff69b4" },
    { pos: { x: 13, y: 13 }, direction: { x: 0, y: 1 }, color: "#ffa500" },
  ]);
  const [dots, setDots] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!(x === 7 && y === 7)) initial.add(`${x},${y}`);
      }
    }
    return initial;
  });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("neocore_pacman_high") || "0");
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(true);
  const gameLoopRef = useRef<number>();

  const resetGame = useCallback(() => {
    setPacman({ x: 7, y: 7 });
    setDirection({ x: 0, y: 0 });
    setGhosts([
      { pos: { x: 1, y: 1 }, direction: { x: 1, y: 0 }, color: "#ff0000" },
      { pos: { x: 13, y: 1 }, direction: { x: -1, y: 0 }, color: "#00ffff" },
      { pos: { x: 1, y: 13 }, direction: { x: 0, y: -1 }, color: "#ff69b4" },
      { pos: { x: 13, y: 13 }, direction: { x: 0, y: 1 }, color: "#ffa500" },
    ]);
    const newDots = new Set<string>();
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!(x === 7 && y === 7)) newDots.add(`${x},${y}`);
      }
    }
    setDots(newDots);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      
      switch (e.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = () => {
      // Move Pacman
      setPacman(prev => {
        const newX = Math.max(0, Math.min(GRID_SIZE - 1, prev.x + direction.x));
        const newY = Math.max(0, Math.min(GRID_SIZE - 1, prev.y + direction.y));
        return { x: newX, y: newY };
      });

      // Animate mouth
      setMouthOpen(prev => !prev);

      // Move ghosts with improved AI
      setGhosts(prevGhosts => 
        prevGhosts.map(ghost => {
          let newDir = { ...ghost.direction };
          
          // 30% chance to change direction towards pacman
          if (Math.random() < 0.3) {
            const dx = pacman.x - ghost.pos.x;
            const dy = pacman.y - ghost.pos.y;
            
            if (Math.abs(dx) > Math.abs(dy)) {
              newDir = { x: dx > 0 ? 1 : -1, y: 0 };
            } else {
              newDir = { x: 0, y: dy > 0 ? 1 : -1 };
            }
          }
          
          // Random direction change at walls
          let newX = ghost.pos.x + newDir.x;
          let newY = ghost.pos.y + newDir.y;
          
          if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
            const directions = [
              { x: 1, y: 0 },
              { x: -1, y: 0 },
              { x: 0, y: 1 },
              { x: 0, y: -1 }
            ];
            newDir = directions[Math.floor(Math.random() * directions.length)];
            newX = Math.max(0, Math.min(GRID_SIZE - 1, ghost.pos.x + newDir.x));
            newY = Math.max(0, Math.min(GRID_SIZE - 1, ghost.pos.y + newDir.y));
          }

          return {
            ...ghost,
            pos: { x: newX, y: newY },
            direction: newDir
          };
        })
      );
    };

    gameLoopRef.current = window.setInterval(gameLoop, 200);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, direction, pacman]);

  // Check collisions and dots
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    // Eat dot
    const dotKey = `${pacman.x},${pacman.y}`;
    if (dots.has(dotKey)) {
      setDots(prev => {
        const newDots = new Set(prev);
        newDots.delete(dotKey);
        return newDots;
      });
      setScore(prev => prev + 10);
    }

    // Check ghost collision
    const collision = ghosts.some(
      ghost => ghost.pos.x === pacman.x && ghost.pos.y === pacman.y
    );

    if (collision) {
      setGameOver(true);
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("neocore_pacman_high", score.toString());
      }
    }

    // Win condition
    if (dots.size === 0) {
      setGameOver(true);
      setIsPlaying(false);
      const finalScore = score + 1000;
      setScore(finalScore);
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem("neocore_pacman_high", finalScore.toString());
      }
    }
  }, [pacman, ghosts, dots, isPlaying, gameOver, score, highScore]);

  return (
    <CyberCard className="p-6" glow>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-orbitron text-xl text-primary">PACMAN CYBER</h3>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Score: </span>
            <span className="text-primary font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400">{highScore}</span>
          </div>
        </div>
      </div>

      <div 
        className="relative mx-auto bg-cyber-darker rounded-lg overflow-hidden border border-primary/30"
        style={{ 
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(GRID_SIZE)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full h-px bg-primary"
              style={{ top: i * CELL_SIZE }}
            />
          ))}
          {[...Array(GRID_SIZE)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full w-px bg-primary"
              style={{ left: i * CELL_SIZE }}
            />
          ))}
        </div>

        {/* Dots */}
        {Array.from(dots).map(key => {
          const [x, y] = key.split(",").map(Number);
          return (
            <motion.div
              key={key}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                left: x * CELL_SIZE + CELL_SIZE / 2 - 4,
                top: y * CELL_SIZE + CELL_SIZE / 2 - 4,
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          );
        })}

        {/* Pacman */}
        <motion.div
          className="absolute"
          style={{
            left: pacman.x * CELL_SIZE,
            top: pacman.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
          animate={{
            rotate: direction.x === 1 ? 0 : direction.x === -1 ? 180 : direction.y === 1 ? 90 : direction.y === -1 ? -90 : 0
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.path
              d={mouthOpen 
                ? "M50 10 A40 40 0 1 1 50 90 A40 40 0 1 1 50 10 L50 50 Z M50 50 L85 30 L85 70 Z"
                : "M50 10 A40 40 0 1 1 50 90 A40 40 0 1 1 50 10"
              }
              fill="#FFD700"
              className="drop-shadow-lg"
            />
          </svg>
        </motion.div>

        {/* Ghosts */}
        {ghosts.map((ghost, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: ghost.pos.x * CELL_SIZE,
              top: ghost.pos.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M50 10 C20 10 10 40 10 60 L10 90 L25 75 L40 90 L55 75 L70 90 L85 75 L90 90 L90 60 C90 40 80 10 50 10 Z"
                fill={ghost.color}
                className="drop-shadow-lg"
              />
              <circle cx="35" cy="45" r="10" fill="white" />
              <circle cx="65" cy="45" r="10" fill="white" />
              <circle cx="38" cy="45" r="5" fill="#00d4ff" />
              <circle cx="68" cy="45" r="5" fill="#00d4ff" />
            </svg>
          </motion.div>
        ))}

        {/* Game Over / Start Overlay */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <p className="text-2xl font-orbitron text-primary mb-4">
              {gameOver ? (dots.size === 0 ? "VICTOIRE!" : "GAME OVER") : "PACMAN CYBER"}
            </p>
            {gameOver && (
              <p className="text-lg text-primary mb-4">Score: {score}</p>
            )}
            <CyberButton
              variant="primary"
              icon={gameOver ? RotateCcw : Play}
              onClick={resetGame}
            >
              {gameOver ? "Rejouer" : "Jouer"}
            </CyberButton>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Utilisez les flèches directionnelles pour déplacer Pacman</p>
      </div>
    </CyberCard>
  );
};
