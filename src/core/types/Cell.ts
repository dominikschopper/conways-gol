// Coordinate type for cell positions
export type Coordinate = {
  readonly row: number
  readonly col: number
}

// Cell state enum
export const CELL_STATE = {
  DEAD: 'DEAD',
  ALIVE: 'ALIVE',
  DYING: 'DYING',
} as const;

// Cell state type
export type CellState = typeof CELL_STATE[keyof typeof CELL_STATE];

// Helper to create coordinate
export const coord = (row: number, col: number): Coordinate => ({ row, col });

// Coordinate equality
export const coordEquals = (a: Coordinate, b: Coordinate): boolean =>
  a.row === b.row && a.col === b.col;

// Hash coordinate for use in Maps/Sets
export const coordHash = (coord: Coordinate): string => `${coord.row},${coord.col}`;
