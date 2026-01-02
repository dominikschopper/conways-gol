import { describe, it, expect } from 'vitest';
import { ConwayRuleSet, HighLifeRuleSet, SeedsRuleSet, ReanimationRuleSet, CELL_STATE, isMultiStateRuleSet } from '@/core';

describe('ConwayRuleSet (B3/S23)', () => {
  const ruleset = new ConwayRuleSet();

  describe('shouldBeBorn', () => {
    it('should give birth with exactly 3 neighbors', () => {
      expect(ruleset.shouldBeBorn(3)).toBe(true);
    });

    it('should not give birth with 0-2 neighbors', () => {
      expect(ruleset.shouldBeBorn(0)).toBe(false);
      expect(ruleset.shouldBeBorn(1)).toBe(false);
      expect(ruleset.shouldBeBorn(2)).toBe(false);
    });

    it('should not give birth with 4-8 neighbors', () => {
      expect(ruleset.shouldBeBorn(4)).toBe(false);
      expect(ruleset.shouldBeBorn(5)).toBe(false);
      expect(ruleset.shouldBeBorn(6)).toBe(false);
      expect(ruleset.shouldBeBorn(7)).toBe(false);
      expect(ruleset.shouldBeBorn(8)).toBe(false);
    });
  });

  describe('shouldSurvive', () => {
    it('should survive with 2 or 3 neighbors', () => {
      expect(ruleset.shouldSurvive(2)).toBe(true);
      expect(ruleset.shouldSurvive(3)).toBe(true);
    });

    it('should die with 0-1 neighbors (underpopulation)', () => {
      expect(ruleset.shouldSurvive(0)).toBe(false);
      expect(ruleset.shouldSurvive(1)).toBe(false);
    });

    it('should die with 4-8 neighbors (overpopulation)', () => {
      expect(ruleset.shouldSurvive(4)).toBe(false);
      expect(ruleset.shouldSurvive(5)).toBe(false);
      expect(ruleset.shouldSurvive(6)).toBe(false);
      expect(ruleset.shouldSurvive(7)).toBe(false);
      expect(ruleset.shouldSurvive(8)).toBe(false);
    });
  });
});

describe('HighLifeRuleSet (B36/S23)', () => {
  const ruleset = new HighLifeRuleSet();

  describe('shouldBeBorn', () => {
    it('should give birth with 3 or 6 neighbors', () => {
      expect(ruleset.shouldBeBorn(3)).toBe(true);
      expect(ruleset.shouldBeBorn(6)).toBe(true);
    });

    it('should not give birth with 0-2 neighbors', () => {
      expect(ruleset.shouldBeBorn(0)).toBe(false);
      expect(ruleset.shouldBeBorn(1)).toBe(false);
      expect(ruleset.shouldBeBorn(2)).toBe(false);
    });

    it('should not give birth with 4-5 or 7-8 neighbors', () => {
      expect(ruleset.shouldBeBorn(4)).toBe(false);
      expect(ruleset.shouldBeBorn(5)).toBe(false);
      expect(ruleset.shouldBeBorn(7)).toBe(false);
      expect(ruleset.shouldBeBorn(8)).toBe(false);
    });
  });

  describe('shouldSurvive', () => {
    it('should survive with 2 or 3 neighbors', () => {
      expect(ruleset.shouldSurvive(2)).toBe(true);
      expect(ruleset.shouldSurvive(3)).toBe(true);
    });

    it('should die with 0-1 neighbors (underpopulation)', () => {
      expect(ruleset.shouldSurvive(0)).toBe(false);
      expect(ruleset.shouldSurvive(1)).toBe(false);
    });

    it('should die with 4-8 neighbors (overpopulation)', () => {
      expect(ruleset.shouldSurvive(4)).toBe(false);
      expect(ruleset.shouldSurvive(5)).toBe(false);
      expect(ruleset.shouldSurvive(6)).toBe(false);
      expect(ruleset.shouldSurvive(7)).toBe(false);
      expect(ruleset.shouldSurvive(8)).toBe(false);
    });
  });
});

