import { BAG_VALUES } from '../game/constants';

interface AllAmountsProps {
  /** Kinyitott táskák értékei – ezek áthúzva jelennek meg */
  eliminatedValues: number[];
}

function formatAmount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}e`;
  return String(value);
}

export function EliminatedAmounts({ eliminatedValues }: AllAmountsProps) {
  const eliminatedSet = new Set(eliminatedValues);

  return (
    <section className="all-amounts" aria-label="Összes összeg">
      <span className="all-amounts-label">Összegek:</span>
      <div className="all-amounts-list">
        {[...BAG_VALUES].sort((a, b) => a - b).map((value) => {
          const isEliminated = eliminatedSet.has(value);
          return (
            <span
              key={value}
              className={`all-amounts-chip ${isEliminated ? 'all-amounts-chip--eliminated' : ''}`}
            >
              {formatAmount(value)} Ft
            </span>
          );
        })}
      </div>
    </section>
  );
}
