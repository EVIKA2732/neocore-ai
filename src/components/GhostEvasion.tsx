import { useState, useEffect, useCallback } from 'react';
import { CyberCard } from './CyberCard';
import { CyberButton } from './CyberButton';
import { Play, RotateCcw } from 'lucide-react';

type Position = { x: number; y: number };

const GRID_SIZE = 15;
const CELL_SIZE = 20;
const GAME_SPEED = 200;
const NUM_GHOSTS = 3;

export const GhostEvasion = () => {
  const [player, setPlayer] = useState<Position>({ x: 7, y: 7 });
  const [ghosts, setGhosts] = useState<Position[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);

  const generateGhosts = useCallback((count: number = NUM_GHOSTS + level - 1) => {
    const newGhosts: Position[] = [];
    for (let i = 0; i < count; i++) {
      newGhosts.push({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
    }
    return newGhosts;
  }, [level]);

  const resetGame = () => {
    setPlayer({ x: 7, y: 7 });
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setGhosts(generateGhosts());
  };

  const moveGhosts = useCallback(() => {
    if (!isPlaying || gameOver) return;

    setGhosts(prevGhosts => {
      const newGhosts = prevGhosts.map(ghost => {
        const newGhost = { ...ghost };
        const dx = player.x - ghost.x;
        const dy = player.y - ghost.y;
        
        if (Math.abs(dx) > Math.abs(dy)) {
          newGhost.x += dx > 0 ? 1 : -1;
        } else if (Math.abs(dy) > 0) {
          newGhost.y += dy > 0 ? 1 : -1;
        }

        newGhost.x = Math.max(0, Math.min(GRID_SIZE - 1, newGhost.x));
        newGhost.y = Math.max(0, Math.min(GRID_SIZE - 1, newGhost.y));
        return newGhost;
      });

      if (newGhosts.some(g => g.x === player.x && g.y === player.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevGhosts;
      }

      setScore(prev => prev + 1);
      
      if ((score + 1) % 100 === 0) {
        setLevel(prev => prev + 1);
        return [...newGhosts, generateGhosts(1)[0]];
      }

      return newGhosts;
    });
  }, [player, isPlaying, gameOver, score, generateGhosts]);

  const [pendingMove, setPendingMove] = useState<string | null>(null);
  const [lastMoveTime, setLastMoveTime] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      
      const now = Date.now();
      if (now - lastMoveTime < 50) {
        setPendingMove(e.key);
        return;
      }

      const newPlayer = { ...player };

      switch (e.key) {
        case 'ArrowUp':
        case 'z':
          newPlayer.y = Math.max(0, player.y - 1);
          break;
        case 'ArrowDown':
        case 's':
          newPlayer.y = Math.min(GRID_SIZE - 1, player.y + 1);
          break;
        case 'ArrowLeft':
        case 'q':
          newPlayer.x = Math.max(0, player.x - 1);
          break;
        case 'ArrowRight':
        case 'd':
          newPlayer.x = Math.min(GRID_SIZE - 1, player.x + 1);
          break;
        default:
          return;
      }

      setPlayer(newPlayer);
      setLastMoveTime(now);
      setPendingMove(null);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [player, isPlaying, gameOver, lastMoveTime]);

  useEffect(() => {
    if (pendingMove && Date.now() - lastMoveTime >= 50) {
      const event = new KeyboardEvent('keydown', { key: pendingMove });
      window.dispatchEvent(event);
    }
  }, [pendingMove, lastMoveTime]);

  useEffect(() => {
    if (!isPlaying) return;
    const gameLoop = setInterval(moveGhosts, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [isPlaying, moveGhosts]);

  useEffect(() => {
    setGhosts(generateGhosts());
  }, []);

  return (
    <CyberCard className="p-6 space-y-4" glow>
      <div className="flex items-center justify-between">
        <h3 className="font-orbitron text-xl text-primary">Évasion Fantômes</h3>
        <div className="flex gap-4 text-primary font-orbitron text-sm">
          <span>Score: {score}</span>
          <span>Niveau: {level}</span>
        </div>
      </div>

      <div 
        className="relative bg-cyber-darker border-2 border-primary/30 mx-auto"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-px bg-primary/5" style={{ top: i * CELL_SIZE }} />
        ))}
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-px bg-primary/5" style={{ left: i * CELL_SIZE }} />
        ))}

        <div
          className="absolute bg-primary rounded-full neon-glow-strong transition-all duration-100"
          style={{
            left: player.x * CELL_SIZE + 2,
            top: player.y * CELL_SIZE + 2,
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
          }}
        />

        {ghosts.map((ghost, i) => (
          <div
            key={i}
            className="absolute bg-accent rounded-full animate-pulse-glow transition-all duration-200"
            style={{
              left: ghost.x * CELL_SIZE + 2,
              top: ghost.y * CELL_SIZE + 2,
              width: CELL_SIZE - 4,
              height: CELL_SIZE - 4,
            }}
          />
        ))}

        {gameOver && (
          <div className="absolute inset-0 bg-cyber-dark/90 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-orbitron text-primary mb-2">Game Over</p>
              <p className="text-accent">Score: {score}</p>
              <p className="text-secondary text-sm">Niveau: {level}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <CyberButton variant="primary" icon={Play} onClick={() => { if (gameOver) resetGame(); setIsPlaying(true); }} fullWidth>
          {isPlaying ? 'En cours...' : 'Démarrer'}
        </CyberButton>
        <CyberButton variant="accent" icon={RotateCcw} onClick={resetGame}>Reset</CyberButton>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Flèches ou ZQSD - Les fantômes vous poursuivent toujours !
      </p>
    </CyberCard>
  );
};
