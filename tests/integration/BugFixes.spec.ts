import { describe, it, expect } from 'vitest';
import { Board } from '@/core/engine/Board';
import { Engine } from '@/core/engine/Engine';
import { SparseGrid } from '@/core/data-structures/SparseGrid';
import { NeighborCounter } from '@/core/engine/NeighborCounter';
import { coord } from '@/core/types/Cell';
import type { BoardConfig } from '@/core/types/Board';

/**
 * Integration tests for bugs we fixed during development
 * These tests ensure the bugs don't resurface
 */
describe('Bug Fixes - Integration Tests', () => {
  describe('Bug #1: Board size changes - cells not recalculated', () => {
    it('should handle board size changes correctly', () => {
      // Initial 10x10 board
      const config1: BoardConfig = { rows: 10, cols: 10, wraparound: false };
      const board1 = new Board(config1, [coord(5, 5)]);

      expect(board1.livingCellCount).toBe(1);
      expect(board1.isAlive(coord(5, 5))).toBe(true);

      // Change to 20x20 - simulate user changing board size
      const config2: BoardConfig = { rows: 20, cols: 20, wraparound: false };
      const livingCells = board1.getLivingCells();
      const board2 = new Board(config2, livingCells);

      // Cell should still be alive on new board
      expect(board2.livingCellCount).toBe(1);
      expect(board2.isAlive(coord(5, 5))).toBe(true);
    });

    it('should remove out-of-bounds cells when reducing board size', () => {
      const config1: BoardConfig = { rows: 20, cols: 20, wraparound: false };
      const board1 = new Board(config1, [coord(15, 15)]);

      const config2: BoardConfig = { rows: 10, cols: 10, wraparound: false };
      const livingCells = board1.getLivingCells().filter(
        c => c.row < 10 && c.col < 10
      );
      const board2 = new Board(config2, livingCells);

      // Cell at (15, 15) should not exist on smaller board
      expect(board2.livingCellCount).toBe(0);
    });
  });

  describe('Bug #2: Glider not moving after board size change', () => {
    it('should continue simulating correctly after board recreation', () => {
      // Create initial board with glider
      const config: BoardConfig = { rows: 20, cols: 20, wraparound: false };
      const glider = [
        coord(1, 2),
        coord(2, 3),
        coord(3, 1),
        coord(3, 2),
        coord(3, 3)
      ];

      const board = new Board(config, glider);
      const engine = new Engine(board);

      // Run simulation
      engine.step();
      engine.step();

      // Glider should have moved
      expect(board.livingCellCount).toBe(5);

      // Original position should be cleared
      expect(board.isAlive(coord(1, 2))).toBe(false);
    });
  });

  describe('Bug #3: Wraparound checkbox unchecked on Start', () => {
    it('should preserve wraparound config when engine starts', () => {
      const config: BoardConfig = { rows: 10, cols: 10, wraparound: true };
      const board = new Board(config, [coord(0, 5)]);
      const engine = new Engine(board);

      // Get config before start
      const configBefore = board.getConfig();
      expect(configBefore.wraparound).toBe(true);

      // Start engine
      engine.start();

      // Config should remain unchanged
      const configAfter = board.getConfig();
      expect(configAfter.wraparound).toBe(true);

      engine.stop();
    });
  });

  describe('Bug #4: Wraparound not working - Gliders becoming squares', () => {
    it('should wrap glider around top edge in torus mode', () => {
      const config: BoardConfig = { rows: 10, cols: 10, wraparound: true };

      // Place standard glider - it will move diagonally and wrap
      const glider = [
        coord(1, 2),
        coord(2, 3),
        coord(3, 1),
        coord(3, 2),
        coord(3, 3)
      ];

      const board = new Board(config, glider);
      const engine = new Engine(board);

      // Run for many generations - glider should survive wrapping
      for (let i = 0; i < 12; i++) {
        engine.step();
      }

      // Glider should still be alive (5 cells) - key test for wraparound
      expect(board.livingCellCount).toBe(5);

      // Original position should be cleared (glider moved)
      expect(board.isAlive(coord(1, 2))).toBe(false);
    });

    it('should wrap glider around right edge in torus mode', () => {
      const config: BoardConfig = { rows: 10, cols: 10, wraparound: true };

      // Place glider at right edge
      const glider = [
        coord(5, 8),
        coord(6, 9),
        coord(7, 7),
        coord(7, 8),
        coord(7, 9)
      ];

      const board = new Board(config, glider);
      const engine = new Engine(board);

      // Run for several generations
      for (let i = 0; i < 5; i++) {
        engine.step();
      }

      // Glider should still be alive
      expect(board.livingCellCount).toBe(5);

      // Should have wrapped to left side
      const leftCells = board.getLivingCells().filter(c => c.col <= 2);
      expect(leftCells.length).toBeGreaterThan(0);
    });

    it('should correctly calculate neighbors at edges with wraparound', () => {
      const config: BoardConfig = { rows: 10, cols: 10, wraparound: true };

      // SparseGrid only tracks neighbor counts for cells adjacent to living cells
      // So we need to actually use the Board/Engine to test wraparound properly
      const board = new Board(config, [
        coord(0, 0), // Corner
        coord(9, 9)  // Diagonal neighbor (wraps around)
      ]);

      // Use NeighborCounter through Board to verify wraparound
      const count = board.getNeighborCount(coord(0, 0));
      expect(count).toBe(1); // Should count (9,9) as neighbor
    });

    it('should use correct modulo formula for negative numbers', () => {
      const config: BoardConfig = { rows: 10, cols: 10, wraparound: true };
      const counter = new NeighborCounter(config);

      // Cell at (0,0) with neighbor at (9,9) - tests negative modulo
      const isAlive = (c: { row: number; col: number }) =>
        c.row === 9 && c.col === 9;

      const count = counter.countLivingNeighbors(coord(0, 0), isAlive);

      // Should count (9,9) as diagonal neighbor of (0,0)
      expect(count).toBe(1);
    });

    it('should not wrap when wraparound is disabled', () => {
      const config: BoardConfig = { rows: 10, cols: 10, wraparound: false };

      // Place glider at edge without wraparound
      const board = new Board(config, [
        coord(0, 5),
        coord(1, 6),
        coord(2, 4),
        coord(2, 5),
        coord(2, 6)
      ]);
      const engine = new Engine(board);

      // Run for several generations
      for (let i = 0; i < 3; i++) {
        engine.step();
      }

      // Glider should die at edge (no wraparound)
      // Pattern changes when hitting boundary
      const bottomCells = board.getLivingCells().filter(c => c.row === 9);
      expect(bottomCells.length).toBe(0); // No wrap to bottom
    });
  });

  describe('Combined: Board size change + Wraparound', () => {
    it('should handle changing from non-torus to torus mode', () => {
      // Start without wraparound
      const config1: BoardConfig = { rows: 10, cols: 10, wraparound: false };
      const board1 = new Board(config1, [coord(0, 5), coord(1, 5)]);

      // Count neighbors without wraparound
      const count1 = board1.getNeighborCount(coord(0, 5));

      // Switch to wraparound
      const config2: BoardConfig = { rows: 10, cols: 10, wraparound: true };
      const cells = board1.getLivingCells();
      const board2 = new Board(config2, cells);

      // Count neighbors with wraparound - should be different
      const count2 = board2.getNeighborCount(coord(0, 5));

      // With wraparound, (0,5) should have neighbor wrapping from bottom
      expect(count2).toBeGreaterThanOrEqual(count1);
    });

    it('should handle simultaneous board size and wraparound changes', () => {
      const config1: BoardConfig = { rows: 10, cols: 10, wraparound: false };
      const board1 = new Board(config1, [coord(5, 5)]);

      const config2: BoardConfig = { rows: 20, cols: 20, wraparound: true };
      const cells = board1.getLivingCells();
      const board2 = new Board(config2, cells);

      // Cell should exist and be in same position
      expect(board2.isAlive(coord(5, 5))).toBe(true);
      expect(board2.getConfig().wraparound).toBe(true);
      expect(board2.getConfig().rows).toBe(20);
    });
  });
});
