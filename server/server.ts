import {Server} from "socket.io";
import path from "path";
import fs from "fs";
import {currentTime} from "./utils";
import {exec} from "child_process";

const io = new Server(3001, {
  cors: {
    origin: ["http://localhost:3000"],
  },
  maxHttpBufferSize: Infinity,
});

io.on("connection", (socket) => {
  socket.on("print", async (message: {quanity: number; dataURL: string; theme: string}) => {
    const themePath = path.join(process.cwd(), "images", message.theme);
    if (!fs.existsSync(themePath)) {
      fs.mkdirSync(themePath, {recursive: true});
    }
    const filePath = path.join(themePath, `${currentTime()}.jpeg`);
    const [, base64Data] = message.dataURL.split(",");
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("File saved successfully to", filePath);
      }
    });
    const command = `Start-Process -FilePath C:/Users/lenovo/OneDrive/React/photobooth-cp1500/server/images/usagyuun/25-01-2025-23h_09m_36s.jpeg -Verb Print`;
    exec(command, {shell: "powershell.exe"}, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(stdout);
    });
  });
});
