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
  socket.on("print", async (message: {quantity: number; dataURL: string; theme: string}) => {
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

    const printerName = "Canon SELPHY CP1500 (Copy 1)";
    const scriptPath = path.join(process.cwd(), "print-image.ps1");
    const command = `powershell -NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "${scriptPath}" -imagePath "${filePath}" -printer "${printerName}" -copies ${message.quantity}`;

    exec(command, {shell: "powershell.exe"}, (error, stdout, stderr) => {
      if (error) {
        console.error(`PowerShell command failed: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`PowerShell stderr: ${stderr}`);
        return;
      }
      console.log(`PowerShell command succeeded:\n${stdout}`);
    });
  });
});
