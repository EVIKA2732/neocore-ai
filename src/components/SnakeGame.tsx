import { useState, useEffect, useCallback } from 'react';
import { CyberCard } from './CyberCard';
import { CyberButton } from './CyberButton';
import { Play, RotateCcw } from 'lucide-react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 100; // Plus rapide et fluide

export const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    let attempts = 0;
    
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      attempts++;
    } while (
      attempts < 100 &&
      currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    );
    
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    generateFood(INITIAL_SNAKE);
  };

  const checkCollision = (head: Position) => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  };

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      if (checkCollision(head)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        generateFood(newSnake);
        return newSnake; // Keep all segments when eating
      } else {
        newSnake.pop();
        return newSnake;
      }
    });
  }, [direction, food, isPlaying, gameOver, generateFood, checkCollision]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, direction]);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [isPlaying, moveSnake]);

  return (
    <CyberCard className="p-6 space-y-4" glow>
      <div className="flex items-center justify-between">
        <h3 className="font-orbitron text-xl text-primary">Snake Futuriste</h3>
        <div className="text-primary font-orbitron">Score: {score}</div>
      </div>

      <div 
        className="relative bg-cyber-darker border-2 border-primary/30 mx-auto"
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE 
        }}
      >
        {/* Grid */}
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <div key={i} className="absolute w-full h-px bg-primary/5" style={{ top: i * CELL_SIZE }} />
        ))}
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <div key={i} className="absolute h-full w-px bg-primary/5" style={{ left: i * CELL_SIZE }} />
        ))}

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-primary rounded-sm neon-glow"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              opacity: i === 0 ? 1 : 0.7,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-accent rounded-full animate-pulse-glow"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
          }}
        />

        {/* Game Over */}
        {gameOver && (
          <div className="absolute inset-0 bg-cyber-dark/90 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-orbitron text-primary mb-2">Game Over</p>
              <p className="text-accent">Score: {score}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <CyberButton
          variant="primary"
          icon={Play}
          onClick={() => {
            if (gameOver) resetGame();
            setIsPlaying(true);
          }}
          fullWidth
        >
          {isPlaying ? 'En cours...' : 'Démarrer'}
        </CyberButton>
        <CyberButton
          variant="accent"
          icon={RotateCcw}
          onClick={resetGame}
        >
          Reset
        </CyberButton>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Utilisez les flèches pour diriger le serpent
      </p>
    </CyberCard>
  );
};
