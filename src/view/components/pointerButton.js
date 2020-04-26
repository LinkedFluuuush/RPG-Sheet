"use strict";

const $ = require("jquery");
let constants = require("../../constants");

const selfId = constants.TOOLS.POINTER;

const getElement = () => {
  let elt = $("<button>");
  elt.attr("id", selfId);
  elt.attr("class", "toolbarButton");

  let icon = $("<img>");
  icon.prop("src", "./img/cursor.svg");

  elt.append(icon);

  return elt;
};

const activate = () => {
  console.debug("Activating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/cursorActivate.svg");
};

const deactivate = () => {
  console.debug("Dectivating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/cursor.svg");
};

module.exports = {
  getElement,
  activate,
  deactivate
};
