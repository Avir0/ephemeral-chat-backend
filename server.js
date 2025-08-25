// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { connectDB } from './config/db.js';
// import Message from './models/Message.js';
// import Room from './models/Room.js';
// import roomsRouter from './routes/rooms.js';

// dotenv.config();

// const app = express();
// app.use(express.json());

// // ✅ CORS setup
// const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
// app.use(cors({ origin: allowedOrigin, credentials: true }));

// // REST routes
// app.use('/api/rooms', roomsRouter);

// // ✅ Serve frontend build in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'frontend/dist')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
//   });
// }

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigin,
//     methods: ['GET', 'POST'],
//   },
// });

// // Track room participants in-memory
// const participants = new Map(); // roomId -> Set(socketId)

// function getRoomSet(roomId) {
//   if (!participants.has(roomId)) participants.set(roomId, new Set());
//   return participants.get(roomId);
// }

// io.on('connection', (socket) => {
//   // Join a room
//   socket.on('join-room', async ({ roomId, username }) => {
//     socket.join(roomId);
//     socket.data.roomId = roomId;
//     socket.data.username = username || 'Anonymous';

//     const set = getRoomSet(roomId);
//     set.add(socket.id);

//     // Send recent messages (if any) to the newly joined user
//     const recent = await Message.find({ room: roomId }).sort({ createdAt: 1 }).limit(100).lean();
//     socket.emit('chat-history', recent);

//     // Notify room
//     io.to(roomId).emit('system', { text: `${socket.data.username} joined.`, ts: Date.now() });
//   });

//   // Receive a message
//   socket.on('chat-message', async ({ roomId, text }) => {
//     if (!roomId || !text) return;
//     const msg = await Message.create({
//       room: roomId,
//       sender: socket.data.username || 'Anonymous',
//       text
//     });
//     io.to(roomId).emit('chat-message', msg);
//   });

//   // User intentionally leaves
//   socket.on('leave-room', async () => {
//     await handleDisconnect(socket);
//   });

//   // Disconnect handler
//   socket.on('disconnect', async () => {
//     await handleDisconnect(socket);
//   });
// });

// async function handleDisconnect(socket) {
//   const roomId = socket.data.roomId;
//   const username = socket.data.username || 'User';

//   if (roomId) {
//     const set = getRoomSet(roomId);
//     set.delete(socket.id);
//     socket.leave(roomId);
//     io.to(roomId).emit('system', { text: `${username} left.`, ts: Date.now() });

