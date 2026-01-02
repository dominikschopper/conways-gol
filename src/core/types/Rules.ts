
export const RULE_NAME = {
  CONWAY: 'CONWAY',
  HIGHLIFE: 'HIGHLIFE',
  SEEDS: 'SEEDS',
  REANIMATION: 'REANIMATION',
} as const

export type RuleName = keyof typeof RULE_NAME;