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
    const printerName = "Canon SELPHY CP1500 (Copy 1)";
    const command = `
    function printImage {
        param([string]$imagePath, [string]$printer)
        trap { break; }
        [void][System.Reflection.Assembly]::LoadWithPartialName("System.Drawing")
        $bitmap = $null
        $doc = new-object System.Drawing.Printing.PrintDocument
        if ($printer -ne "") {
            $doc.PrinterSettings.PrinterName = $printer
        }
        $doc.DocumentName = [System.IO.Path]::GetFileName($imagePath)
        $doc.add_EndPrint({
            if ($null -ne $bitmap) {
                $bitmap.Dispose()
                $bitmap = $null
            }
        })
        $doc.add_PrintPage({
            $img = new-object Drawing.Bitmap($imagePath)
            $_.Graphics.DrawImage($img, $_.Graphics.VisibleClipBounds)
            $_.HasMorePages = $false;
        })
        $doc.Print()
    }
    printImage -imagePath "${filePath}" -printer "${printerName}"
`;
    exec(command, {shell: "powershell.exe"}, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  });
});
