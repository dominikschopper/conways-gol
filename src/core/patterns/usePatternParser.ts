import { coord, Coordinate } from '../types/Cell';

export function usePatternParser(liveString: string) {
  return (line: string, rowIdx: number) => {
    return line.split('').map((cell, colIdx) => {
      if (cell === liveString) {
        return coord(rowIdx, colIdx);
      }
      return null;
    }).filter(cell => cell !== null) as Coordinate[];
    }
}