describe('SeedsRuleSet (B2/S)', () => {
  const ruleset = new SeedsRuleSet();

  describe('shouldBeBorn', () => {
    it('should give birth with exactly 2 neighbors', () => {
      expect(ruleset.shouldBeBorn(2)).toBe(true);
    });

    it('should not give birth with 0-1 neighbors', () => {
      expect(ruleset.shouldBeBorn(0)).toBe(false);
      expect(ruleset.shouldBeBorn(1)).toBe(false);
    });

    it('should not give birth with 3-8 neighbors', () => {
      expect(ruleset.shouldBeBorn(3)).toBe(false);
      expect(ruleset.shouldBeBorn(4)).toBe(false);
      expect(ruleset.shouldBeBorn(5)).toBe(false);
      expect(ruleset.shouldBeBorn(6)).toBe(false);
      expect(ruleset.shouldBeBorn(7)).toBe(false);
      expect(ruleset.shouldBeBorn(8)).toBe(false);
    });
  });

  describe('shouldSurvive', () => {
    it('should never survive (all cells die immediately)', () => {
      expect(ruleset.shouldSurvive(0)).toBe(false);
      expect(ruleset.shouldSurvive(1)).toBe(false);
      expect(ruleset.shouldSurvive(2)).toBe(false);
      expect(ruleset.shouldSurvive(3)).toBe(false);
      expect(ruleset.shouldSurvive(4)).toBe(false);
      expect(ruleset.shouldSurvive(5)).toBe(false);
      expect(ruleset.shouldSurvive(6)).toBe(false);
      expect(ruleset.shouldSurvive(7)).toBe(false);
      expect(ruleset.shouldSurvive(8)).toBe(false);
    });
  });
});

