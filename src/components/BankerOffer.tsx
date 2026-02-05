import { useState, useEffect } from 'react';
import { playRingSound } from '../utils/ringSound';

interface BankerOfferProps {
  offer: number;
  onAccept: () => void;
  onReject: () => void;
  bankerName: string;
  bankerImage: string | null;
}

const RING_DURATION_MS = 2500;

function formatAmount(value: number): string {
  return `${value.toLocaleString('hu-HU')} Ft`;
}

export function BankerOffer({
  offer,
  onAccept,
  onReject,
  bankerName,
  bankerImage,
}: BankerOfferProps) {
  const [isRinging, setIsRinging] = useState(true);

  useEffect(() => {
    const stopRing = playRingSound(RING_DURATION_MS);
    const t = setTimeout(() => setIsRinging(false), RING_DURATION_MS);
    return () => {
      clearTimeout(t);
      stopRing();
    };
  }, []);

  if (isRinging) {
    return (
      <section className="banker-offer banker-offer--ringing" aria-live="polite">
        <div className="phone-ring">
          <span className="phone-ring-icon" aria-hidden>📞</span>
          <p className="phone-ring-text">Cseng a telefon…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="banker-offer banker-offer--show" aria-live="polite">
      <div className="banker-card">
        {bankerImage && (
          <img
            src={bankerImage}
            alt=""
            className="banker-photo"
          />
        )}
        <h2 className="banker-name">{bankerName}</h2>
      </div>
      <p className="offer-amount">{formatAmount(offer)}</p>
      <p className="offer-label">Az igazgató úr ajánlata</p>
      <div className="banker-buttons">
        <button type="button" onClick={onAccept} className="btn btn-deal">
          Áll az alku
        </button>
        <button type="button" onClick={onReject} className="btn btn-no-deal">
          Nem áll az alku
        </button>
      </div>
    </section>
  );
}
