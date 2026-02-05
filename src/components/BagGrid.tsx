import type { Bag } from '../game/types';

function formatAmount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M Ft`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}e Ft`;
  }
  return `${value} Ft`;
}

interface BagGridProps {
  bags: Bag[];
  phase: 'select_bag' | 'open_bags';
  bagsToOpenThisRound: number;
  bagsOpenedThisRound: number;
  onSelectBag: (id: number) => void;
}

export function BagGrid({
  bags,
  phase,
  bagsToOpenThisRound,
  bagsOpenedThisRound,
  onSelectBag,
}: BagGridProps) {
  const isSelectingOwn = phase === 'select_bag';
  const canOpenMore =
    phase === 'open_bags' && bagsOpenedThisRound < bagsToOpenThisRound;

  const handleClick = (bag: Bag) => {
    if (isSelectingOwn) {
      onSelectBag(bag.id);
      return;
    }
    if (canOpenMore && !bag.opened && !bag.isOwn) {
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
        return (
          <button
            key={bag.id}
            type="button"
            onClick={() => handleClick(bag)}
            disabled={disabled}
            className={`bag ${bag.isOwn ? 'own' : ''} ${bag.opened ? 'opened' : ''}`}
            aria-label={
              bag.isOwn
                ? `Saját táska: ${bag.id}`
                : showValue
                  ? `Táska ${bag.id}: ${formatAmount(bag.value)}`
                  : `Táska ${bag.id}`
            }
          >
            {showValue ? (
              <span className="bag-value">{formatAmount(bag.value)}</span>
            ) : (
              <span className="bag-number">{bag.id}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
