interface ResultScreenProps {
  playerName: string;
  finalAmount: number;
  onPlayAgain: () => void;
}

function formatAmount(value: number): string {
  return `${value.toLocaleString('hu-HU')} Ft`;
}

export function ResultScreen({
  playerName,
  finalAmount,
  onPlayAgain,
}: ResultScreenProps) {
  return (
    <section className="screen result-screen">
      <h1>Eredmény</h1>
      <p className="result-message">
        {playerName}, a végső nyereményed:
      </p>
      <p className="result-amount">{formatAmount(finalAmount)}</p>
      <button type="button" onClick={onPlayAgain} className="btn btn-primary">
        Új játék
      </button>
    </section>
  );
}
