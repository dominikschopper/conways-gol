import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Engine } from '@/core/engine/Engine';
import { Board } from '@/core/engine/Board';
import { coord } from '@/core/types/Cell';
import type { BoardConfig } from '@/core/types/Board';

describe('Engine', () => {
  let config: BoardConfig;

  beforeEach(() => {
    config = {
      rows: 20,
      cols: 20,
      wraparound: false
    };
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('State management', () => {
    it('should initialize in stopped state', () => {
      const board = new Board(config);
      const engine = new Engine(board);
      expect(engine.getState()).toBe('stopped');
    });

    it('should start the engine', () => {
      const board = new Board(config);
      const engine = new Engine(board);
      engine.start();
      expect(engine.getState()).toBe('running');
      engine.stop();
    });

    it('should stop the engine', () => {
      const board = new Board(config);
      const engine = new Engine(board);
      engine.start();
      engine.stop();
      expect(engine.getState()).toBe('stopped');
    });

    it('should pause the engine', () => {
      const board = new Board(config);
      const engine = new Engine(board);
      engine.start();
      engine.pause();
      expect(engine.getState()).toBe('paused');
      engine.stop();
    });

    it('should resume from pause', () => {
      const board = new Board(config);
      const engine = new Engine(board);
      engine.start();
      engine.pause();
      engine.start();
      expect(engine.getState()).toBe('running');
      engine.stop();
    });
  });

  describe('Tick callbacks', () => {
    it('should call onTick callback when ticking', () => {
      const board = new Board(config, [coord(5, 5)]);
      const engine = new Engine(board, { tickRate: 100 });
      const callback = vi.fn();

      engine.onTick(callback);
      engine.start();

      vi.advanceTimersByTime(100);
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(callback).toHaveBeenCalledTimes(2);

      engine.stop();
    });

    it('should not call onTick when paused', () => {
      const board = new Board(config, [coord(5, 5)]);
      const engine = new Engine(board, { tickRate: 100 });
      const callback = vi.fn();

      engine.onTick(callback);
      engine.start();
      engine.pause();

      vi.advanceTimersByTime(200);
      expect(callback).toHaveBeenCalledTimes(0);

      engine.stop();
    });

    it('should update tick rate', () => {
      const board = new Board(config, [coord(5, 5)]);
      const engine = new Engine(board, { tickRate: 100 });
      const callback = vi.fn();

      engine.onTick(callback);
      engine.start();

      vi.advanceTimersByTime(100);
      expect(callback).toHaveBeenCalledTimes(1);

      engine.setTickRate(50);
      callback.mockClear();

      vi.advanceTimersByTime(50);
      expect(callback).toHaveBeenCalledTimes(1);

      engine.stop();
    });
  });

  describe('Conway Rules - Blinker pattern', () => {
    it('should oscillate blinker pattern (Period-2)', () => {
      // Horizontal blinker: ---
      const board = new Board(config, [
        coord(5, 4),
        coord(5, 5),
        coord(5, 6)
      ]);
      const engine = new Engine(board);

      // Generation 0: horizontal
      expect(board.isAlive(coord(5, 4))).toBe(true);
      expect(board.isAlive(coord(5, 5))).toBe(true);
      expect(board.isAlive(coord(5, 6))).toBe(true);

      // Step 1: should become vertical
      engine.step();
      expect(board.isAlive(coord(4, 5))).toBe(true);
      expect(board.isAlive(coord(5, 5))).toBe(true);
      expect(board.isAlive(coord(6, 5))).toBe(true);
      expect(board.isAlive(coord(5, 4))).toBe(false);
      expect(board.isAlive(coord(5, 6))).toBe(false);

      // Step 2: should return to horizontal
      engine.step();
      expect(board.isAlive(coord(5, 4))).toBe(true);
      expect(board.isAlive(coord(5, 5))).toBe(true);
      expect(board.isAlive(coord(5, 6))).toBe(true);
      expect(board.isAlive(coord(4, 5))).toBe(false);
      expect(board.isAlive(coord(6, 5))).toBe(false);
    });
  });

  describe('Conway Rules - Glider pattern', () => {
    it('should move glider diagonally', () => {
      // Initial glider pattern
      const board = new Board(config, [
        coord(1, 2),
        coord(2, 3),
        coord(3, 1),
        coord(3, 2),
        coord(3, 3)
      ]);
      const engine = new Engine(board);

      const initialCount = board.livingCellCount;
      expect(initialCount).toBe(5);

      // After 4 steps, glider should have moved
      for (let i = 0; i < 4; i++) {
        engine.step();
      }

      // Should still have 5 cells
      expect(board.livingCellCount).toBe(5);

      // Original top-left cells should be dead (glider moved down-right)
      expect(board.isAlive(coord(1, 2))).toBe(false);
    });
  });

  describe('Conway Rules - Block (Still life)', () => {
    it('should keep block pattern stable', () => {
      // 2x2 block
      const board = new Board(config, [
        coord(5, 5),
        coord(5, 6),
        coord(6, 5),
        coord(6, 6)
      ]);
      const engine = new Engine(board);

      // Step multiple times
      for (let i = 0; i < 10; i++) {
        engine.step();
      }

      // Should remain unchanged
      expect(board.livingCellCount).toBe(4);
      expect(board.isAlive(coord(5, 5))).toBe(true);
      expect(board.isAlive(coord(5, 6))).toBe(true);
      expect(board.isAlive(coord(6, 5))).toBe(true);
      expect(board.isAlive(coord(6, 6))).toBe(true);
    });
  });

  describe('Game rules', () => {
    it('should kill cell with < 2 neighbors (underpopulation)', () => {
      const board = new Board(config, [
        coord(5, 5),
        coord(5, 6)
      ]);
      const engine = new Engine(board);

      engine.step();

      // Both cells should die (each has only 1 neighbor)
      expect(board.livingCellCount).toBe(0);
    });

    it('should keep cell alive with 2 or 3 neighbors', () => {
      const board = new Board(config, [
        coord(5, 5),
        coord(5, 6),
        coord(6, 5)
      ]);
      const engine = new Engine(board);

      engine.step();

      // All three should survive or new cell born
      expect(board.livingCellCount).toBeGreaterThanOrEqual(3);
    });

    it('should kill cell with > 3 neighbors (overpopulation)', () => {
      // Create a cell completely surrounded
      const board = new Board(config, [
        coord(5, 5), // center
        coord(4, 4), coord(4, 5), coord(4, 6),
        coord(5, 4),              coord(5, 6),
        coord(6, 4), coord(6, 5), coord(6, 6)
      ]);
      const engine = new Engine(board);

      engine.step();

      // Center cell should die (8 neighbors > 3)
      expect(board.isAlive(coord(5, 5))).toBe(false);
    });

    it('should birth cell with exactly 3 neighbors', () => {
      const board = new Board(config, [
        coord(5, 5),
        coord(5, 6),
        coord(6, 5)
      ]);
      const engine = new Engine(board);

      engine.step();

      // Cell at (6,6) should be born (has exactly 3 neighbors)
      expect(board.isAlive(coord(6, 6))).toBe(true);
    });
  });

  describe('Wraparound mode - Glider wrapping (Bug fix regression test)', () => {
    it('should wrap glider around edges in torus mode', () => {
      const torusConfig: BoardConfig = {
        rows: 10,
        cols: 10,
        wraparound: true
      };

      // Place glider near right edge pointing right
      const board = new Board(torusConfig, [
        coord(1, 7),
        coord(2, 8),
        coord(3, 6),
        coord(3, 7),
        coord(3, 8)
      ]);
      const engine = new Engine(board);

      // Run for several generations
      for (let i = 0; i < 8; i++) {
        engine.step();
      }

      // Glider should have wrapped around and still be alive
      expect(board.livingCellCount).toBe(5);

      // Should have some cells on the left side (wrapped from right)
      const leftCells = board.getLivingCells().filter(c => c.col <= 3);
      expect(leftCells.length).toBeGreaterThan(0);
    });
  });

  describe('Generation counting', () => {
    it('should increment generation on step', () => {
      // Use a stable pattern so cells survive
      const board = new Board(config, [
        coord(5, 5),
        coord(5, 6),
        coord(6, 5),
        coord(6, 6)
      ]);
      const engine = new Engine(board);

      expect(board.getGeneration()).toBe(0);
      engine.step();
      expect(board.getGeneration()).toBe(1);
      engine.step();
      expect(board.getGeneration()).toBe(2);
    });
  });
});
