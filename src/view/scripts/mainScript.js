"use strict";

const toolbar = require("./toolbar");
const pageManager = require("./pages");

const $ = require("jquery");

const initApp = (fileName = false) => {
  toolbar.generateToolBar();
  generateWelcomeScreen();

  if (fileName) {
    const fileManager = require("./fileManager");
    fileManager.openSheet(fileName);
  }
};

const setWindowTitle = (title = "untitled") => {
  const name = require("../../../package.json").titleName;
  const version = require("../../../package.json").version;
  $("title").text(title + " - " + name + " - version " + version);
};

const generateWelcomeScreen = () => {
  setWindowTitle();

  const fileManager = require("./fileManager");

  $("#mainContent").empty();

  let addSheetDiv = $("<div>");
  addSheetDiv.addClass("welcomeScreenDiv");
  addSheetDiv.append("<img src='./img/addSheet.svg'></img>");
  addSheetDiv.append("Nouvelle page");
  addSheetDiv.click(() => {
    pageManager.createNewPage();
  });

  let openSheetDiv = $("<div>");
  openSheetDiv.addClass("welcomeScreenDiv");
  openSheetDiv.append("<img src='./img/open.svg'></img>");
  openSheetDiv.append("Ouvrir une feuille");
  openSheetDiv.click(() => {
    fileManager.openSheet();
  });

  $("#mainContent").append(addSheetDiv);
  $("#mainContent").append(openSheetDiv);
};

module.exports = {
  initApp,
  setWindowTitle,
};
