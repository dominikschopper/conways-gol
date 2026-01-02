import { describe, it, expect } from 'vitest';
import { SparseGrid } from '@/core/data-structures/SparseGrid';
import { coord, CELL_STATE } from '@/core/types/Cell';
import type { BoardConfig } from '@/core/types/Board';

describe('SparseGrid', () => {
  describe('Basic operations', () => {
    it('should create an empty grid', () => {
      const grid = new SparseGrid();
      expect(grid.size).toBe(0);
    });

    it('should create a grid with initial cells', () => {
      const cells = [coord(0, 0), coord(1, 1)];
      const grid = new SparseGrid(cells);
      expect(grid.size).toBe(2);
      expect(grid.isAlive(coord(0, 0))).toBe(true);
      expect(grid.isAlive(coord(1, 1))).toBe(true);
    });

    it('should set cells alive', () => {
      const grid = new SparseGrid();
      grid.setAlive(coord(5, 5));
      expect(grid.isAlive(coord(5, 5))).toBe(true);
      expect(grid.size).toBe(1);
    });

    it('should not duplicate cells when setting alive', () => {
      const grid = new SparseGrid();
      grid.setAlive(coord(5, 5));
      grid.setAlive(coord(5, 5));
      expect(grid.size).toBe(1);
    });

    it('should set cells dead', () => {
      const grid = new SparseGrid([coord(5, 5)]);
      expect(grid.isAlive(coord(5, 5))).toBe(true);
      grid.setDead(coord(5, 5));
      expect(grid.isAlive(coord(5, 5))).toBe(false);
      expect(grid.size).toBe(0);
    });

    it('should toggle cells', () => {
      const grid = new SparseGrid();
      grid.toggle(coord(5, 5));
      expect(grid.isAlive(coord(5, 5))).toBe(true);
      grid.toggle(coord(5, 5));
      expect(grid.isAlive(coord(5, 5))).toBe(false);
    });

    it('should clear all cells', () => {
      const grid = new SparseGrid([coord(0, 0), coord(1, 1)]);
      expect(grid.size).toBe(2);
      grid.clear();
      expect(grid.size).toBe(0);
    });

    it('should get living cells', () => {
      const cells = [coord(0, 0), coord(1, 1), coord(2, 2)];
      const grid = new SparseGrid(cells);
      const livingCells = grid.getLivingCells();
      expect(livingCells).toHaveLength(3);
    });
  });

  describe('Neighbor counting', () => {
    it('should track neighbor counts when adding cells', () => {
      const grid = new SparseGrid();
      grid.setAlive(coord(5, 5));

      // All 8 neighbors should have count of 1
      expect(grid.getNeighborCount(coord(4, 4))).toBe(1);
      expect(grid.getNeighborCount(coord(4, 5))).toBe(1);
      expect(grid.getNeighborCount(coord(4, 6))).toBe(1);
      expect(grid.getNeighborCount(coord(5, 4))).toBe(1);
      expect(grid.getNeighborCount(coord(5, 6))).toBe(1);
      expect(grid.getNeighborCount(coord(6, 4))).toBe(1);
      expect(grid.getNeighborCount(coord(6, 5))).toBe(1);
      expect(grid.getNeighborCount(coord(6, 6))).toBe(1);
    });

    it('should track neighbor counts when removing cells', () => {
      const grid = new SparseGrid([coord(5, 5)]);
      grid.setDead(coord(5, 5));

      // All neighbors should have count of 0
      expect(grid.getNeighborCount(coord(4, 4))).toBe(0);
      expect(grid.getNeighborCount(coord(5, 4))).toBe(0);
    });

    it('should accumulate neighbor counts', () => {
      const grid = new SparseGrid();
      grid.setAlive(coord(5, 5));
      grid.setAlive(coord(5, 6));

      // coord(5, 7) should have 1 neighbor
      expect(grid.getNeighborCount(coord(5, 7))).toBe(1);

      // coord(4, 5) should have 2 neighbors
      expect(grid.getNeighborCount(coord(4, 5))).toBe(2);
    });
  });

  describe('Cells to evaluate', () => {
    it('should return living cells and their neighbors', () => {
      const grid = new SparseGrid([coord(5, 5)]);
      const cellsToEvaluate = grid.getCellsToEvaluate();

      // Should include the living cell + 8 neighbors = 9 cells
      expect(cellsToEvaluate.length).toBeGreaterThanOrEqual(9);

      // Should include the living cell
      expect(cellsToEvaluate.some(c => c.row === 5 && c.col === 5)).toBe(true);

      // Should include at least one neighbor
      expect(cellsToEvaluate.some(c => c.row === 4 && c.col === 5)).toBe(true);
    });
  });

  describe('Wraparound (Torus) mode - Bug fix regression test', () => {
    const config: BoardConfig = {
      rows: 10,
      cols: 10,
      wraparound: true
    };

    it('should wrap neighbors around top edge', () => {
      const grid = new SparseGrid([coord(0, 5)], config);

      // Top neighbor should wrap to bottom (row 9)
      expect(grid.getNeighborCount(coord(9, 5))).toBe(1);
      expect(grid.getNeighborCount(coord(9, 4))).toBe(1);
      expect(grid.getNeighborCount(coord(9, 6))).toBe(1);
    });

    it('should wrap neighbors around bottom edge', () => {
      const grid = new SparseGrid([coord(9, 5)], config);

      // Bottom neighbor should wrap to top (row 0)
      expect(grid.getNeighborCount(coord(0, 5))).toBe(1);
      expect(grid.getNeighborCount(coord(0, 4))).toBe(1);
      expect(grid.getNeighborCount(coord(0, 6))).toBe(1);
    });

    it('should wrap neighbors around left edge', () => {
      const grid = new SparseGrid([coord(5, 0)], config);

      // Left neighbor should wrap to right (col 9)
      expect(grid.getNeighborCount(coord(5, 9))).toBe(1);
      expect(grid.getNeighborCount(coord(4, 9))).toBe(1);
      expect(grid.getNeighborCount(coord(6, 9))).toBe(1);
    });

    it('should wrap neighbors around right edge', () => {
      const grid = new SparseGrid([coord(5, 9)], config);

      // Right neighbor should wrap to left (col 0)
      expect(grid.getNeighborCount(coord(5, 0))).toBe(1);
      expect(grid.getNeighborCount(coord(4, 0))).toBe(1);
      expect(grid.getNeighborCount(coord(6, 0))).toBe(1);
    });

    it('should wrap neighbors around corners', () => {
      const grid = new SparseGrid([coord(0, 0)], config);

      // Top-left corner should have neighbors wrapping to all edges
      expect(grid.getNeighborCount(coord(9, 9))).toBe(1); // Bottom-right wraps to top-left
      expect(grid.getNeighborCount(coord(9, 0))).toBe(1); // Bottom wraps to top
      expect(grid.getNeighborCount(coord(0, 9))).toBe(1); // Right wraps to left
    });
  });

  describe('No wraparound mode', () => {
    const config: BoardConfig = {
      rows: 10,
      cols: 10,
      wraparound: false
    };

    it('should not wrap neighbors at edges', () => {
      const grid = new SparseGrid([coord(0, 5)], config);

      // Top edge should not wrap to bottom
      expect(grid.getNeighborCount(coord(9, 5))).toBe(0);
    });

    it('should skip out-of-bounds neighbors', () => {
      const grid = new SparseGrid([coord(0, 0)], config);
      const cellsToEvaluate = grid.getCellsToEvaluate();

      // Should only have valid neighbors within bounds
      const outOfBounds = cellsToEvaluate.some(c =>
        c.row < 0 || c.row >= 10 || c.col < 0 || c.col >= 10
      );
      expect(outOfBounds).toBe(false);
    });
  });

  describe('Multi-state support (dying cells)', () => {
    it('should track dying cells separately from living cells', () => {
      const grid = new SparseGrid();
      grid.setAlive(coord(5, 5));
      grid.setDying(coord(6, 6));

      expect(grid.isAlive(coord(5, 5))).toBe(true);
      expect(grid.isDying(coord(5, 5))).toBe(false);
      expect(grid.isAlive(coord(6, 6))).toBe(false);
      expect(grid.isDying(coord(6, 6))).toBe(true);
    });

    it('should return correct cell state', () => {
      const grid = new SparseGrid();
      grid.setAlive(coord(1, 1));
      grid.setDying(coord(2, 2));

      expect(grid.getState(coord(1, 1))).toBe(CELL_STATE.ALIVE);
      expect(grid.getState(coord(2, 2))).toBe(CELL_STATE.DYING);
      expect(grid.getState(coord(3, 3))).toBe(CELL_STATE.DEAD);
    });

    it('should move cell from alive to dying', () => {
      const grid = new SparseGrid([coord(5, 5)]);
      expect(grid.isAlive(coord(5, 5))).toBe(true);

      grid.setDying(coord(5, 5));
      expect(grid.isAlive(coord(5, 5))).toBe(false);
      expect(grid.isDying(coord(5, 5))).toBe(true);
    });

    it('should move cell from dying to alive', () => {
      const grid = new SparseGrid();
      grid.setDying(coord(5, 5));
      expect(grid.isDying(coord(5, 5))).toBe(true);

      grid.setAlive(coord(5, 5));
      expect(grid.isDying(coord(5, 5))).toBe(false);
      expect(grid.isAlive(coord(5, 5))).toBe(true);
    });

    it('should remove dying cell when setting dead', () => {
      const grid = new SparseGrid();
      grid.setDying(coord(5, 5));
      expect(grid.isDying(coord(5, 5))).toBe(true);

      grid.setDead(coord(5, 5));
      expect(grid.isDying(coord(5, 5))).toBe(false);
      expect(grid.getState(coord(5, 5))).toBe(CELL_STATE.DEAD);
    });

    it('should return dying cells separately', () => {
      const grid = new SparseGrid();
      grid.setAlive(coord(1, 1));
      grid.setDying(coord(2, 2));
      grid.setDying(coord(3, 3));

      const livingCells = grid.getLivingCells();
      const dyingCells = grid.getDyingCells();

      expect(livingCells).toHaveLength(1);
      expect(dyingCells).toHaveLength(2);
      expect(dyingCells.some(c => c.row === 2 && c.col === 2)).toBe(true);
      expect(dyingCells.some(c => c.row === 3 && c.col === 3)).toBe(true);
    });

    it('should clear both living and dying cells', () => {
      const grid = new SparseGrid();
      grid.setAlive(coord(1, 1));
      grid.setDying(coord(2, 2));

      grid.clear();

      expect(grid.getLivingCells()).toHaveLength(0);
      expect(grid.getDyingCells()).toHaveLength(0);
    });

    it('should include dying cells in cells to evaluate', () => {
      const grid = new SparseGrid();
      grid.setDying(coord(5, 5));

      const cellsToEvaluate = grid.getCellsToEvaluate();

      // Should include the dying cell itself
      expect(cellsToEvaluate.some(c => c.row === 5 && c.col === 5)).toBe(true);
    });

    it('dying cells should NOT increment neighbor counts', () => {
      const grid = new SparseGrid();
      grid.setDying(coord(5, 5));

      // All 8 neighbors should have count of 0 (dying cells don't count)
      expect(grid.getNeighborCount(coord(4, 4))).toBe(0);
      expect(grid.getNeighborCount(coord(4, 5))).toBe(0);
      expect(grid.getNeighborCount(coord(5, 4))).toBe(0);
      expect(grid.getNeighborCount(coord(6, 6))).toBe(0);
    });

    it('should decrement neighbor counts when transitioning alive to dying', () => {
      const grid = new SparseGrid();
      grid.setAlive(coord(5, 5));

      // Neighbors should have count of 1
      expect(grid.getNeighborCount(coord(4, 5))).toBe(1);

      grid.setDying(coord(5, 5));

      // Neighbors should now have count of 0
      expect(grid.getNeighborCount(coord(4, 5))).toBe(0);
    });

    it('should increment neighbor counts when transitioning dying to alive', () => {
      const grid = new SparseGrid();
      grid.setDying(coord(5, 5));

      // Neighbors should have count of 0
      expect(grid.getNeighborCount(coord(4, 5))).toBe(0);

      grid.setAlive(coord(5, 5));

      // Neighbors should now have count of 1
      expect(grid.getNeighborCount(coord(4, 5))).toBe(1);
    });
  });
});