describe('ReanimationRuleSet (3-State)', () => {
  const ruleset = new ReanimationRuleSet();

  describe('type guard', () => {
    it('should be identified as a MultiStateRuleSet', () => {
      expect(isMultiStateRuleSet(ruleset)).toBe(true);
    });

    it('should not identify 2-state rulesets as multi-state', () => {
      expect(isMultiStateRuleSet(new ConwayRuleSet())).toBe(false);
      expect(isMultiStateRuleSet(new HighLifeRuleSet())).toBe(false);
      expect(isMultiStateRuleSet(new SeedsRuleSet())).toBe(false);
    });
  });

  describe('backward compatibility methods', () => {
    describe('shouldBeBorn', () => {
      it('should give birth with exactly 3 neighbors', () => {
        expect(ruleset.shouldBeBorn(3)).toBe(true);
      });

      it('should not give birth with 0-2 neighbors', () => {
        expect(ruleset.shouldBeBorn(0)).toBe(false);
        expect(ruleset.shouldBeBorn(1)).toBe(false);
        expect(ruleset.shouldBeBorn(2)).toBe(false);
      });

      it('should not give birth with 4-8 neighbors', () => {
        expect(ruleset.shouldBeBorn(4)).toBe(false);
        expect(ruleset.shouldBeBorn(5)).toBe(false);
        expect(ruleset.shouldBeBorn(6)).toBe(false);
        expect(ruleset.shouldBeBorn(7)).toBe(false);
        expect(ruleset.shouldBeBorn(8)).toBe(false);
      });
    });

    describe('shouldSurvive', () => {
      it('should survive with 2 or 3 neighbors', () => {
        expect(ruleset.shouldSurvive(2)).toBe(true);
        expect(ruleset.shouldSurvive(3)).toBe(true);
      });

      it('should die with 0-1 neighbors', () => {
        expect(ruleset.shouldSurvive(0)).toBe(false);
        expect(ruleset.shouldSurvive(1)).toBe(false);
      });

      it('should die with 4-8 neighbors', () => {
        expect(ruleset.shouldSurvive(4)).toBe(false);
        expect(ruleset.shouldSurvive(5)).toBe(false);
        expect(ruleset.shouldSurvive(6)).toBe(false);
        expect(ruleset.shouldSurvive(7)).toBe(false);
        expect(ruleset.shouldSurvive(8)).toBe(false);
      });
    });
  });

  describe('getNextState - ALIVE cells', () => {
    it('should stay ALIVE with 2 neighbors', () => {
      expect(ruleset.getNextState(CELL_STATE.ALIVE, 2)).toBe(CELL_STATE.ALIVE);
    });

    it('should stay ALIVE with 3 neighbors', () => {
      expect(ruleset.getNextState(CELL_STATE.ALIVE, 3)).toBe(CELL_STATE.ALIVE);
    });

    it('should become DYING with 0 neighbors (underpopulation)', () => {
      expect(ruleset.getNextState(CELL_STATE.ALIVE, 0)).toBe(CELL_STATE.DYING);
    });

    it('should become DYING with 1 neighbor (underpopulation)', () => {
      expect(ruleset.getNextState(CELL_STATE.ALIVE, 1)).toBe(CELL_STATE.DYING);
    });

    it('should become DYING with 4 neighbors (overpopulation)', () => {
      expect(ruleset.getNextState(CELL_STATE.ALIVE, 4)).toBe(CELL_STATE.DYING);
    });

    it('should become DYING with 5-8 neighbors (overpopulation)', () => {
      expect(ruleset.getNextState(CELL_STATE.ALIVE, 5)).toBe(CELL_STATE.DYING);
      expect(ruleset.getNextState(CELL_STATE.ALIVE, 6)).toBe(CELL_STATE.DYING);
      expect(ruleset.getNextState(CELL_STATE.ALIVE, 7)).toBe(CELL_STATE.DYING);
      expect(ruleset.getNextState(CELL_STATE.ALIVE, 8)).toBe(CELL_STATE.DYING);
    });
  });

  describe('getNextState - DYING cells (reanimation)', () => {
    it('should reanimate to ALIVE with 2 neighbors', () => {
      expect(ruleset.getNextState(CELL_STATE.DYING, 2)).toBe(CELL_STATE.ALIVE);
    });

    it('should reanimate to ALIVE with 3 neighbors', () => {
      expect(ruleset.getNextState(CELL_STATE.DYING, 3)).toBe(CELL_STATE.ALIVE);
    });

    it('should reanimate to ALIVE with 4 neighbors', () => {
      expect(ruleset.getNextState(CELL_STATE.DYING, 4)).toBe(CELL_STATE.ALIVE);
    });

    it('should become DEAD with 0 neighbors', () => {
      expect(ruleset.getNextState(CELL_STATE.DYING, 0)).toBe(CELL_STATE.DEAD);
    });

    it('should become DEAD with 1 neighbor', () => {
      expect(ruleset.getNextState(CELL_STATE.DYING, 1)).toBe(CELL_STATE.DEAD);
    });

    it('should become DEAD with 5-8 neighbors', () => {
      expect(ruleset.getNextState(CELL_STATE.DYING, 5)).toBe(CELL_STATE.DEAD);
      expect(ruleset.getNextState(CELL_STATE.DYING, 6)).toBe(CELL_STATE.DEAD);
      expect(ruleset.getNextState(CELL_STATE.DYING, 7)).toBe(CELL_STATE.DEAD);
      expect(ruleset.getNextState(CELL_STATE.DYING, 8)).toBe(CELL_STATE.DEAD);
    });
  });

  describe('getNextState - DEAD cells (birth)', () => {
    it('should be born as ALIVE with exactly 3 neighbors', () => {
      expect(ruleset.getNextState(CELL_STATE.DEAD, 3)).toBe(CELL_STATE.ALIVE);
    });

    it('should stay DEAD with 0-2 neighbors', () => {
      expect(ruleset.getNextState(CELL_STATE.DEAD, 0)).toBe(CELL_STATE.DEAD);
      expect(ruleset.getNextState(CELL_STATE.DEAD, 1)).toBe(CELL_STATE.DEAD);
      expect(ruleset.getNextState(CELL_STATE.DEAD, 2)).toBe(CELL_STATE.DEAD);
    });

    it('should stay DEAD with 4-8 neighbors', () => {
      expect(ruleset.getNextState(CELL_STATE.DEAD, 4)).toBe(CELL_STATE.DEAD);
      expect(ruleset.getNextState(CELL_STATE.DEAD, 5)).toBe(CELL_STATE.DEAD);
      expect(ruleset.getNextState(CELL_STATE.DEAD, 6)).toBe(CELL_STATE.DEAD);
      expect(ruleset.getNextState(CELL_STATE.DEAD, 7)).toBe(CELL_STATE.DEAD);
      expect(ruleset.getNextState(CELL_STATE.DEAD, 8)).toBe(CELL_STATE.DEAD);
    });
  });

  describe('complete state transition cycles', () => {
    it('should handle ALIVE → DYING → DEAD cycle (no reanimation)', () => {
      // Alive cell with 0 neighbors becomes dying
      const dying = ruleset.getNextState(CELL_STATE.ALIVE, 0);
      expect(dying).toBe(CELL_STATE.DYING);

      // Dying cell with 0 neighbors becomes dead
      const dead = ruleset.getNextState(dying, 0);
      expect(dead).toBe(CELL_STATE.DEAD);
    });

    it('should handle ALIVE → DYING → ALIVE cycle (reanimation)', () => {
      // Alive cell with 4 neighbors becomes dying
      const dying = ruleset.getNextState(CELL_STATE.ALIVE, 4);
      expect(dying).toBe(CELL_STATE.DYING);

      // Dying cell with 3 neighbors reanimates
      const alive = ruleset.getNextState(dying, 3);
      expect(alive).toBe(CELL_STATE.ALIVE);
    });

    it('should handle DEAD → ALIVE → DYING → DEAD full cycle', () => {
      // Dead cell with 3 neighbors is born
      const born = ruleset.getNextState(CELL_STATE.DEAD, 3);
      expect(born).toBe(CELL_STATE.ALIVE);

      // Alive cell with 1 neighbor becomes dying
      const dying = ruleset.getNextState(born, 1);
      expect(dying).toBe(CELL_STATE.DYING);

      // Dying cell with 1 neighbor dies
      const dead = ruleset.getNextState(dying, 1);
      expect(dead).toBe(CELL_STATE.DEAD);
    });
  });
});
