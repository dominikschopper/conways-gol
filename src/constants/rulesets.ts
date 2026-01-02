import { RULE_NAME } from '@/core/types/Rules';

// Route names for rulesets (lowercase for URL paths)
export const RULESET_ROUTES = {
  [RULE_NAME.CONWAY]: 'conway',
  [RULE_NAME.HIGHLIFE]: 'highlife',
  [RULE_NAME.SEEDS]: 'seeds'
} as const;

export type RulesetRoute = typeof RULESET_ROUTES[keyof typeof RULESET_ROUTES];
