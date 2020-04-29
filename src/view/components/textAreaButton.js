"use strict";

const $ = require("jquery");
let constants = require("../../constants");
let helper = require("./helper");

const selfId = constants.TOOLS.TEXTAREA;

const getElement = () => {
  let elt = $("<button></button>");
  elt.attr("id", selfId);
  elt.attr("class", "toolbarButton");
  elt.prop("title", "Text Area tool (Ctrl+T)\nAdd multi-line text inputs");

  let icon = $("<img>");
  icon.prop("src", "./img/textarea.svg");

  elt.append(icon);

  return elt;
};

const activate = () => {
  console.debug("Activating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/textareaActivate.svg");
  helper.handleComponentAdding(selfId);
};

const deactivate = () => {
  console.debug("Deactivating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/textarea.svg");
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
