import {Server} from "socket.io";
import path from "path";
import fs from "fs";
import {currentTime, updatePrinterRegistry, getCP1500Printer, logger} from "./utils";
import {exec} from "child_process";
import {Blob} from "buffer";
import {pipeline} from "stream/promises";

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, {recursive: true});
}

const io = new Server(6969, {
  cors: {
    origin: ["http://localhost:8080"],
  },
  maxHttpBufferSize: Infinity,
});

io.on("connection", (socket) => {
  logger.info("Client connected", {socketId: socket.id});
  socket.on("print", async (message: {quantity: number; dataURL: string; theme: string}, callback) => {
    const printJobId = `print-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    logger.info("Print job received", {
      jobId: printJobId,
      socketId: socket.id,
      theme: message.theme,
      quantity: message.quantity,
    });

    if (!message.dataURL || !message.theme || message.quantity < 1) {
      logger.error("Invalid print request parameters", {
        jobId: printJobId,
        error: "INVALID_REQUEST_PARAMETERS",
        message: "Invalid print request parameters",
      });
      callback({success: false, message: "Invalid print request parameters"});
      return;
    }

    callback({success: true, message: "Print job submitted"});

    const themePath = path.join(process.cwd(), "images", message.theme);
    if (!fs.existsSync(themePath)) {
      fs.mkdirSync(themePath, {recursive: true});
      logger.info("Theme directory created", {jobId: printJobId, path: themePath});
    }

    const filePath = path.join(themePath, `${currentTime()}.jpeg`);
    const [, base64Data] = message.dataURL.split(",");
    if (!base64Data) {
      logger.error("Invalid image data", {
        jobId: printJobId,
        error: "INVALID_IMAGE_DATA",
        message: "Invalid image data",
      });
      return;
    }

    await fs.promises.writeFile(filePath, Buffer.from(base64Data, "base64"));
    logger.info("Image file saved", {jobId: printJobId, path: filePath});

    const printerName = await getCP1500Printer();
    if (!printerName) {
      const error = new Error("Printer not found");
      logger.error("Printer not found", {
        jobId: printJobId,
        error: "PRINTER_NOT_FOUND",
        message: "Unable to locate printer. Please check if it's connected.",
      });
      return;
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
      return;
    }

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

  socket.on("process-video", async (message: {dataURL: Blob}, callback) => {
    const videoJobId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    logger.info("Video processing job received", {
      jobId: videoJobId,
      socketId: socket.id,
    });

    try {
      const rawVideosDir = path.join(process.cwd(), "videos/raw");
      const processedVideosDir = path.join(process.cwd(), "videos/processed");
      if (!fs.existsSync(rawVideosDir)) {
        fs.mkdirSync(rawVideosDir, {recursive: true});
      }
      if (!fs.existsSync(processedVideosDir)) {
        fs.mkdirSync(processedVideosDir, {recursive: true});
      }

      const filename = `${currentTime()}.webm`;
      const rawFilePath = path.join(rawVideosDir, filename);
      const processedFilePath = path.join(processedVideosDir, filename);

      const buffer = Buffer.from(message.dataURL as unknown as ArrayBuffer);
      await fs.promises.writeFile(rawFilePath, buffer);

      logger.info("Video file saved", {
        jobId: videoJobId,
        path: rawFilePath,
      });

      const scriptPath = path.join(process.cwd(), "powershell", "process-video.ps1");
      const command = `powershell -NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "${scriptPath}" -inputVideo "${rawFilePath}" -outputVideo "${processedFilePath}"`;

      logger.debug("Executing video processing command", {jobId: videoJobId, command});

      await new Promise((resolve, reject) => {
        exec(command, {shell: "powershell.exe"}, (error, stdout, stderr) => {
          if (error) {
            logger.error("Video processing failed", {
              jobId: videoJobId,
              error: error.message,
              code: error.code,
              stdout,
              stderr,
            });
            reject(error);
            return;
          }

          if (stdout.includes("SUCCESS:")) {
            logger.info("Video processing completed", {
              jobId: videoJobId,
              output: processedFilePath,
            });
            resolve(void 0);
          } else {
            logger.error("Video processing failed - no success message", {
              jobId: videoJobId,
              stdout,
              stderr,
            });
            reject(new Error("Video processing failed - no success message"));
          }
        });
      });

      callback({
        success: true,
        local_url: processedFilePath,
        r2_url: "",
      });
    } catch (error) {
      logger.error("Video processing failed", {
        jobId: videoJobId,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      callback({
        success: false,
        local_url: "",
        r2_url: "",
      });
    }
  });

  socket.on("disconnect", () => {
    logger.info("Client disconnected", {socketId: socket.id});
  });
});
