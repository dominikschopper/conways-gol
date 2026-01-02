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