//     if (set.size === 0) {
//       // No one left in the room -> delete messages & room doc
//       await Message.deleteMany({ room: roomId });
//       await Room.deleteOne({ roomId });
//       participants.delete(roomId);
//       console.log(`🧹 Deleted all chat history for room ${roomId}`);
//     }
//   }
// }

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, async () => {
//   try {
//     await connectDB(process.env.MONGO_URI);
//     console.log(`🚀 Server listening on port ${PORT}`);
//   } catch (err) {
//     console.error('DB connection failed:', err.message);
//     process.exit(1);
//   }
// });

// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { connectDB } from './config/db.js';
// import Message from './models/Message.js';
// import Room from './models/Room.js';
// import roomsRouter from './routes/rooms.js';

// dotenv.config();

// const app = express();
// app.use(express.json());

// // ✅ CORS setup
// const allowedOrigin =
//   process.env.CLIENT_URL || 'https://ephemeral-chat-frontend.vercel.app';

// app.use(
//   cors({
//     origin: allowedOrigin,
//     credentials: true,
//   })
// );

// // ✅ REST routes
// app.use('/api/rooms', roomsRouter);

// // ❌ Removed "serve frontend build" section
// // Because frontend is deployed separately on Vercel

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigin,
//     methods: ['GET', 'POST'],
//   },
// });

// // Track room participants in-memory
// const participants = new Map(); // roomId -> Set(socketId)

// function getRoomSet(roomId) {
//   if (!participants.has(roomId)) participants.set(roomId, new Set());
//   return participants.get(roomId);
// }

// io.on('connection', (socket) => {
//   // Join a room
//   socket.on('join-room', async ({ roomId, username }) => {
//     socket.join(roomId);
//     socket.data.roomId = roomId;
//     socket.data.username = username || 'Anonymous';

//     const set = getRoomSet(roomId);
//     set.add(socket.id);

//     // Send recent messages (if any) to the newly joined user
//     const recent = await Message.find({ room: roomId })
//       .sort({ createdAt: 1 })
//       .limit(100)
//       .lean();
//     socket.emit('chat-history', recent);

//     // Notify room
//     io.to(roomId).emit('system', {
//       text: `${socket.data.username} joined.`,
//       ts: Date.now(),
//     });
//   });

//   // Receive a message
//   socket.on('chat-message', async ({ roomId, text }) => {
//     if (!roomId || !text) return;
//     const msg = await Message.create({
//       room: roomId,
//       sender: socket.data.username || 'Anonymous',
//       text,
//     });
//     io.to(roomId).emit('chat-message', msg);
//   });

//   // User intentionally leaves
//   socket.on('leave-room', async () => {
//     await handleDisconnect(socket);
//   });

//   // Disconnect handler
//   socket.on('disconnect', async () => {
//     await handleDisconnect(socket);
//   });
// });

// async function handleDisconnect(socket) {
//   const roomId = socket.data.roomId;
//   const username = socket.data.username || 'User';

//   if (roomId) {
//     const set = getRoomSet(roomId);
//     set.delete(socket.id);
//     socket.leave(roomId);
//     io.to(roomId).emit('system', { text: `${username} left.`, ts: Date.now() });

//     if (set.size === 0) {
//       // No one left in the room -> delete messages & room doc
//       await Message.deleteMany({ room: roomId });
//       await Room.deleteOne({ roomId });
//       participants.delete(roomId);
//       console.log(`🧹 Deleted all chat history for room ${roomId}`);
//     }
//   }
// }

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, async () => {
//   try {
//     await connectDB(process.env.MONGO_URI);
//     console.log(`✅ MongoDB connected`);
//     console.log(`🚀 Server listening on port ${PORT}`);
//   } catch (err) {
//     console.error('DB connection failed:', err.message);
//     process.exit(1);
//   }
// });


import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Message from "./models/Message.js";
import Room from "./models/Room.js";
import roomsRouter from "./routes/rooms.js";

dotenv.config();

const app = express();
app.use(express.json());

//✅ CORS setup (allow localhost + deployed frontend)
const allowedOrigin =process.env.CLIENT_URL || 'https://ephemeral-chat-frontend.vercel.app';


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "*", // allow frontend deployed URL
//     methods: ["GET", "POST"],
//   })
// );



// ✅ REST routes
app.use("/api/rooms", roomsRouter);

// ❌ Removed "serve frontend build" section
// Because frontend is deployed separately

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Track room participants in-memory
const participants = new Map(); // roomId -> Set(socketId)

function getRoomSet(roomId) {
  if (!participants.has(roomId)) participants.set(roomId, new Set());
  return participants.get(roomId);
}

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // Join a room
  socket.on("join-room", async ({ roomId, username }) => {
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.username = username || "Anonymous";

    const set = getRoomSet(roomId);
    set.add(socket.id);

    // Send recent messages (if any) to the newly joined user
    const recent = await Message.find({ room: roomId })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();
    socket.emit("chat-history", recent);

    // Notify room
    io.to(roomId).emit("system", {
      text: `${socket.data.username} joined.`,
      ts: Date.now(),
    });
  });

  // Receive a message
  socket.on("chat-message", async ({ roomId, text }) => {
    if (!roomId || !text) return;
    const msg = await Message.create({
      room: roomId,
      sender: socket.data.username || "Anonymous",
      text,
    });
    io.to(roomId).emit("chat-message", msg);
  });

  // User intentionally leaves
  socket.on("leave-room", async () => {
    await handleDisconnect(socket);
  });

  // Disconnect handler
  socket.on("disconnect", async () => {
    await handleDisconnect(socket);
  });
});

async function handleDisconnect(socket) {
  const roomId = socket.data.roomId;
  const username = socket.data.username || "User";

  if (roomId) {
    const set = getRoomSet(roomId);
    set.delete(socket.id);
    socket.leave(roomId);
    io.to(roomId).emit("system", { text: `${username} left.`, ts: Date.now() });

    if (set.size === 0) {
      // No one left in the room -> delete messages & room doc
      await Message.deleteMany({ room: roomId });
      await Room.deleteOne({ roomId });
      participants.delete(roomId);
      console.log(`🧹 Deleted all chat history for room ${roomId}`);
    }
  }
}

// ✅ Connect DB first, then start server
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ MongoDB connected`);
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });

