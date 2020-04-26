"use strict";

const $ = require("jquery");
let constants = require("../../constants");
let pageManager = require("../scripts/pages");
let toolBar = require("../scripts/toolbar");

const selfId = constants.TOOLS.ADDPAGE;

const getElement = () => {
  let elt = $("<button></button>");
  elt.attr("id", selfId);
  elt.attr("class", "toolbarButton");
  let icon = $("<img>");
  icon.prop("src", "./img/addSheet.svg");

  elt.append(icon);

  return elt;
};

const activate = () => {
  console.debug("Activating " + selfId);
  pageManager.createNewPage().then(() => {
    $('.welcomeScreenDiv').remove();
  });
  toolBar.setTool(constants.TOOLS.POINTER);
};

const deactivate = () => {
  console.debug("Deactivating " + selfId);
};

module.exports = {
  getElement,
  activate,
  deactivate
};
