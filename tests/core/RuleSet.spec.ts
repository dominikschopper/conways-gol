import { describe, it, expect } from 'vitest';
import { ConwayRuleSet, HighLifeRuleSet, SeedsRuleSet } from '@/core';

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
