import { NameScreen } from './components/NameScreen';
import { BagGrid } from './components/BagGrid';
import { BankerOffer } from './components/BankerOffer';
import { BonusRound } from './components/BonusRound';
import { ResultScreen } from './components/ResultScreen';
import { useGameState } from './hooks/useGameState';
import './App.css';

function App() {
  const {
    playerName,
    phase,
    bags,
    currentRound,
    bagsOpenedThisRound,
    bagsToOpenThisRound,
    bankerOffer,
    bonusOptions,
    finalAmount,
    shouldShowBankerAfterOpen,
    startGame,
    selectOwnBag,
    openBagById,
    acceptDeal,
    rejectDeal,
    selectBonus,
    playAgain,
  } = useGameState();

  if (phase === 'name') {
    return <NameScreen onStart={startGame} />;
  }

  if (phase === 'result') {
    return (
      <ResultScreen
        playerName={playerName}
        finalAmount={finalAmount}
        onPlayAgain={playAgain}
      />
    );
  }

  if (phase === 'bonus') {
    const ownBag = bags.find((b) => b.isOwn);
    const baseAmount = ownBag ? ownBag.value : 0;
    return (
      <main className="app-main">
        <BonusRound
          options={bonusOptions}
          baseAmount={baseAmount}
          onSelect={selectBonus}
        />
      </main>
    );
  }

  const showBankerOffer = phase === 'banker_offer';
  const offerAmount = bankerOffer;

  return (
    <main className="app-main">
      <header className="game-header">
        <h1>Áll az alku</h1>
        <p className="player-name">Üdv, {playerName}!</p>
        {(phase === 'select_bag' || phase === 'open_bags') && (
          <p className="round-info">
            {phase === 'select_bag'
              ? 'Válaszd ki a saját táskád (a játék végéig nem nyílik ki).'
              : `Kör ${currentRound + 1}: nyiss ${bagsToOpenThisRound} táskát (${bagsOpenedThisRound}/${bagsToOpenThisRound})`}
          </p>
        )}
      </header>

      {showBankerOffer ? (
        <BankerOffer
          offer={offerAmount}
          onAccept={acceptDeal}
          onReject={rejectDeal}
        />
      ) : (
        <BagGrid
          bags={bags}
          phase={phase as 'select_bag' | 'open_bags'}
          bagsToOpenThisRound={bagsToOpenThisRound}
          bagsOpenedThisRound={bagsOpenedThisRound}
          onSelectBag={phase === 'select_bag' ? selectOwnBag : openBagById}
        />
      )}
    </main>
  );
}

export default App;
