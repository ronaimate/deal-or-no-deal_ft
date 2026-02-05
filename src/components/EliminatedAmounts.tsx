interface EliminatedAmountsProps {
  values: number[];
}

function formatAmount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}e`;
  return String(value);
}

export function EliminatedAmounts({ values }: EliminatedAmountsProps) {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);

  return (
    <section className="eliminated-amounts" aria-label="Kiesett összegek">
      <span className="eliminated-label">Kiesett:</span>
      <div className="eliminated-list">
        {sorted.map((v) => (
          <span key={v} className="eliminated-chip">
            {formatAmount(v)} Ft
          </span>
        ))}
      </div>
    </section>
  );
}
