"use strict";

const $ = require("jquery");
let constants = require("../../constants");
let helper = require("./helper");

const selfId = constants.TOOLS.TEXTINPUT;

const getElement = () => {
  let elt = $("<button></button>");
  elt.attr("id", selfId);
  elt.attr("class", "toolbarButton");
  elt.prop("title", "Text Input tool (T)\nAdd one-line text inputs");

  let icon = $("<img>");
  icon.prop("src", "./img/textinput.svg");

  elt.append(icon);

  return elt;
};

const activate = () => {
  console.debug("Activating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/textinputActivate.svg");
  helper.handleComponentAdding(selfId);
};

const deactivate = () => {
  console.debug("Deactivating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/textinput.svg");
  $(".pageContainer").css("cursor", "");
  $(".pageContainer").off("mousedown");
  $(".pageContainer").off("mousemove");
  $(".pageContainer").off("mouseup");
};

module.exports = {
  getElement,
  activate,
  deactivate,
};
