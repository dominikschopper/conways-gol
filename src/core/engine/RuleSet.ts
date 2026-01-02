import { CELL_STATE, type CellState } from '../types/Cell';

/**
 * Rule set for Game of Life
 * Determines cell survival and birth conditions
 */
export interface RuleSet {
  shouldSurvive(neighborCount: number): boolean
  shouldBeBorn(neighborCount: number): boolean
  getName(): string
}

/**
 * Extended rule set for multi-state cellular automata
 * Allows cells to have more than just alive/dead states
 */
export interface MultiStateRuleSet extends RuleSet {
  getNextState(currentState: CellState, aliveNeighborCount: number): CellState;
}

/**
 * Type guard to check if a RuleSet is a MultiStateRuleSet
 */
export function isMultiStateRuleSet(ruleSet: RuleSet): ruleSet is MultiStateRuleSet {
  return 'getNextState' in ruleSet;
}

/**
 * Classic Conway's Game of Life rules:
 * - Survival: 2-3 neighbors
 * - Birth: exactly 3 neighbors
 * (B3/S23 notation)
 */
export class ConwayRuleSet implements RuleSet {
  shouldSurvive(neighborCount: number): boolean {
    return neighborCount === 2 || neighborCount === 3;
  }

  shouldBeBorn(neighborCount: number): boolean {
    return neighborCount === 3;
  }

  getName(): string {
    return "Conway's Game of Life (B3/S23)";
  }
}

/**
 * HighLife variant (B36/S23)
 * Birth: 3 or 6 neighbors
 * Survival: 2 or 3 neighbors
 * Notable for replicating patterns
 */
export class HighLifeRuleSet implements RuleSet {
  shouldSurvive(neighborCount: number): boolean {
    return neighborCount === 2 || neighborCount === 3;
  }

  shouldBeBorn(neighborCount: number): boolean {
    return neighborCount === 3 || neighborCount === 6;
  }

  getName(): string {
    return 'HighLife (B36/S23)';
  }
}

/**
 * Seeds (B2/S)
 * Birth: exactly 2 neighbors
 * Survival: NONE - all cells die immediately
 * Creates chaotic, explosive expanding patterns
 */
export class SeedsRuleSet implements RuleSet {
  shouldSurvive(_neighborCount: number): boolean {
    return false; // No cell survives!
  }

  shouldBeBorn(neighborCount: number): boolean {
    return neighborCount === 2;
  }

  getName(): string {
    return 'Seeds (B2/S)';
  }
}

/**
 * Reanimation (3-State)
 * States: DEAD → ALIVE → DYING → DEAD
 * - ALIVE cell with <2 or >3 alive neighbors → DYING
 * - ALIVE cell with 2-3 alive neighbors → ALIVE (survives)
 * - DYING cell with 2-4 alive neighbors → ALIVE (reanimated!)
 * - DYING cell otherwise → DEAD
 * - DEAD cell with exactly 3 alive neighbors → ALIVE (birth)
 * Note: Only ALIVE cells count as neighbors (DYING cells do not)
 */
export class ReanimationRuleSet implements MultiStateRuleSet {
  shouldSurvive(neighborCount: number): boolean {
    return neighborCount === 2 || neighborCount === 3;
  }

  shouldBeBorn(neighborCount: number): boolean {
    return neighborCount === 3;
  }

  getNextState(currentState: CellState, aliveNeighborCount: number): CellState {
    switch (currentState) {
      case CELL_STATE.ALIVE:
        // Alive cells with 2-3 neighbors survive, otherwise become dying
        if (aliveNeighborCount === 2 || aliveNeighborCount === 3) {
          return CELL_STATE.ALIVE;
        }
        return CELL_STATE.DYING;

      case CELL_STATE.DYING:
        // Dying cells with 2-4 neighbors get reanimated!
        if (aliveNeighborCount >= 2 && aliveNeighborCount <= 4) {
          return CELL_STATE.ALIVE;
        }
        return CELL_STATE.DEAD;

      case CELL_STATE.DEAD:
        // Dead cells with exactly 3 neighbors are born
        if (aliveNeighborCount === 3) {
          return CELL_STATE.ALIVE;
        }
        return CELL_STATE.DEAD;

      default:
        return CELL_STATE.DEAD;
    }
  }

  getName(): string {
    return 'Reanimation (3-State)';
  }
}
