import type { Coordinate } from '../types/Cell';
import type { PatternDefinition } from '../types/Pattern';
import { coord } from '../types/Cell';
import type { Board } from '../engine/Board';

/**
 * Pattern class for defining and placing cell patterns
 */
export class Pattern {
  constructor(private definition: PatternDefinition) {}

  getName(): string {
    return this.definition.name;
  }

  getDescription(): string {
    return this.definition.description;
  }

  getCells(): readonly Coordinate[] {
    return this.definition.cells;
  }

  getWidth(): number {
    return this.definition.width;
  }

  getHeight(): number {
    return this.definition.height;
  }

  /**
   * Place pattern on board at specified position
   * Position refers to top-left corner of pattern bounding box
   */
  placeOnBoard(board: Board, position: Coordinate): void {
    const { row, col } = position;

    for (const cell of this.definition.cells) {
      const absolutePos = coord(row + cell.row, col + cell.col);
      board.setAlive(absolutePos);
    }
  }

  /**
   * Get pattern cells at absolute position
   */
  getCellsAtPosition(position: Coordinate): Coordinate[] {
    const { row, col } = position;
    return this.definition.cells.map(cell =>
      coord(row + cell.row, col + cell.col)
    );
  }
}
