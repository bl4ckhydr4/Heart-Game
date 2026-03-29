import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { RoomManager } from "./src/server/room-manager";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });
  const PORT = 3000;

  const roomManager = new RoomManager(io);

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", game: "HEARTS: THE BLACK TABLE" });
  });

  // Socket.IO logic
  io.on("connection", (socket) => {
    const playerName = socket.handshake.query.playerName as string || "Anonymous";
    console.log("Player connected:", socket.id, playerName);
    
    roomManager.handleJoin(socket, playerName);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
