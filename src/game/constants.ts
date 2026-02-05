/** 22 táskában lévő összegek (Ft) */
export const BAG_VALUES = [
  500,
  1_000,
  5_000,
  10_000,
  25_000,
  50_000,
  75_000,
  100_000,
  200_000,
  300_000,
  400_000,
  500_000,
  750_000,
  1_000_000,
  1_500_000,
  2_000_000,
  2_500_000,
  3_000_000,
  4_000_000,
  5_000_000,
  7_500_000,
  10_000_000,
] as const;

/** Hány táskát nyitunk körönként: 5, majd 3×3, majd 3×2 */
export const BAGS_PER_ROUND = [5, 3, 3, 3, 2, 2, 2] as const;

export const BONUS_LETTERS = ['A', 'B', 'C', 'D'] as const;
export const ONE_MILLION = 1_000_000;
