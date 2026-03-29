import { GameState, PlayerSeat, Card } from '../shared/types';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { createDeck } from '../rules-engine/index';

interface Room {
  id: string;
  gameState: GameState;
  sockets: Map<string, Socket>;
  hands: Map<string, Card[]>;
}

export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  handleJoin(socket: Socket, playerName: string) {
    let room = this.findAvailableRoom();
    
    if (!room) {
      room = this.createRoom();
    }

    const playerId = socket.id;
    const seatIndex = room.gameState.players.length;

    const playerSeat: PlayerSeat = {
      playerId,
      seatIndex,
      displayName: playerName,
      connectionState: 'CONNECTED'
    };

    room.gameState.players.push(playerSeat);
    room.sockets.set(playerId, socket);

    socket.join(room.id);
    socket.emit('seat_assignment', seatIndex);

    socket.on('disconnect', () => {
      this.handleDisconnect(socket, room!.id);
    });

    if (room.gameState.players.length === 4) {
      this.startMatch(room);
    } else {
      this.broadcastGameState(room);
    }
  }

  private findAvailableRoom(): Room | undefined {
    for (const room of this.rooms.values()) {
      if (room.gameState.state === 'PENDING' && room.gameState.players.length < 4) {
        return room;
      }
    }
    return undefined;
  }

  private createRoom(): Room {
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

    const room: Room = {
      id: roomId,
      gameState: initialState,
      sockets: new Map(),
      hands: new Map()
    };

    this.rooms.set(roomId, room);
    return room;
  }

  private startMatch(room: Room) {
    room.gameState.state = 'PASS';
    
    let deck = createDeck();
    // Simple shuffle for now
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const hands: Card[][] = [[], [], [], []];
    deck.forEach((card, index) => {
      hands[index % 4].push(card);
    });

    // Sort hands
    const suitOrder = { 'CLUBS': 0, 'DIAMONDS': 1, 'SPADES': 2, 'HEARTS': 3 };
    hands.forEach(hand => {
      hand.sort((a, b) => {
        if (suitOrder[a.suit] !== suitOrder[b.suit]) {
          return suitOrder[a.suit] - suitOrder[b.suit];
        }
        return a.value - b.value;
      });
    });

    room.gameState.players.forEach((player, index) => {
      room.hands.set(player.playerId, hands[index]);
    });

    room.gameState.currentPlayerSeat = 0;

    this.broadcastGameState(room);

    room.gameState.players.forEach((player) => {
      const socket = room.sockets.get(player.playerId);
      if (socket) {
        socket.emit('hand_update', room.hands.get(player.playerId));
      }
    });
  }

  private broadcastGameState(room: Room) {
    this.io.to(room.id).emit('game_state', room.gameState);
  }

  private handleDisconnect(socket: Socket, roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const player = room.gameState.players.find(p => p.playerId === socket.id);
    if (player) {
      player.connectionState = 'DISCONNECTED';
      this.broadcastGameState(room);
    }
  }
}
