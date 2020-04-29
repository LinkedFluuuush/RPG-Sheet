"use strict";

const $ = require("jquery");
let constants = require("../../constants");

const selfId = constants.TOOLS.POINTER;

const getElement = () => {
  let elt = $("<button>");
  elt.prop("id", selfId);
  elt.prop("class", "toolbarButton");
  elt.prop(
    "title",
    "Default tool (P)\nEnables sheet viewing and character edition"
  );

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
  deactivate,
};
