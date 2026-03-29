import { Card, Suit, Rank } from '../shared/types';

const SUITS: Suit[] = ['CLUBS', 'DIAMONDS', 'SPADES', 'HEARTS'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let i = 0; i < RANKS.length; i++) {
      deck.push({
        id: `${RANKS[i]}_${suit}`,
        suit,
        rank: RANKS[i],
        value: i + 2,
      });
    }
  }
  return deck;
}

// Deterministic Fisher-Yates shuffle using a seeded PRNG
export function shuffleDeck(deck: Card[], seed: number): Card[] {
  // Placeholder for deterministic shuffle
  const shuffled = [...deck];
  // TODO: Implement seeded PRNG using the provided seed
  return shuffled;
}
