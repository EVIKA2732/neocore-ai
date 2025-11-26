import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { board, difficulty } = await req.json();

    // Simple chess AI logic
    // Find all possible moves for AI (simplified)
    const aiMoves = findPossibleMoves(board);
    
    if (aiMoves.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid moves available" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Select best move based on difficulty
    const selectedMove = selectMove(aiMoves, difficulty || 'medium');

    return new Response(
      JSON.stringify({ move: selectedMove }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function findPossibleMoves(board: any[][]): any[] {
  const moves: any[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === 'black') {
        // Find all valid moves for this piece
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(row, col, toRow, toCol, piece, board)) {
              moves.push({
                from: { row, col },
                to: { row: toRow, col: toCol },
                piece: piece.type,
                score: evaluateMove(row, col, toRow, toCol, board)
              });
            }
          }
        }
      }
    }
  }
  
  return moves;
}

function isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number, piece: any, board: any[][]): boolean {
  if (fromRow === toRow && fromCol === toCol) return false;
  
  const target = board[toRow]?.[toCol];
  if (target && target.color === piece.color) return false;

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  switch (piece.type) {
    case 'pawn':
      if (piece.color === 'black') {
        if (colDiff === 0 && toRow === fromRow + 1 && !target) return true;
        if (colDiff === 0 && fromRow === 1 && toRow === 3 && !target && !board[2][fromCol]) return true;
        if (colDiff === 1 && toRow === fromRow + 1 && target) return true;
      }
      return false;

    case 'rook':
      if (rowDiff === 0 || colDiff === 0) {
        return isPathClear(fromRow, fromCol, toRow, toCol, board);
      }
      return false;

    case 'knight':
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

    case 'bishop':
      if (rowDiff === colDiff) {
        return isPathClear(fromRow, fromCol, toRow, toCol, board);
      }
      return false;

    case 'queen':
      if (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) {
        return isPathClear(fromRow, fromCol, toRow, toCol, board);
      }
      return false;

    case 'king':
      return rowDiff <= 1 && colDiff <= 1;

    default:
      return false;
  }
}

function isPathClear(fromRow: number, fromCol: number, toRow: number, toCol: number, board: any[][]): boolean {
  const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
  
  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;
  
  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow]?.[currentCol]) return false;
    currentRow += rowStep;
    currentCol += colStep;
  }
  
  return true;
}

function evaluateMove(fromRow: number, fromCol: number, toRow: number, toCol: number, board: any[][]): number {
  let score = 0;
  
  // Prefer center control
  const centerDistance = Math.abs(toRow - 3.5) + Math.abs(toCol - 3.5);
  score += (7 - centerDistance) * 10;
  
  // Prefer captures
  const target = board[toRow]?.[toCol];
  if (target) {
    const pieceValues: Record<string, number> = {
      pawn: 100,
      knight: 300,
      bishop: 300,
      rook: 500,
      queen: 900,
      king: 10000
    };
    score += pieceValues[target.type] || 0;
  }
  
  return score;
}

function selectMove(moves: any[], difficulty: string): any {
  // Sort moves by score
  moves.sort((a, b) => b.score - a.score);
  
  switch (difficulty) {
    case 'easy':
      // Random move from bottom 50%
      return moves[Math.floor(Math.random() * Math.ceil(moves.length / 2)) + Math.floor(moves.length / 2)];
    
    case 'medium':
      // Random from top 50%
      return moves[Math.floor(Math.random() * Math.ceil(moves.length / 2))];
    
    case 'hard':
      // Best move with slight randomness
      return moves[Math.floor(Math.random() * Math.min(3, moves.length))];
    
    default:
      return moves[0];
  }
}
