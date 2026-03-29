import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { Table3D } from './components/Table3D';
import { HUD } from './components/HUD';

export default function App() {
  const { connect, disconnect, socket } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      connect(playerName.trim());
      setHasJoined(true);
    }
  };

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900/50 backdrop-blur-xl p-8 rounded-3xl border border-neutral-800 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif text-neutral-200 tracking-tight mb-2">HEARTS</h1>
            <p className="text-neutral-500 uppercase tracking-widest text-sm">The Black Table</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-neutral-400 mb-2">
                Enter your name to join the table
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                placeholder="Player Name"
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-3 px-4 rounded-xl transition-colors uppercase tracking-wider text-sm"
            >
              Join Match
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 text-neutral-200 font-sans">
      <Table3D />
      <HUD />
    </div>
  );
}
