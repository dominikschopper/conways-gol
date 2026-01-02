import { describe, it, expect } from 'vitest';
import { Board } from '@/core/engine/Board';
import { coord } from '@/core/types/Cell';
import type { BoardConfig } from '@/core/types/Board';

describe('Board', () => {
  const config: BoardConfig = {
    rows: 10,
    cols: 10,
    wraparound: false
  };

  describe('Basic operations', () => {
    it('should create an empty board', () => {
      const board = new Board(config);
      expect(board.livingCellCount).toBe(0);
      expect(board.getGeneration()).toBe(0);
    });

    it('should create a board with initial cells', () => {
      const cells = [coord(0, 0), coord(1, 1)];
      const board = new Board(config, cells);
      expect(board.livingCellCount).toBe(2);
      expect(board.isAlive(coord(0, 0))).toBe(true);
      expect(board.isAlive(coord(1, 1))).toBe(true);
    });

    it('should set cells alive', () => {
      const board = new Board(config);
      board.setAlive(coord(5, 5));
      expect(board.isAlive(coord(5, 5))).toBe(true);
      expect(board.livingCellCount).toBe(1);
    });

    it('should set cells dead', () => {
      const board = new Board(config, [coord(5, 5)]);
      board.setDead(coord(5, 5));
      expect(board.isAlive(coord(5, 5))).toBe(false);
      expect(board.livingCellCount).toBe(0);
    });

    it('should toggle cells', () => {
      const board = new Board(config);
      board.toggle(coord(5, 5));
      expect(board.isAlive(coord(5, 5))).toBe(true);
      board.toggle(coord(5, 5));
      expect(board.isAlive(coord(5, 5))).toBe(false);
    });

    it('should clear all cells', () => {
      const board = new Board(config, [coord(0, 0), coord(1, 1)]);
      board.clear();
      expect(board.livingCellCount).toBe(0);
      expect(board.getGeneration()).toBe(0);
    });

    it('should get living cells', () => {
      const cells = [coord(0, 0), coord(1, 1), coord(2, 2)];
      const board = new Board(config, cells);
      const livingCells = board.getLivingCells();
      expect(livingCells).toHaveLength(3);
    });
  });

  describe('Coordinate validation', () => {
    it('should reject out-of-bounds coordinates', () => {
      const board = new Board(config);
      board.setAlive(coord(-1, 5));
      expect(board.isAlive(coord(-1, 5))).toBe(false);
      expect(board.livingCellCount).toBe(0);
    });

    it('should reject coordinates beyond board size', () => {
      const board = new Board(config);
      board.setAlive(coord(10, 10));
      expect(board.isAlive(coord(10, 10))).toBe(false);
      expect(board.livingCellCount).toBe(0);
    });

    it('should accept valid coordinates at edges', () => {
      const board = new Board(config);
      board.setAlive(coord(0, 0));
      board.setAlive(coord(9, 9));
      expect(board.livingCellCount).toBe(2);
    });
  });

  describe('Neighbor counting', () => {
    it('should count neighbors correctly', () => {
      const board = new Board(config);
      // Create a 3x3 block
      for (let r = 4; r <= 6; r++) {
        for (let c = 4; c <= 6; c++) {
          board.setAlive(coord(r, c));
        }
      }

      // Center cell should have 8 neighbors
      expect(board.getNeighborCount(coord(5, 5))).toBe(8);

      // Corner of block should have 3 neighbors
      expect(board.getNeighborCount(coord(4, 4))).toBe(3);
    });

    it('should return 0 for cells with no neighbors', () => {
      const board = new Board(config, [coord(5, 5)]);
      expect(board.getNeighborCount(coord(0, 0))).toBe(0);
    });
  });

  describe('State management', () => {
    it('should get and set state', () => {
      const board = new Board(config);
      board.setAlive(coord(1, 1));
      board.setAlive(coord(2, 2));
      board.incrementGeneration();

      const state = board.getState();
      expect(state.generation).toBe(1);
      expect(state.livingCells.size).toBe(2);

      const newBoard = new Board(config);
      newBoard.setState([coord(3, 3)], undefined, 5);
      expect(newBoard.livingCellCount).toBe(1);
      expect(newBoard.getGeneration()).toBe(5);
      expect(newBoard.isAlive(coord(3, 3))).toBe(true);
    });

    it('should increment generation', () => {
      const board = new Board(config);
      expect(board.getGeneration()).toBe(0);
      board.incrementGeneration();
      expect(board.getGeneration()).toBe(1);
      board.incrementGeneration();
      expect(board.getGeneration()).toBe(2);
    });

    it('should get config', () => {
      const board = new Board(config);
      const retrievedConfig = board.getConfig();
      expect(retrievedConfig.rows).toBe(10);
      expect(retrievedConfig.cols).toBe(10);
      expect(retrievedConfig.wraparound).toBe(false);
    });
  });

  describe('Cells to evaluate', () => {
    it('should return relevant cells for evaluation', () => {
      const board = new Board(config, [coord(5, 5)]);
      const cells = board.getCellsToEvaluate();

      // Should include living cell and neighbors
      expect(cells.length).toBeGreaterThanOrEqual(9);
      expect(cells.some(c => c.row === 5 && c.col === 5)).toBe(true);
    });
  });

  describe('Wraparound config', () => {
    it('should pass wraparound config to internal structures', () => {
      const torusConfig: BoardConfig = {
        rows: 10,
        cols: 10,
        wraparound: true
      };

      // Place cell at top edge and bottom edge (they are neighbors in torus)
      const board = new Board(torusConfig, [coord(0, 5), coord(9, 5)]);

      // Cell at top edge should have neighbor at bottom edge due to wraparound
      expect(board.getNeighborCount(coord(0, 5))).toBe(1);
      expect(board.getNeighborCount(coord(9, 5))).toBe(1);
    });
  });
});
