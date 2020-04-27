"use strict";

const settings = require("./settings");
let constants = require("../../constants");
const $ = require("jquery");

const setTool = (tool) => {
  console.debug("Setting " + tool + " instead of " + settings.currentTool);
  if (settings.currentTool) {
    let previousToolClass = require("../components/" +
      settings.currentTool +
      "Button");
    previousToolClass.deactivate ? previousToolClass.deactivate() : null;
  }
  settings.currentTool = tool;
  $(".toolbarButton").removeAttr("disabled");
  let newToolClass = require("../components/" +
    settings.currentTool +
    "Button");
  newToolClass.activate ? newToolClass.activate() : null;
};

const generateToolBar = () => {
  let toolBar = $("#menuBar");
  toolBar.empty();
  for (let elt in constants.TOOLS) {
    let eltClass = require("../components/" + constants.TOOLS[elt] + "Button");
    let newButton = eltClass.getElement();
    newButton.click(() => {
      setTool(constants.TOOLS[elt]);
    });
    toolBar.append(newButton);
  }

  setTool(constants.TOOLS.POINTER);
};

module.exports = {
  setTool,
  generateToolBar,
};
