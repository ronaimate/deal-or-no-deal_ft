import { useState, useEffect } from 'react';
import type { Bag } from '../game/types';

interface BagGridProps {
  bags: Bag[];
  phase: 'select_bag' | 'open_bags';
  bagsToOpenThisRound: number;
  bagsOpenedThisRound: number;
  onSelectBag: (id: number) => void;
}

const SELECTION_ANIMATION_MS = 2200;

export function BagGrid({
  bags,
  phase,
  bagsToOpenThisRound,
  bagsOpenedThisRound,
  onSelectBag,
}: BagGridProps) {
  const [justSelectedId, setJustSelectedId] = useState<number | null>(null);
  const [openingId, setOpeningId] = useState<number | null>(null);

  const isSelectingOwn = phase === 'select_bag';
  const canOpenMore =
    phase === 'open_bags' && bagsOpenedThisRound < bagsToOpenThisRound;

  useEffect(() => {
    if (justSelectedId === null) return;
    const t = setTimeout(() => setJustSelectedId(null), SELECTION_ANIMATION_MS);
    return () => clearTimeout(t);
  }, [justSelectedId]);

  useEffect(() => {
    if (openingId === null) return;
    const t = setTimeout(() => setOpeningId(null), 600);
    return () => clearTimeout(t);
  }, [openingId]);

  const handleClick = (bag: Bag) => {
    if (isSelectingOwn) {
      setJustSelectedId(bag.id);
      onSelectBag(bag.id);
      return;
    }
    if (canOpenMore && !bag.opened && !bag.isOwn) {
      setOpeningId(bag.id);
      onSelectBag(bag.id);
    }
  };

  return (
    <div className="bag-grid">
      {bags.map((bag) => {
        const disabled =
          phase === 'open_bags' &&
          (bag.opened || bag.isOwn || !canOpenMore);
        const showValue = bag.opened;
        const isJustChosen = bag.isOwn && bag.id === justSelectedId;
        const isOpening = bag.id === openingId;
        return (
          <button
            key={bag.id}
            type="button"
            onClick={() => handleClick(bag)}
            disabled={disabled}
            className={`bag ${bag.isOwn ? 'own' : ''} ${bag.opened ? 'opened' : ''} ${isJustChosen ? 'bag--just-chosen' : ''} ${isOpening ? 'bag--opening' : ''}`}
            aria-label={
              bag.isOwn
                ? `Saját táska: ${bag.id}`
                : showValue
                  ? `Táska ${bag.id} kiesett`
                  : `Táska ${bag.id}`
            }
          >
            <span className="bag-handle" aria-hidden />
            <span className="bag-body">
              {showValue ? (
                <span className="bag-value bag-value--eliminated">–</span>
              ) : (
                <span className="bag-number">{bag.id}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
