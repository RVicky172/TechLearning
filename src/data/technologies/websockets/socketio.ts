import type { TopicNode } from "@/data/types";

export const wsSocketIO: TopicNode = {
  id: "websockets-socketio",
  title: "Socket.io",
  iconName: "Radio",
  link: "https://socket.io/docs/v4/",
  theory:
    "Socket.io builds on top of WebSockets and adds rooms, namespaces, automatic reconnection, acknowledgements, and a fallback to HTTP long-polling when WebSockets are unavailable. It is the most widely deployed real-time library in the Node.js ecosystem.",
  theoryDetail: {
    keyConcepts: [
      "Events: Socket.io uses named events (socket.emit('message', data)) rather than raw message frames — easier to route and handle",
      "Rooms: server-side groupings — socket.join('room:42'); io.to('room:42').emit() broadcasts to all room members",
      "Namespaces: logical separation within one server — /chat and /notifications can have separate logic on the same socket server",
      "Acknowledgements: emit with a callback — socket.emit('createPost', data, (response) => {}) — the server calls the callback with a result",
      "Broadcast: socket.broadcast.emit() sends to all connected clients except the sender; io.emit() sends to everyone including sender",
      "Adapter: by default Socket.io uses in-memory state; swap for @socket.io/redis-adapter to broadcast across multiple server instances",
      "socket.data: server-side per-socket storage — attach authenticated user data here after validating the handshake",
    ],
    whyItMatters:
      "Socket.io abstracts the hard parts of real-time: reconnection, room fanout, event routing. It's the go-to choice for chat, collaborative tools, and live dashboards. The Redis adapter pattern is an essential system design concept — how to scale WebSockets horizontally.",
    commonPitfalls: [
      "Not authenticating the handshake — use io.use() middleware to validate a JWT on the initial connection; reject before socket.on('connect') fires",
      "Relying on in-memory adapter in multi-instance deployments — messages only reach clients connected to the same process; always use the Redis adapter in production",
      "Emitting to disconnected sockets — always check socket.connected before emitting in async code",
      "Not using rooms for targeted broadcasts — io.emit() broadcasts to all clients; use rooms to target specific users or channels",
    ],
    examples: [
      {
        title: "Socket.io server with auth middleware and rooms",
        description:
          "JWT authentication on connect, room-based chat with typing indicators.",
        code: `import { Server } from "socket.io";
import { createServer } from "http";
import { verify } from "jsonwebtoken";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});

// ── Auth middleware ────────────────────────────────────────
io.use((socket, next) => {
  const token = socket.handshake.auth.token as string;
  try {
    const payload = verify(token, process.env.JWT_SECRET!) as { userId: string };
    socket.data.userId = payload.userId;     // attach to socket for later use
    next();
  } catch {
    next(new Error("Authentication failed"));
  }
});

// ── Connection handler ─────────────────────────────────────
io.on("connection", (socket) => {
  const { userId } = socket.data;
  console.log(\`User \${userId} connected (\${socket.id})\`);

  // Join a chat room
  socket.on("joinRoom", (roomId: string) => {
    socket.join(\`room:\${roomId}\`);
    // Notify others in the room
    socket.to(\`room:\${roomId}\`).emit("userJoined", { userId });
  });

  // Send a message with acknowledgement
  socket.on("sendMessage", async (payload: { roomId: string; text: string }, ack) => {
    const message = await saveMessageToDB({ ...payload, senderId: userId });
    // Broadcast to all in room (including sender)
    io.to(\`room:\${payload.roomId}\`).emit("newMessage", message);
    ack({ ok: true, messageId: message.id });  // confirm to sender
  });

  // Typing indicator
  socket.on("typing", (roomId: string) => {
    socket.to(\`room:\${roomId}\`).emit("userTyping", { userId });
  });

  socket.on("disconnect", (reason) => {
    console.log(\`User \${userId} disconnected: \${reason}\`);
  });
});

httpServer.listen(4000);`,
        language: "typescript",
      },
    ],
  },
};
