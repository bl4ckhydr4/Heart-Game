import { GameState, PlayerSeat } from '../shared/types';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

export class RoomManager {
  private rooms: Map<string, GameState> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  createRoom(): string {
    const roomId = uuidv4();
    const initialState: GameState = {
      matchId: roomId,
      state: 'PENDING',
      roundIndex: 0,
      trickIndex: 0,
      currentPlayerSeat: 0,
      heartsBroken: false,
      passDirection: 'LEFT',
      players: [],
      scores: [0, 0, 0, 0]
    };
    this.rooms.set(roomId, initialState);
    return roomId;
  }

  getRoom(roomId: string): GameState | undefined {
    return this.rooms.get(roomId);
  }

  // Additional room lifecycle methods (join, leave, disconnect) will go here
}
