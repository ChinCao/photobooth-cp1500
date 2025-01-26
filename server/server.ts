import {Server} from "socket.io";
import path from "path";
import fs from "fs";
import {currentTime} from "./utils";
import {spawn} from "child_process";

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
    const scriptPath = path.join(process.cwd(), "print-image.ps1");
    const printerName = "Canon SELPHY CP1500 (Copy 1)";
    const ps = spawn("powershell", ["-executionpolicy", "bypass", "-file", scriptPath, "-imagePath", filePath, "-printer", printerName], {
      shell: true,
      stdio: ["pipe"],
    });
    ps.stdout.on("data", (data) => {
      console.log(`Output: ${data}`);
    });

    ps.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });
  });
});
