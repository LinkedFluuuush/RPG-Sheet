"use strict";

const toolbar = require("./toolbar");

const $ = require("jquery");

const initApp = () => {
  toolbar.generateToolBar();
  generateWelcomeScreen();
};

const setWindowTitle = (title = "untitled") => {
  const name = require("../../../package.json").productName;
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
  addSheetDiv.click(require("../components/addPageButton").activate);

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
