export type Suit = 'CLUBS' | 'DIAMONDS' | 'SPADES' | 'HEARTS';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string; // e.g., '2_CLUBS'
  suit: Suit;
  rank: Rank;
  value: number; // 2-14
}

export type PassDirection = 'LEFT' | 'RIGHT' | 'ACROSS' | 'HOLD';

export type MatchState =
  | 'PENDING'
  | 'FORMING'
  | 'INTRO'
  | 'DEAL'
  | 'PASS'
  | 'OPENING_LEAD'
  | 'PLAY'
  | 'TRICK_RESOLVE'
  | 'ROUND_SCORE'
  | 'INTER_ROUND'
  | 'MATCH_RESULT'
  | 'TERMINATED';

export interface PlayerSeat {
  playerId: string;
  seatIndex: number; // 0, 1, 2, 3
  displayName: string;
  connectionState: 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING';
}

export interface GameState {
  matchId: string;
  state: MatchState;
  roundIndex: number;
  trickIndex: number;
  currentPlayerSeat: number;
  heartsBroken: boolean;
  passDirection: PassDirection;
  players: PlayerSeat[];
  scores: number[];
}
