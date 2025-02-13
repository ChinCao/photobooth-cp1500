import {Server} from "socket.io";
import path from "path";
import fs from "fs";
import {currentTime, updatePrinterRegistry, getCP1500Printer} from "./utils";
import {exec} from "child_process";
import winston from "winston";

// Configure logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    // Write all logs with importance level of 'error' or less to 'error.log'
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with importance level of 'info' or less to 'combined.log'
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console logging in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

const io = new Server(6969, {
  cors: {
    origin: ["http://localhost:8080"],
  },
  maxHttpBufferSize: Infinity,
});

io.on("connection", (socket) => {
  logger.info("Client connected", {socketId: socket.id});

  socket.on("print", async (message: {quantity: number; dataURL: string; theme: string}) => {
    const printJobId = `print-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    logger.info("Print job received", {
      jobId: printJobId,
      socketId: socket.id,
      theme: message.theme,
      quantity: message.quantity,
    });

    try {
      // Validate input
      if (!message.dataURL || !message.theme || message.quantity < 1) {
        throw new Error("Invalid print request parameters");
      }

      const printerName = await getCP1500Printer();
      if (!printerName) {
        const error = new Error("Printer not found");
        socket.emit("printer_error", {
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
        socket.emit("printer_error", {
          jobId: printJobId,
          error: "PRINTER_REGISTRY_ERROR",
          message: "Failed to update printer registry. Printer may be offline.",
        });
        throw error;
      }

      // Save image file
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

      // Use promises for file operations
      await fs.promises.writeFile(filePath, Buffer.from(base64Data, "base64"));
      logger.info("Image file saved", {jobId: printJobId, path: filePath});

      // Execute print command with enhanced error handling
      const scriptPath = path.join(process.cwd(), "powershell", "print-image.ps1");
      const command = `powershell -NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "${scriptPath}" -imagePath "${filePath}" -printer "${printerName}" -copies ${message.quantity}`;

      logger.debug("Executing print command", {jobId: printJobId, command});

      await new Promise((resolve, reject) => {
        exec(command, {shell: "powershell.exe"}, (error, stdout, stderr) => {
          if (error) {
            logger.error("PowerShell command failed", {
              jobId: printJobId,
              error: error.message,
              code: error.code,
              stdout,
              stderr,
            });

            // Analyze error and send specific error message to client
            let errorType = "UNKNOWN_ERROR";
            let errorMessage = "An unknown error occurred while printing";

            if (stderr.includes("out of paper")) {
              errorType = "PRINTER_OUT_OF_PAPER";
              errorMessage = "Printer is out of paper. Please refill and try again.";
            } else if (stderr.includes("offline")) {
              errorType = "PRINTER_OFFLINE";
              errorMessage = "Printer is offline. Please check the connection.";
            } else if (stderr.includes("busy")) {
              errorType = "PRINTER_BUSY";
              errorMessage = "Printer is busy. Please wait and try again.";
            } else if (stderr.includes("error")) {
              errorType = "PRINTER_ERROR";
              errorMessage = "Printer reported an error. Please check the printer status.";
            }

            socket.emit("printer_error", {
              jobId: printJobId,
              error: errorType,
              message: errorMessage,
              details: stderr,
            });

            reject(new Error(`PowerShell command failed: ${error.message}`));
            return;
          }
          if (stderr) {
            logger.error("Print error occurred", {
              jobId: printJobId,
              stderr,
            });

            socket.emit("printer_error", {
              jobId: printJobId,
              error: "PRINT_ERROR",
              message: "Error occurred during printing",
              details: stderr,
            });

            reject(new Error(`Print error: ${stderr}`));
            return;
          }
          logger.info("Print job completed", {jobId: printJobId});
          socket.emit("print_success", {
            message: "Print job completed successfully",
            jobId: printJobId,
          });
          resolve(stdout);
        });
      });
    } catch (error) {
      logger.error("Print operation failed", {
        jobId: printJobId,
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
              }
            : "Unknown error",
        socketId: socket.id,
      });

      // Only emit generic error if a specific printer error hasn't been emitted
      if (!(error instanceof Error && error.message.includes("printer"))) {
        socket.emit("print_error", {
          message: error instanceof Error ? error.message : "Unknown error occurred",
          jobId: printJobId,
        });
      }
    }
  });

  socket.on("printer_error", (error) => {
    switch (error.error) {
      case "PRINTER_NOT_FOUND":
        // Handle printer not found
        break;
      case "PRINTER_OUT_OF_PAPER":
        // Handle out of paper
        break;
      case "PRINTER_OFFLINE":
        // Handle offline printer
        break;
      case "PRINTER_BUSY":
        // Handle busy printer
        break;
      case "PRINTER_ERROR":
        // Handle general printer error
        break;
      default:
        // Handle unknown printer error
        break;
    }
  });

  socket.on("disconnect", () => {
    logger.info("Client disconnected", {socketId: socket.id});
  });
});
