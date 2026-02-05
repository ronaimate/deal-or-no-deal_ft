interface BankerOfferProps {
  offer: number;
  onAccept: () => void;
  onReject: () => void;
}

function formatAmount(value: number): string {
  return `${value.toLocaleString('hu-HU')} Ft`;
}

export function BankerOffer({ offer, onAccept, onReject }: BankerOfferProps) {
  return (
    <section className="banker-offer">
      <h2>A bankár ajánlata</h2>
      <p className="offer-amount">{formatAmount(offer)}</p>
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
