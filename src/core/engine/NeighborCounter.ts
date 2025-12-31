import type { Coordinate } from '../types/Cell';
import type { BoardConfig } from '../types/Board';
import { coord } from '../types/Cell';

/**
 * Efficient neighbor counting with optional wraparound support
 */
export class NeighborCounter {
  constructor(private config: BoardConfig) {}

  /**
   * Get all neighbor coordinates for a given position
   * Handles wraparound if enabled (torus topology)
   */
  getNeighborCoordinates(coordinate: Coordinate): Coordinate[] {
    const neighbors: Coordinate[] = [];
    const { row, col } = coordinate;
    const { rows, cols, wraparound } = this.config;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;

        let newRow = row + dr;
        let newCol = col + dc;

        if (wraparound) {
          // Torus topology: wrap around edges
          // Use ((n % m) + m) % m to handle negative numbers correctly
          newRow = ((newRow % rows) + rows) % rows;
          newCol = ((newCol % cols) + cols) % cols;
        } else {
          // Skip out-of-bounds neighbors
          if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
            continue;
          }
        }

        neighbors.push(coord(newRow, newCol));
      }
    }

    return neighbors;
  }

  /**
   * Count living neighbors for a cell
   */
  countLivingNeighbors(
    coordinate: Coordinate,
    isAliveCheck: (coord: Coordinate) => boolean
  ): number {
    let count = 0;
    for (const neighbor of this.getNeighborCoordinates(coordinate)) {
      if (isAliveCheck(neighbor)) count++;
    }
    return count;
  }
}
