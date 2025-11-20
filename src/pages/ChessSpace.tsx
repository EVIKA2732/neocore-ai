import { useState } from "react";
import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Swords, RotateCcw, Zap } from "lucide-react";
import { toast } from "sonner";

type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | null;
type PieceColor = 'white' | 'black' | null;

interface Piece {
  type: PieceType;
  color: PieceColor;
}

const PIECE_SYMBOLS: Record<string, string> = {
  'white-pawn': '♙',
  'white-rook': '♖',
  'white-knight': '♘',
  'white-bishop': '♗',
  'white-queen': '♕',
  'white-king': '♔',
  'black-pawn': '♟',
  'black-rook': '♜',
  'black-knight': '♞',
  'black-bishop': '♝',
  'black-queen': '♛',
  'black-king': '♚',
};

const initialBoard = (): (Piece | null)[][] => {
  const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Pièces noires
  board[0] = [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' },
  ];
  board[1] = Array(8).fill({ type: 'pawn', color: 'black' });
  
  // Pièces blanches
  board[6] = Array(8).fill({ type: 'pawn', color: 'white' });
  board[7] = [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' },
  ];
  
  return board;
};

const ChessSpace = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard());
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  const resetGame = () => {
    setBoard(initialBoard());
    setSelectedSquare(null);
    setCurrentPlayer('white');
    setMoveHistory([]);
    toast.success("Nouvelle partie initialisée", { className: "neon-glow" });
  };

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, piece: Piece): boolean => {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    const targetPiece = board[toRow][toCol];
    
    // Ne peut pas capturer sa propre pièce
    if (targetPiece && targetPiece.color === piece.color) return false;
    
    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        // Avancer d'une case
        if (colDiff === 0 && toRow === fromRow + direction && !targetPiece) return true;
        
        // Avancer de deux cases depuis position initiale
        if (colDiff === 0 && fromRow === startRow && toRow === fromRow + 2 * direction && !targetPiece && !board[fromRow + direction][fromCol]) return true;
        
        // Capturer en diagonale
        if (colDiff === 1 && toRow === fromRow + direction && targetPiece) return true;
        
        return false;
        
      case 'rook':
        return (rowDiff === 0 || colDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol);
        
      case 'knight':
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
        
      case 'bishop':
        return rowDiff === colDiff && isPathClear(fromRow, fromCol, toRow, toCol);
        
      case 'queen':
        return (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol);
        
      case 'king':
        return rowDiff <= 1 && colDiff <= 1;
        
      default:
        return false;
    }
  };
  
  const isPathClear = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol]) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return true;
  };

  const handleSquareClick = (row: number, col: number) => {
    const piece = board[row][col];
    
    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare;
      const fromPiece = board[fromRow][fromCol];
      
      if (fromPiece && fromPiece.color === currentPlayer) {
        // Validation stricte FIDE
        if (!isValidMove(fromRow, fromCol, row, col, fromPiece)) {
          toast.error("Mouvement illégal selon les règles FIDE", { className: "neon-glow" });
          setSelectedSquare(null);
          return;
        }
        
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = fromPiece;
        newBoard[fromRow][fromCol] = null;
        
        setBoard(newBoard);
        setSelectedSquare(null);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        
        const move = `${String.fromCharCode(97 + fromCol)}${8 - fromRow} → ${String.fromCharCode(97 + col)}${8 - row}`;
        setMoveHistory([...moveHistory, move]);
        
        toast.success("Coup joué ✓", { className: "neon-glow" });
      }
    } else if (piece && piece.color === currentPlayer) {
      setSelectedSquare([row, col]);
    }
  };

  const isSelected = (row: number, col: number) => {
    return selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
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
            <Swords className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              CHESS OF SPACE
            </h1>
          </div>
          <p className="text-muted-foreground">Échecs spatiaux quantiques</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <CyberCard className="p-6" glow>
              <div className="flex items-center justify-between mb-4">
                <div className="text-primary font-orbitron">
                  Joueur: <span className={currentPlayer === 'white' ? 'text-blue-400' : 'text-purple-400'}>
                    {currentPlayer === 'white' ? 'Blanc' : 'Noir'}
                  </span>
                </div>
                <CyberButton variant="ghost" icon={RotateCcw} onClick={resetGame}>
                  Nouvelle Partie
                </CyberButton>
              </div>

              <div className="grid grid-cols-8 gap-0 border-2 border-primary/30 w-fit mx-auto">
                {board.map((row, rowIndex) => (
                  row.map((piece, colIndex) => {
                    const isLight = (rowIndex + colIndex) % 2 === 0;
                    const selected = isSelected(rowIndex, colIndex);
                    
                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        className={`
                          w-16 h-16 flex items-center justify-center text-4xl
                          transition-all duration-200 relative
                          ${isLight ? 'bg-primary/10' : 'bg-cyber-darker'}
                          ${selected ? 'ring-2 ring-primary neon-glow' : ''}
                          hover:bg-primary/20
                        `}
                      >
                        {piece && (
                          <span className={`
                            ${piece.color === 'white' ? 'text-blue-400' : 'text-purple-400'}
                            drop-shadow-[0_0_10px_currentColor]
                          `}>
                            {PIECE_SYMBOLS[`${piece.color}-${piece.type}`]}
                          </span>
                        )}
                        
                        {rowIndex === 7 && (
                          <span className="absolute bottom-1 right-1 text-[8px] text-primary/50">
                            {String.fromCharCode(97 + colIndex)}
                          </span>
                        )}
                        {colIndex === 0 && (
                          <span className="absolute top-1 left-1 text-[8px] text-primary/50">
                            {8 - rowIndex}
                          </span>
                        )}
                      </button>
                    );
                  })
                ))}
              </div>
            </CyberCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <CyberCard className="p-6" glow>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-orbitron text-lg text-primary">Historique</h3>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {moveHistory.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucun coup joué</p>
                ) : (
                  moveHistory.map((move, index) => (
                    <div
                      key={index}
                      className="bg-cyber-darker p-2 rounded border border-primary/20 text-sm font-mono text-primary"
                    >
                      {index + 1}. {move}
                    </div>
                  ))
                )}
              </div>
            </CyberCard>

            <CyberCard className="p-6" glow>
              <h3 className="font-orbitron text-lg text-primary mb-4">Instructions</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Cliquez sur une pièce pour la sélectionner</p>
                <p>• Cliquez sur une case pour déplacer</p>
                <p>• Version simplifiée sans règles strictes</p>
                <p>• IA à venir dans version future</p>
              </div>
            </CyberCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChessSpace;
