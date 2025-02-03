import fs from "fs";
import path from "path";
import {exec} from "child_process";

export function currentTime() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const dateString = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
  const timeString = `${String(hours).padStart(2, "0")}h_${String(minutes).padStart(2, "0")}m_${String(seconds).padStart(2, "0")}s`;

  const dateTimeString = `${dateString}-${timeString}`;

  return dateTimeString;
}

export async function updatePrinterRegistry(printerName: string) {
  const hexFilePath = path.join(process.cwd(), "powershell", "preferences-hex.txt");
  const printerHexValue = `hex:${fs.readFileSync(hexFilePath, "utf8").trim()}`;

  const regContent = `Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\\Printers\\DevModes2]
"${printerName}"=${printerHexValue}

[HKEY_CURRENT_USER\\Printers\\DevModePerUser]
"${printerName}"=${printerHexValue}`;

  const regFilePath = path.join(process.cwd(), "powershell", "CurrentPrinterSettings.reg");
  fs.writeFileSync(regFilePath, regContent);

  return new Promise<void>((resolve, reject) => {
    const importCommand = `reg import "${regFilePath}"`;
    exec(importCommand, {shell: "powershell.exe"}, (error, _, stderr) => {
      if (error) {
        reject(new Error(`Failed to import registry settings: ${error.message}`));
        return;
      }
      resolve();
    });
  });
}

export function getCP1500Printer(): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = `powershell -NoProfile -NonInteractive -WindowStyle Hidden -Command "(Get-Printer | Where Name -like '*CP1500*').Name"`;

    exec(command, {shell: "powershell.exe"}, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(new Error(stderr));
        return;
      }
      const printerName = stdout.trim();
      if (!printerName) {
        reject(new Error("No CP1500 printer found"));
        return;
      }
      resolve(printerName);
    });
  });
}
