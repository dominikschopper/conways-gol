import { describe, it, expect } from 'vitest';
import { NeighborCounter } from '@/core/engine/NeighborCounter';
import { coord } from '@/core/types/Cell';
import type { BoardConfig } from '@/core/types/Board';

describe('NeighborCounter', () => {
  describe('Without wraparound', () => {
    const config: BoardConfig = {
      rows: 10,
      cols: 10,
      wraparound: false
    };
    const counter = new NeighborCounter(config);

    it('should count all 8 neighbors for center cell', () => {
      const isAlive = (c: { row: number; col: number }) =>
        c.row >= 4 && c.row <= 6 && c.col >= 4 && c.col <= 6;

      const count = counter.countLivingNeighbors(coord(5, 5), isAlive);
      expect(count).toBe(8); // All 8 neighbors are alive
    });

    it('should count correct neighbors with mixed alive/dead', () => {
      const aliveCells = new Set(['4,4', '4,5', '5,4']);
      const isAlive = (c: { row: number; col: number }) =>
        aliveCells.has(`${c.row},${c.col}`);

      const count = counter.countLivingNeighbors(coord(5, 5), isAlive);
      expect(count).toBe(3); // (4,4), (4,5), and (5,4) are all neighbors
    });

    it('should handle corner cells without wrapping', () => {
      const isAlive = (c: { row: number; col: number }) =>
        c.row === 0 && c.col === 1;

      // Top-left corner should only check valid neighbors
      const count = counter.countLivingNeighbors(coord(0, 0), isAlive);
      expect(count).toBe(1); // Only (0,1) is a valid neighbor
    });

    it('should handle edge cells correctly', () => {
      const isAlive = (c: { row: number; col: number }) =>
        c.row === 0 && c.col === 5;

      // Top edge cell
      const count = counter.countLivingNeighbors(coord(0, 4), isAlive);
      expect(count).toBe(1);
    });

    it('should return 0 when no neighbors are alive', () => {
      const isAlive = () => false;
      const count = counter.countLivingNeighbors(coord(5, 5), isAlive);
      expect(count).toBe(0);
    });
  });

  describe('With wraparound (Torus) - Bug fix regression test', () => {
    const config: BoardConfig = {
      rows: 10,
      cols: 10,
      wraparound: true
    };
    const counter = new NeighborCounter(config);

    it('should wrap around top edge', () => {
      // Cell at top edge (0,5) with neighbor at bottom edge (9,5)
      const isAlive = (c: { row: number; col: number }) =>
        c.row === 9 && c.col === 5;

      const count = counter.countLivingNeighbors(coord(0, 5), isAlive);
      expect(count).toBe(1); // (9,5) wraps around to be a neighbor of (0,5)
    });

    it('should wrap around bottom edge', () => {
      // Cell at bottom edge (9,5) with neighbor at top edge (0,5)
      const isAlive = (c: { row: number; col: number }) =>
        c.row === 0 && c.col === 5;

      const count = counter.countLivingNeighbors(coord(9, 5), isAlive);
      expect(count).toBe(1); // (0,5) wraps around to be a neighbor of (9,5)
    });

    it('should wrap around left edge', () => {
      // Cell at left edge (5,0) with neighbor at right edge (5,9)
      const isAlive = (c: { row: number; col: number }) =>
        c.row === 5 && c.col === 9;

      const count = counter.countLivingNeighbors(coord(5, 0), isAlive);
      expect(count).toBe(1); // (5,9) wraps around to be a neighbor of (5,0)
    });

    it('should wrap around right edge', () => {
      // Cell at right edge (5,9) with neighbor at left edge (5,0)
      const isAlive = (c: { row: number; col: number }) =>
        c.row === 5 && c.col === 0;

      const count = counter.countLivingNeighbors(coord(5, 9), isAlive);
      expect(count).toBe(1); // (5,0) wraps around to be a neighbor of (5,9)
    });

    it('should wrap around corners correctly', () => {
      // Top-left corner (0,0) with neighbor at bottom-right (9,9)
      const isAlive = (c: { row: number; col: number }) =>
        c.row === 9 && c.col === 9;

      const count = counter.countLivingNeighbors(coord(0, 0), isAlive);
      expect(count).toBe(1); // (9,9) is a diagonal neighbor of (0,0) on torus
    });

    it('should handle negative modulo correctly', () => {
      // This is the critical bug fix: ((n % m) + m) % m handles negative numbers
      // Testing top-left corner with all edge neighbors
      const aliveCells = new Set([
        '9,9', '9,0', '9,1',
        '0,9',        '0,1',
        '1,9', '1,0', '1,1'
      ]);
      const isAlive = (c: { row: number; col: number }) =>
        aliveCells.has(`${c.row},${c.col}`);

      const count = counter.countLivingNeighbors(coord(0, 0), isAlive);
      expect(count).toBe(8); // All 8 neighbors wrap correctly
    });

    it('should still count all 8 neighbors for center cell in torus mode', () => {
      const isAlive = (c: { row: number; col: number }) =>
        c.row >= 4 && c.row <= 6 && c.col >= 4 && c.col <= 6;

      const count = counter.countLivingNeighbors(coord(5, 5), isAlive);
      expect(count).toBe(8);
    });
  });

  describe('Edge cases', () => {
    it('should handle 1x1 board with wraparound', () => {
      const config: BoardConfig = {
        rows: 1,
        cols: 1,
        wraparound: true
      };
      const counter = new NeighborCounter(config);
      const isAlive = (c: { row: number; col: number }) =>
        c.row === 0 && c.col === 0;

      // On a 1x1 torus, all neighbors wrap to the same cell
      const count = counter.countLivingNeighbors(coord(0, 0), isAlive);
      expect(count).toBe(8); // All 8 neighbor positions wrap to (0,0)
    });

    it('should handle large coordinates with wraparound', () => {
      const config: BoardConfig = {
        rows: 100,
        cols: 100,
        wraparound: true
      };
      const counter = new NeighborCounter(config);
      const isAlive = (c: { row: number; col: number }) =>
        c.row === 99 && c.col === 0;

      const count = counter.countLivingNeighbors(coord(0, 99), isAlive);
      expect(count).toBe(1); // Diagonal wrapping on larger board
    });
  });
});
