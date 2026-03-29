import { useGameStore } from '../store/gameStore';
import { Users, Trophy, ChevronRight } from 'lucide-react';

export function HUD() {
  const { gameState, mySeatIndex, selectedCards, passCards } = useGameStore();

  if (!gameState) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="bg-neutral-900/80 backdrop-blur-md p-8 rounded-2xl border border-neutral-800 text-center shadow-2xl">
          <h1 className="text-3xl font-serif text-neutral-200 mb-4">HEARTS: THE BLACK TABLE</h1>
          <p className="text-neutral-400 animate-pulse">Connecting to server...</p>
        </div>
      </div>
    );
  }

  const { state, players, scores, currentPlayerSeat, passDirection, roundIndex } = gameState;
  const isMyTurn = currentPlayerSeat === mySeatIndex;
  const isPassing = state === 'PASS';

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
      {/* Top Bar: Scores and Info */}
      <div className="flex justify-between items-start">
        <div className="bg-neutral-900/80 backdrop-blur-md p-4 rounded-xl border border-neutral-800 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2 mb-3 text-neutral-400 text-sm font-medium uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Scores - Round {roundIndex + 1}</span>
          </div>
          <div className="space-y-2">
            {players.map((p, i) => (
              <div key={p.playerId} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${currentPlayerSeat === p.seatIndex ? 'bg-red-500 animate-pulse' : 'bg-neutral-700'}`} />
                  <span className={`font-medium ${mySeatIndex === p.seatIndex ? 'text-neutral-200' : 'text-neutral-400'}`}>
                    {p.displayName} {mySeatIndex === p.seatIndex && '(You)'}
                  </span>
                </div>
                <span className="text-neutral-300 font-mono">{scores[i] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Game State Indicator */}
        <div className="bg-neutral-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-neutral-800 shadow-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-neutral-200 font-medium tracking-wide uppercase text-sm">
            {state === 'PENDING' && 'Waiting for players...'}
            {state === 'PASS' && `Pass 3 cards ${passDirection}`}
            {state === 'PLAY' && (isMyTurn ? 'Your Turn' : 'Waiting for others...')}
            {state === 'TRICK_RESOLVE' && 'Resolving trick...'}
            {state === 'ROUND_SCORE' && 'Round over'}
            {state === 'MATCH_RESULT' && 'Game over'}
          </span>
        </div>
      </div>

      {/* Bottom Bar: Actions */}
      <div className="flex justify-center items-end pb-8">
        {isPassing && (
          <button
            onClick={passCards}
            disabled={selectedCards.length !== 3}
            className={`pointer-events-auto px-8 py-4 rounded-full font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-2 shadow-2xl ${
              selectedCards.length === 3
                ? 'bg-red-600 hover:bg-red-500 text-white scale-100'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed scale-95'
            }`}
          >
            <span>Pass Cards ({selectedCards.length}/3)</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
