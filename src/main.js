"use strict";

const { handleSquirrelEvent } = require("./handleSquirrelInstall");

if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

const { app, BrowserWindow } = require("electron");
let win;

const { createMenu } = require("./services/menu");

let fileToOpen = null;

// Attempt to bind file opening #2
app.on("will-finish-launching", () => {
  // Event fired When someone drags files onto the icon while your app is running
  app.on("open-file", (event, file) => {
    console.log("Requested file open : " + file);
    if (win && app.isReady()) {
      if (win.webContents.isLodaing()) {
        win.webContents.on("did-finish-load", () => {
          win.webContents.send("response-opened-file", fileToOpen);
        });
      } else {
        win.webContents.send("response-opened-file", fileToOpen);
      }
    } else {
      fileToOpen = file;
    }
    event.preventDefault();
  });
});

function createWindow() {
  // Cree la fenetre du navigateur.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      plugins: true,
    },
  });

  createMenu();

  console.log(
    "Application launched with arguments : " + JSON.stringify(process.argv)
  );

  if (app.isPackaged) {
    console.log("Running in prod env");
    if (process.argv.length > 1) {
      fileToOpen = process.argv[1];
    }
  } else {
    console.log("Running in dev env");
    if (process.argv.length > 2) {
      fileToOpen = process.argv[2];
    }
  }

  // et charger le fichier index.html de l'application.
  win.loadFile("./src/view/index.html");
}

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quand cet événement est émis.
app.whenReady().then(createWindow);

// Quitter si toutes les fenêtres ont été fermées.
app.on("window-all-closed", () => {
  app.quit();
});

// Dans ce fichier, vous pouvez inclure le reste de votre code spécifique au processus principal. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.

// In some file from the main process
// like main.js
const { ipcMain } = require("electron");

// Attach listener in the main process with the given ID
ipcMain.on("request-opened-file", (event) => {
  event.reply("response-opened-file", fileToOpen);
});
