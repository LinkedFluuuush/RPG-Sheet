"use strict";

const $ = require("jquery");
const constants = require("../../constants");
const zoomManager = require("./zoom");

const calculatePercentPosition = (page, position) => {
  return {
    x: Math.round((position.x / $(page).width()) * 10000) / 100,
    y: Math.round((position.y / $(page).height()) * 10000) / 100,
  };
};

const calculatePercentSize = (page, size) => {
  return {
    width: Math.round((size.width / $(page).width()) * 10000) / 100,
    height: Math.round((size.height / $(page).height()) * 10000) / 100,
  };
};

const addComponent = (
  type,
  page,
  position,
  size,
  value = false,
  order = 0,
  additionalCSS = []
) => {
  let newElement;

  console.debug(
    "Trying to place " +
      type +
      " at page " +
      page +
      " - " +
      JSON.stringify(position) +
      " - size " +
      JSON.stringify(size)
  );

  switch (type) {
    case constants.TOOLS.TEXTINPUT:
      newElement = $("<textArea>");
      newElement.prop("sheet.elementType", constants.TOOLS.TEXTINPUT);
      newElement.addClass("unscrollable");
      newElement.addClass(constants.TOOLS.TEXTINPUT);

      newElement.on("input", textInputAutoSize);

      if (value) {
        newElement.text(value);
      }
      break;
    case constants.TOOLS.TEXTAREA:
      newElement = $("<textArea>");
      newElement.prop("sheet.elementType", constants.TOOLS.TEXTAREA);
      newElement.addClass(constants.TOOLS.TEXTAREA);

      newElement.on("input", textAreaAutoSize);

      if (value) {
        newElement.text(value);
      }
      break;
    case constants.TOOLS.CHECKBOX:
      newElement = $("<input>");
      newElement.prop("sheet.elementType", constants.TOOLS.CHECKBOX);
      newElement.prop("type", "checkbox");
      newElement.addClass(constants.TOOLS.CHECKBOX);

      if (value) {
        newElement.prop("checked", true);
      }
      break;

    default:
      console.warn("Not a valid component : " + type);
      return false;
  }

  newElement.css("position", "absolute");
  newElement.css("top", position.y + "%");
  newElement.css("left", position.x + "%");
  newElement.css("width", size.width + "%");
  newElement.css("height", size.height + "%");

  newElement.prop("tabindex", order);

  if (typeof additionalCSS === "string") {
    let cssLines = additionalCSS.split("\n");

    let additionalCSSArray = [];
    for (let cssElt of cssLines) {
      let newCSSElt = {
        prop: cssElt.split(": ", 2)[0],
        value: cssElt.split(": ", 2)[1],
      };

      if (newCSSElt.value && newCSSElt.value.endsWith(";")) {
        newCSSElt.value = newCSSElt.value.substring(
          0,
          newCSSElt.value.length - 1
        );
      }

      if (
        newCSSElt.prop &&
        !constants.UNEDITABLE_CSS.includes(newCSSElt.prop)
      ) {
        console.debug("Adding CSS " + newCSSElt.prop);
        additionalCSSArray.push(newCSSElt);
      }
    }

    additionalCSS = additionalCSSArray;
  }

  for (let cssProp of additionalCSS) {
    if (!constants.UNEDITABLE_CSS.includes(cssProp.prop)) {
      newElement.css(cssProp.prop, cssProp.value);
    }
  }

  $(page).append(newElement);
  return newElement;
};

const getAdditionalCSS = (elt) => {
  let additionalCSS = [];
  for (let cssElt of elt.style) {
    if (!constants.UNEDITABLE_CSS.includes(cssElt)) {
      additionalCSS.push({
        prop: cssElt,
        value: elt.style[cssElt],
      });
    }
  }

  return additionalCSS;
};

const getType = (elt) => {
  return $(elt).prop("sheet.elementType")
    ? $(elt).prop("sheet.elementType")
    : $(elt).prop("tagName").toLowerCase() === "textarea"
    ? constants.TOOLS.TEXTAREA
    : $(elt).prop("type") === "checkbox"
    ? constants.TOOLS.CHECKBOX
    : constants.TOOLS.TEXTINPUT;
};

const textInputAutoSize = (event) => {
  let target = event.target;
  $(target).val($(target).val().replace("\n", ""));
  zoomManager.updateInputFontSize(target);
};

const textAreaAutoSize = (event) => {
  let target = event.target;
  zoomManager.updateInputFontSize(target, constants.MIN_AREA_SIZE);
};

module.exports = {
  addComponent,
  calculatePercentPosition,
  calculatePercentSize,
  getAdditionalCSS,
  getType,
  textInputAutoSize,
};
