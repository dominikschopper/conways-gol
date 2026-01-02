import { computed, type ComputedRef } from 'vue';
import { ConwayRuleSet, HighLifeRuleSet, SeedsRuleSet, ReanimationRuleSet } from '@/core';
import { RULESET_ROUTES } from '@/constants/rulesets';
import { RULE_NAME } from '@/core/types/Rules';
import type { RulesetConfig } from '@/types/RulesetConfig';

// Create rulesets once (singleton instances)
const conwayRuleSet = new ConwayRuleSet();
const highLifeRuleSet = new HighLifeRuleSet();
const seedsRuleSet = new SeedsRuleSet();
const reanimationRuleSet = new ReanimationRuleSet();

/**
 * Composable for getting ruleset configuration based on route name
 */
export function useRulesetConfig(rulesetName: ComputedRef<string>): ComputedRef<RulesetConfig | null> {
  return computed(() => {
    switch (rulesetName.value) {
      case RULESET_ROUTES[RULE_NAME.CONWAY]:
        return {
          title: "Conway's Game of Life",
          notation: 'B3/S23',
          ruleSet: conwayRuleSet,
          showConwayPatterns: true,
          showHighLifePatterns: false
        };
      case RULESET_ROUTES[RULE_NAME.HIGHLIFE]:
        return {
          title: 'HighLife',
          notation: 'B36/S23',
          ruleSet: highLifeRuleSet,
          showConwayPatterns: true,
          showHighLifePatterns: true
        };
      case RULESET_ROUTES[RULE_NAME.SEEDS]:
        return {
          title: 'Seeds',
          notation: 'B2/S',
          ruleSet: seedsRuleSet,
          showConwayPatterns: true,
          showHighLifePatterns: false
        };
      case RULESET_ROUTES[RULE_NAME.REANIMATION]:
        return {
          title: 'Reanimation',
          notation: '3-State',
          ruleSet: reanimationRuleSet,
          showConwayPatterns: true,
          showHighLifePatterns: false
        };
      default:
        return null;
    }
  });
}
