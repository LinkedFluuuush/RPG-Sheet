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
              { role: "quit" },
            ],
          },
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
            newAction(window);
          },
        },
        {
          label: "Open",
          accelerator: "CommandOrControl+O",
          click: (menuItem, window) => {
            openAction(window);
          },
        },
        { role: "recentDocuments" },
        { role: "clearRecentDocuments" },
        { type: "separator" },
        {
          label: "Save",
          accelerator: "CommandOrControl+S",
          click: (menuItem, window) => {
            saveAction(window);
          },
        },
        {
          label: "Save As",
          accelerator: "CommandOrControl+Shift+S",
          click: (menuItem, window) => {
            saveAsAction(window);
          },
        },
        {
          label: "Save As Template",
          click: (menuItem, window) => {
            saveAsTemplateAction(window);
          },
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
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
              { role: "selectAll" },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
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
              { role: "window" },
            ]
          : []),
      ],
    },
    ...(app.isPackaged
      ? []
      : [
          // { role: 'devMenu' }
          {
            label: "Develop",
            submenu: [
              { role: "reload" },
              { role: "forcereload" },
              { role: "toggledevtools" },
            ],
          },
        ]),
  ];

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
};

const saveAction = (window) => {
  console.debug("Requested save sheet");
  let code = `require('./scripts/fileManager.js').saveSheet();`;
  window.webContents.executeJavaScript(code);
};

const saveAsAction = (window) => {
  console.debug("Requested save as sheet");
  let code = `require('./scripts/fileManager.js').saveSheetAs();`;
  window.webContents.executeJavaScript(code);
};

const saveAsTemplateAction = (window) => {
  console.debug("Requested save as template sheet");
  let code = `require('./scripts/fileManager.js').saveSheetAsTemplate();`;
  window.webContents.executeJavaScript(code);
};

const newAction = (window) => {
  console.debug("Requested new sheet");
  let code = `require('./scripts/fileManager.js').newSheet();`;
  window.webContents.executeJavaScript(code);
};

const openAction = (window, file = false) => {
  console.debug("Requested open sheet");
  let code = "require('./scripts/fileManager.js').openSheet(";
  if (file) {
    code += `'${file}'`;
  }
  code += ");";
  window.webContents.executeJavaScript(code);
};

module.exports = {
  createMenu,
};
