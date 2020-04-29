"use strict";

const $ = require("jquery");
let constants = require("../../constants");
let helper = require("./helper");

const selfId = constants.TOOLS.CHECKBOX;

const getElement = () => {
  let elt = $("<button></button>");
  elt.attr("id", selfId);
  elt.attr("class", "toolbarButton");
  elt.prop("title", "Checkbox tool (C)\nAdd checkboxes");

  let icon = $("<img>");
  icon.prop("src", "./img/checkbox.svg");

  elt.append(icon);

  return elt;
};

const activate = () => {
  console.debug("Activating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/checkboxActivate.svg");
  helper.handleComponentAdding(selfId);
};

const deactivate = () => {
  console.debug("Deactivating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/checkbox.svg");
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
