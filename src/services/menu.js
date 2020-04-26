"use strict";

const { app, Menu } = require("electron");
const isMac = process.platform === "darwin";

const createMenu = () => {
  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" }
            ]
          }
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: "Fichier",
      submenu: [
        {
          label: "New",
          accelerator: "CommandOrControl+N",
          click: (menuItem, window) => {
            console.debug("Requested new sheet");
            let code = `require('./scripts/fileManager.js').newSheet();`;
            window.webContents.executeJavaScript(code);
          }
        },
        {
          label: "Open",
          accelerator: "CommandOrControl+O",
          click: (menuItem, window) => {
            console.debug("Requested open sheet");
            let code = `require('./scripts/fileManager.js').openSheet();`;
            window.webContents.executeJavaScript(code);
          }
        },
        { role: "recentDocuments" },
        { role: "clearRecentDocuments" },
        { type: "separator" },
        {
          label: "Save",
          accelerator: "CommandOrControl+S",
          click: (menuItem, window) => {
            console.debug("Requested save sheet");
            let code = `require('./scripts/fileManager.js').saveSheet();`;
            window.webContents.executeJavaScript(code);
          }
        },
        {
          label: "Save As",
          accelerator: "CommandOrControl+Shift+S",
          click: (menuItem, window) => {
            console.debug("Requested save as sheet");
            let code = `require('./scripts/fileManager.js').saveSheetAs();`;
            window.webContents.executeJavaScript(code);
          }
        },
        {
          label: "Save As Template",
          click: (menuItem, window) => {
            console.debug("Requested save as template sheet");
            let code = `require('./scripts/fileManager.js').saveSheetAsTemplate();`;
            window.webContents.executeJavaScript(code);
          }
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" }
      ]
    },
    // { role: 'editMenu' }
    {
      label: "Edition",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" }
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }])
      ]
    },
    // { role: 'windowMenu' }
    {
      label: "Fenêtre",
      submenu: [
        { role: "minimize" },
        { role: "togglefullscreen" },
        ...(isMac
          ? [
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" }
            ]
          : [])
      ]
    },
    // { role: 'helpMenu' }
    {
      label: "Aide",
      submenu: [
        {
          label: "A propos",
          click: (menuItem, window) => {
            let code = `alert('Icons made by Pixel perfect from www.flaticon.com');`;
            window.webContents.executeJavaScript(code);
          }
        }
      ]
    },
    // { role: 'devMenu' }
    {
      label: "Develop",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
};

module.exports = {
  createMenu
};
