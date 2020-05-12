"use strict";

const { handleSquirrelEvent } = require("./handleSquirrelInstall");

if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

const { app, BrowserWindow } = require("electron");
let win;

const { createMenu } = require("./services/menu");
const { handleAutoUpdate } = require("./services/autoUpdate");
// require("update-electron-app")();

let fileToOpen = null;
let readyToReceive = false;

// Attempt to bind file opening
app.on("will-finish-launching", () => {
  // Event fired When someone drags files onto the icon while your app is running
  app.on("open-file", (event, file) => {
    console.log("Requested file open : " + file);
    if (win && readyToReceive) {
      console.log("Sending directly");
      win.webContents.send("response-opened-file", file);
    } else {
      console.log("Buffering for when app is ready");
      fileToOpen = file;
    }
    event.preventDefault();
  });
});

function createWindow() {
  handleAutoUpdate().then((hasUpdated) => {
    console.log("Update handled");
    if (!hasUpdated) {
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
    } else {
      console.log("Updated, will launch updated version...");
    }

    // Quitter si toutes les fenêtres ont été fermées.
    app.on("window-all-closed", () => {
      app.quit();
    });
  });
}

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quand cet événement est émis.
app.whenReady().then(createWindow);

// Quitter si toutes les fenêtres ont été fermées.
app.on("window-all-closed", () => {
  // app.quit();
});

// Dans ce fichier, vous pouvez inclure le reste de votre code spécifique au processus principal. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.

// In some file from the main process
// like main.js
const { ipcMain } = require("electron");

// Attach listener in the main process with the given ID
ipcMain.on("request-opened-file", (event) => {
  readyToReceive = true;
  event.reply("response-opened-file", fileToOpen);
});
