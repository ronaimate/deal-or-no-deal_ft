import { useState, useEffect } from 'react';
import type { BonusOption, BonusEffect } from '../game/types';

const EFFECT_LABELS: Record<BonusEffect, string> = {
  double: 'Duplázás',
  add1M: '+1 000 000 Ft',
  halve: 'Felezés',
  keep: 'Megtartás',
};

const REVEAL_DURATION_MS = 2500;

interface BonusRoundProps {
  options: BonusOption[];
  baseAmount: number;
  onSelect: (effect: BonusEffect) => void;
}

function formatAmount(value: number): string {
  return `${value.toLocaleString('hu-HU')} Ft`;
}

export function BonusRound({ options, baseAmount, onSelect }: BonusRoundProps) {
  const [selectedOption, setSelectedOption] = useState<BonusOption | null>(null);

  useEffect(() => {
    if (selectedOption === null) return;
    const t = setTimeout(() => {
      onSelect(selectedOption.effect);
    }, REVEAL_DURATION_MS);
    return () => clearTimeout(t);
  }, [selectedOption, onSelect]);

  const handleClick = (opt: BonusOption) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt);
  };

  if (selectedOption !== null) {
    return (
      <section className="bonus-round bonus-round--reveal" aria-live="polite">
        <h2>Választásod</h2>
        <p className="bonus-reveal-letter">{selectedOption.letter}</p>
        <p className="bonus-reveal-effect">{EFFECT_LABELS[selectedOption.effect]}</p>
        <p className="bonus-reveal-hint">Átirányítás az eredményhez…</p>
      </section>
    );
  }

  return (
    <section className="bonus-round">
      <h2>23-as bónusz táska</h2>
      <p className="bonus-intro">
        Nyereményed: <strong>{formatAmount(baseAmount)}</strong>. Válassz egy
        táskát (A, B, C vagy D) – a tartalom rejtve van:
      </p>
      <div className="bonus-options">
        {options.map((opt) => (
          <button
            key={opt.letter}
            type="button"
            onClick={() => handleClick(opt)}
            className="bonus-option bonus-option--hidden"
            aria-label={`Bónusz táska ${opt.letter}`}
          >
            <span className="bonus-letter">{opt.letter}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
