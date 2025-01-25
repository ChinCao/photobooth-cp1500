import {Server} from "socket.io";
import path from "path";
import fs from "fs";
import {currentTime} from "./utils";

const io = new Server(3001, {
  cors: {
    origin: ["http://localhost:3000"],
  },
  maxHttpBufferSize: Infinity,
});

io.on("connection", (socket) => {
  socket.on("print", (message: {quanity: number; dataURL: string; theme: string}) => {
    const themePath = path.join(process.cwd(), message.theme);
    if (!fs.existsSync(themePath)) {
      fs.mkdirSync(themePath, {recursive: true});
    }
    const filePath = path.join(themePath, `${currentTime()}.jpg`);
    const [, base64Data] = message.dataURL.split(",");
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("File saved successfully to", filePath);
      }
    });
  });
});
