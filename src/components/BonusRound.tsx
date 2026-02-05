import type { BonusOption } from '../game/types';

interface BonusRoundProps {
  options: BonusOption[];
  baseAmount: number;
  onSelect: (effect: import('../game/types').BonusEffect) => void;
}

const EFFECT_LABELS: Record<import('../game/types').BonusEffect, string> = {
  double: 'Duplázás',
  add1M: '+1 000 000 Ft',
  halve: 'Felezés',
  keep: 'Megtartás',
};

function formatAmount(value: number): string {
  return `${value.toLocaleString('hu-HU')} Ft`;
}

export function BonusRound({ options, baseAmount, onSelect }: BonusRoundProps) {
  return (
    <section className="bonus-round">
      <h2>23-as bónusz táska</h2>
      <p className="bonus-intro">
        Nyereményed: <strong>{formatAmount(baseAmount)}</strong>. Válassz egy
        táskát (A, B, C vagy D):
      </p>
      <div className="bonus-options">
        {options.map((opt) => (
          <button
            key={opt.letter}
            type="button"
            onClick={() => onSelect(opt.effect)}
            className="bonus-option"
          >
            <span className="bonus-letter">{opt.letter}</span>
            <span className="bonus-effect">{EFFECT_LABELS[opt.effect]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
