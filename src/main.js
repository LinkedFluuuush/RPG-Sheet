"use strict";

const { handleSquirrelEvent } = require("./handleSquirrelInstall");

if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

const { app, BrowserWindow } = require("electron");
let win;

const { createMenu } = require("./services/menu");

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
