import {Server} from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("message", (message: string) => {
    console.log(message);
  });
});
