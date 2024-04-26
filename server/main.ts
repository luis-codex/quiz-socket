import { Server } from 'npm:socket.io@4.7.5';
// @deno-types="npm:@types/express@4.17.21"
import express from "npm:express@4.19.2";
// @deno-types="npm:@types/node"
import http from "node:http";

// APP QUIZZ.
const app = express();
app.use(express.json());

const pathClient = Deno.cwd() + "/client/dist";
app.use(express.static(pathClient));

app.get("*", (_, res) => {
  res.sendFile(pathClient + "/index.html", {
    headers: {
      "Content-Type": "text/html",
    },
  });
});

const server = http.createServer(app);
const io = new Server(server);

type notification = {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
};

const getDataParticipants = (roomId: string) => {
  const roomInfo = io.sockets.adapter.rooms.get(roomId);
  return roomInfo ? Array.from(roomInfo).map((id) => io.sockets.sockets.get(id)?.handshake.auth) : []
}

type auth = {
  avatarUrl: string;
  name: string;
  roomId: string;
  timeLimit: number;
}

io.on("connection", (socket) => {
  const auth = socket.handshake.auth as auth;
  const { name, roomId } = auth;

  const notification: notification = {
    title: `${name} has joined the room.`,
    message: "A new user has joined the room.",
    type: "info",
  }
  io.to(roomId).emit("notification", notification)

  socket.join(roomId);
  const notificationWelcome: notification = {
    title: `Welcome ${name}!`,
    message: "You have joined the room.",
    type: "success",
  }

  socket.emit("notification", notificationWelcome);

  socket.on("message", (msg) => {
    console.log("message: " + msg);
    io.to(roomId).emit("message", msg);
  });

  const participants = getDataParticipants(roomId);
  io.to(roomId).emit("participants", participants);

  socket.on("get-participants", () => {
    const participants = getDataParticipants(roomId);
    socket.emit("participants", participants);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(roomId);

    const participants = getDataParticipants(roomId);
    io.to(roomId).emit("participants", participants);

    io.to(roomId).emit("notification", {
      title: "User disconnected",
      message: "A user has left the room.",
      type: "info",
    });
  });

  socket.on('user-join', (data) => {
    console.log('user-join', data);
  });
});

server.listen(3000, () => console.log("listening on http://localhost:3000"));