import { useState, useCallback, useEffect } from 'react';
import type { Bag, GamePhase, BonusOption } from '../game/types';
import {
  createBags,
  setOwnBag,
  openBag,
  calculateBankerOffer,
  createBonusOptions,
  applyBonusEffect,
  getBagsToOpenThisRound,
} from '../game/logic';
import { BAGS_PER_ROUND } from '../game/constants';

export function useGameState() {
  const [playerName, setPlayerName] = useState('');
  const [phase, setPhase] = useState<GamePhase>('name');
  const [bags, setBags] = useState<Bag[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [bagsOpenedThisRound, setBagsOpenedThisRound] = useState(0);
  const [bankerOffer, setBankerOffer] = useState(0);
  const [acceptedOffer, setAcceptedOffer] = useState<number | null>(null);
  const [bonusOptions, setBonusOptions] = useState<BonusOption[]>([]);
  const [finalAmount, setFinalAmount] = useState(0);

  const bagsToOpenThisRound = getBagsToOpenThisRound(currentRound);
  const shouldShowBankerAfterOpen =
    phase === 'open_bags' && bagsOpenedThisRound === bagsToOpenThisRound && bagsToOpenThisRound > 0;

  const BANKER_OFFER_DELAY_MS = 2000;

  useEffect(() => {
    if (!shouldShowBankerAfterOpen) return;
    const t = setTimeout(() => {
      setBankerOffer(calculateBankerOffer(bags));
      setPhase('banker_offer');
    }, BANKER_OFFER_DELAY_MS);
    return () => clearTimeout(t);
  }, [shouldShowBankerAfterOpen, bags]);

  const startGame = useCallback((name: string) => {
    setPlayerName(name);
    setBags(createBags());
    setPhase('select_bag');
    setCurrentRound(0);
    setBagsOpenedThisRound(0);
    setBankerOffer(0);
    setAcceptedOffer(null);
    setBonusOptions([]);
    setFinalAmount(0);
  }, []);

  const selectOwnBag = useCallback(
    (bagId: number) => {
      setBags((prev) => setOwnBag(prev, bagId));
      setPhase('open_bags');
      setBagsOpenedThisRound(0);
    },
    []
  );

  const openBagById = useCallback((bagId: number) => {
    setBags((prev) => openBag(prev, bagId));
    setBagsOpenedThisRound((n) => n + 1);
  }, []);

  const acceptDeal = useCallback(() => {
    setAcceptedOffer(bankerOffer);
    setFinalAmount(bankerOffer);
    setPhase('result');
  }, [bankerOffer]);

  const rejectDeal = useCallback(() => {
    const nextRound = currentRound + 1;
    setBagsOpenedThisRound(0);
    if (nextRound >= BAGS_PER_ROUND.length) {
      const ownBag = bags.find((b) => b.isOwn);
      const amount = ownBag ? ownBag.value : 0;
      setFinalAmount(amount);
      setBonusOptions(createBonusOptions());
      setPhase('bonus');
    } else {
      setPhase('open_bags');
      setCurrentRound(nextRound);
    }
  }, [currentRound, bags]);

  const selectBonus = useCallback(
    (effect: import('../game/types').BonusEffect) => {
      const ownBag = bags.find((b) => b.isOwn);
      const baseAmount = ownBag ? ownBag.value : 0;
      const amount = applyBonusEffect(baseAmount, effect);
      setFinalAmount(amount);
      setPhase('result');
    },
    [bags]
  );

  const playAgain = useCallback(() => {
    setPhase('name');
    setPlayerName('');
    setBags([]);
    setCurrentRound(0);
    setBagsOpenedThisRound(0);
    setBankerOffer(0);
    setAcceptedOffer(null);
    setBonusOptions([]);
    setFinalAmount(0);
  }, []);

  return {
    playerName,
    phase,
    bags,
    currentRound,
    bagsOpenedThisRound,
    bagsToOpenThisRound,
    bankerOffer,
    acceptedOffer,
    bonusOptions,
    finalAmount,
    startGame,
    selectOwnBag,
    openBagById,
    acceptDeal,
    rejectDeal,
    selectBonus,
    playAgain,
  };
}
