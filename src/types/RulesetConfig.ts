import type { RuleSet } from '@/core';

export interface RulesetConfig {
  title: string;
  notation: string;
  ruleSet: RuleSet;
  showConwayPatterns: boolean;
  showHighLifePatterns: boolean;
}
