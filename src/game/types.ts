export interface Bag {
  id: number;
  value: number;
  opened: boolean;
  isOwn: boolean;
}

export type GamePhase =
  | 'name'
  | 'select_bag'
  | 'open_bags'
  | 'banker_offer'
  | 'bonus'
  | 'result';

export type BonusEffect = 'double' | 'add1M' | 'halve' | 'keep';

export interface BonusOption {
  letter: 'A' | 'B' | 'C' | 'D';
  effect: BonusEffect;
}
