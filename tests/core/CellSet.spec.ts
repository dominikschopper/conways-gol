import { describe, it, expect } from 'vitest';
import { CellSet } from '@/core/data-structures/CellSet';
import { coord } from '@/core/types/Cell';

describe('CellSet', () => {
  it('should create an empty set', () => {
    const set = new CellSet();
    expect(set.size).toBe(0);
  });

  it('should create a set with initial cells', () => {
    const cells = [coord(0, 0), coord(1, 1), coord(2, 2)];
    const set = new CellSet(cells);
    expect(set.size).toBe(3);
  });

  it('should add cells', () => {
    const set = new CellSet();
    set.add(coord(5, 5));
    expect(set.size).toBe(1);
    expect(set.has(coord(5, 5))).toBe(true);
  });

  it('should not add duplicate cells', () => {
    const set = new CellSet();
    set.add(coord(5, 5));
    set.add(coord(5, 5));
    expect(set.size).toBe(1);
  });

  it('should delete cells', () => {
    const set = new CellSet([coord(5, 5)]);
    expect(set.has(coord(5, 5))).toBe(true);
    set.delete(coord(5, 5));
    expect(set.has(coord(5, 5))).toBe(false);
    expect(set.size).toBe(0);
  });

  it('should check if cell exists', () => {
    const set = new CellSet([coord(1, 2)]);
    expect(set.has(coord(1, 2))).toBe(true);
    expect(set.has(coord(2, 1))).toBe(false);
  });

  it('should clear all cells', () => {
    const set = new CellSet([coord(0, 0), coord(1, 1)]);
    expect(set.size).toBe(2);
    set.clear();
    expect(set.size).toBe(0);
  });

  it('should be iterable', () => {
    const cells = [coord(0, 0), coord(1, 1), coord(2, 2)];
    const set = new CellSet(cells);
    const result = [...set];
    expect(result).toHaveLength(3);
    expect(result.some(c => c.row === 0 && c.col === 0)).toBe(true);
    expect(result.some(c => c.row === 1 && c.col === 1)).toBe(true);
    expect(result.some(c => c.row === 2 && c.col === 2)).toBe(true);
  });

  it('should convert to array', () => {
    const cells = [coord(0, 0), coord(1, 1)];
    const set = new CellSet(cells);
    const array = set.toArray();
    expect(array).toHaveLength(2);
  });

  it('should clone the set', () => {
    const set1 = new CellSet([coord(0, 0), coord(1, 1)]);
    const set2 = set1.clone();
    expect(set2.size).toBe(2);
    expect(set2.has(coord(0, 0))).toBe(true);

    // Verify independence
    set1.add(coord(2, 2));
    expect(set1.size).toBe(3);
    expect(set2.size).toBe(2);
  });

  it('should handle coordinate equality correctly', () => {
    const set = new CellSet();
    const cell1 = coord(5, 10);
    const cell2 = coord(5, 10);

    set.add(cell1);
    expect(set.has(cell2)).toBe(true);
  });
});
