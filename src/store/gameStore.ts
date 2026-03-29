import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { Card, GameState, PlayerSeat } from '../shared/types';

interface GameStore {
  socket: Socket | null;
  gameState: GameState | null;
  mySeatIndex: number | null;
  hand: Card[];
  trick: { seatIndex: number; card: Card }[];
  selectedCards: string[];
  connect: (playerName: string) => void;
  disconnect: () => void;
  playCard: (cardId: string) => void;
  passCards: () => void;
  toggleCardSelection: (cardId: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  socket: null,
  gameState: null,
  mySeatIndex: null,
  hand: [],
  trick: [],
  selectedCards: [],

  connect: (playerName: string) => {
    const socket = io({
      query: { playerName },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('game_state', (state: GameState) => {
      set({ gameState: state });
    });

    socket.on('seat_assignment', (seatIndex: number) => {
      set({ mySeatIndex: seatIndex });
    });

    socket.on('hand_update', (hand: Card[]) => {
      set({ hand });
    });

    socket.on('trick_update', (trick: { seatIndex: number; card: Card }[]) => {
      set({ trick });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, gameState: null, mySeatIndex: null, hand: [], trick: [], selectedCards: [] });
    }
  },

  playCard: (cardId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('play_card', cardId);
    }
  },

  passCards: () => {
    const { socket, selectedCards } = get();
    if (socket && selectedCards.length === 3) {
      socket.emit('pass_cards', selectedCards);
      set({ selectedCards: [] });
    }
  },

  toggleCardSelection: (cardId: string) => {
    set((state) => {
      const isSelected = state.selectedCards.includes(cardId);
      if (isSelected) {
        return { selectedCards: state.selectedCards.filter((id) => id !== cardId) };
      }
      if (state.selectedCards.length < 3) {
        return { selectedCards: [...state.selectedCards, cardId] };
      }
      return state;
    });
  },
}));
