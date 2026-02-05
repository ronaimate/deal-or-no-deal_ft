import type { Bag, BonusOption } from './types';
import { BAG_VALUES, BAGS_PER_ROUND, ONE_MILLION } from './constants';
import type { BonusEffect } from './types';

/** Fisher–Yates shuffle */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** 22 táska létrehozása véletlenszerű értékekkel; isOwn és opened később állítandó */
export function createBags(): Bag[] {
  const values = shuffle([...BAG_VALUES]);
  return values.map((value, index) => ({
    id: index + 1,
    value,
    opened: false,
    isOwn: false,
  }));
}

/** Saját táska beállítása (id 1..22) */
export function setOwnBag(bags: Bag[], ownBagId: number): Bag[] {
  return bags.map((b) => ({ ...b, isOwn: b.id === ownBagId }));
}

/** Egy táska kinyitása (csak nem saját) */
export function openBag(bags: Bag[], bagId: number): Bag[] {
  return bags.map((b) =>
    b.id === bagId && !b.isOwn ? { ...b, opened: true } : b
  );
}

/** Nyitott táskák száma */
export function countOpenedBags(bags: Bag[]): number {
  return bags.filter((b) => b.opened).length;
}

/** Bankár ajánlata: a még nyitlan (nem saját, nem nyitott) táskák átlaga, kerekítve */
export function calculateBankerOffer(bags: Bag[]): number {
  const remaining = bags.filter((b) => !b.opened && !b.isOwn);
  if (remaining.length === 0) return 0;
  const sum = remaining.reduce((s, b) => s + b.value, 0);
  return Math.round(sum / remaining.length);
}

/** Bónusz kör: 4 opció véletlenszerű sorrendben (duplázás, +1M, felezés, megtartás) */
export function createBonusOptions(): BonusOption[] {
  const effects: BonusEffect[] = ['double', 'add1M', 'halve', 'keep'];
  const shuffled = shuffle(effects);
  return (['A', 'B', 'C', 'D'] as const).map((letter, i) => ({
    letter,
    effect: shuffled[i],
  }));
}

/** Bónusz alkalmazása a nyereményre */
export function applyBonusEffect(amount: number, effect: BonusEffect): number {
  switch (effect) {
    case 'double':
      return amount * 2;
    case 'add1M':
      return amount + ONE_MILLION;
    case 'halve':
      return Math.floor(amount / 2);
    case 'keep':
    default:
      return amount;
  }
}

export function getBagsToOpenThisRound(roundIndex: number): number {
  if (roundIndex < BAGS_PER_ROUND.length) {
    return BAGS_PER_ROUND[roundIndex];
  }
  return 1;
}
