
export const RULE_NAME = {
  CONWAY: 'CONWAY',
  HIGHLIFE: 'HIGHLIFE',
  SEEDS: 'SEEDS',
} as const

export type RuleName = keyof typeof RULE_NAME;