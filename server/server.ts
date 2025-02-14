import {Server} from "socket.io";
import path from "path";
import fs from "fs";
import {currentTime, updatePrinterRegistry, getCP1500Printer} from "./utils";
import {exec} from "child_process";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

const io = new Server(6969, {
  cors: {
    origin: ["http://localhost:8080"],
  },
  maxHttpBufferSize: Infinity,
});

io.on("connection", (socket) => {
  socket.on("print", async (message: {quantity: number; dataURL: string; theme: string}) => {
    logger.info("Client connected", {socketId: socket.id});
    const printJobId = `print-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    logger.info("Print job received", {
      jobId: printJobId,
      socketId: socket.id,
      theme: message.theme,
      quantity: message.quantity,
    });

    if (!message.dataURL || !message.theme || message.quantity < 1) {
      throw new Error("Invalid print request parameters");
    }

    const printerName = await getCP1500Printer();
    if (!printerName) {
      const error = new Error("Printer not found");
      logger.error("Printer not found", {
        jobId: printJobId,
        error: "PRINTER_NOT_FOUND",
        message: "Unable to locate printer. Please check if it's connected.",
      });
      throw error;
    }

    logger.info("Printer found", {jobId: printJobId, printer: printerName});

    try {
      await updatePrinterRegistry(printerName);
    } catch (error) {
      logger.error("Printer registry error", {
        jobId: printJobId,
        error: "PRINTER_REGISTRY_ERROR",
        message: "Failed to update printer registry. Printer may be offline.",
      });
      throw error;
    }

    const themePath = path.join(process.cwd(), "images", message.theme);
    if (!fs.existsSync(themePath)) {
      fs.mkdirSync(themePath, {recursive: true});
      logger.info("Theme directory created", {jobId: printJobId, path: themePath});
    }

    const filePath = path.join(themePath, `${currentTime()}.jpeg`);
    const [, base64Data] = message.dataURL.split(",");
    if (!base64Data) {
      throw new Error("Invalid image data");
    }

    await fs.promises.writeFile(filePath, Buffer.from(base64Data, "base64"));
    logger.info("Image file saved", {jobId: printJobId, path: filePath});

    const scriptPath = path.join(process.cwd(), "powershell", "print-image.ps1");
    const command = `powershell -NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "${scriptPath}" -imagePath "${filePath}" -printer "${printerName}" -copies ${message.quantity}`;

    logger.debug("Executing print command", {jobId: printJobId, command});

    await new Promise((resolve) => {
      exec(command, {shell: "powershell.exe"}, (error, stdout, stderr) => {
        if (error || stderr) {
          logger.error("PowerShell command failed", {
            jobId: printJobId,
            error: error?.message || stderr,
            code: error?.code,
            stdout,
            stderr,
            errorType: stderr.includes("The handle is invalid") ? "INVALID_PRINTER_HANDLE" : "GENERAL_ERROR",
          });
          resolve(void 0);
          return;
        }

        logger.info("Print job completed", {jobId: printJobId});

        resolve(void 0);
      });
    });
  });

  socket.on("disconnect", () => {
    logger.info("Client disconnected", {socketId: socket.id});
  });
});
