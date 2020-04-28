"use strict";

const $ = require("jquery");
const constants = require("../../constants");

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
      newElement = $("<input>");
      newElement.prop("type", "text");

      if (value) {
        newElement.val(value);
      }
      break;
    case constants.TOOLS.TEXTAREA:
      newElement = $("<textArea>");

      if (value) {
        newElement.text(value);
      }
      break;
    case constants.TOOLS.CHECKBOX:
      newElement = $("<input>");
      newElement.prop("type", "checkbox");

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
      if (!constants.UNEDITABLE_CSS.includes(cssElt)) {
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

        if (newCSSElt.prop) {
          additionalCSSArray.push(newCSSElt);
        }
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

  if (type === constants.TOOLS.TEXTINPUT) {
    newElement.css("font-size", newElement.height() * 0.9);
  }

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
  return $(elt).prop("tagName").toLowerCase() === "textarea"
    ? constants.TOOLS.TEXTAREA
    : $(elt).prop("type") === "checkbox"
    ? constants.TOOLS.CHECKBOX
    : constants.TOOLS.TEXTINPUT;
};

module.exports = {
  addComponent,
  calculatePercentPosition,
  calculatePercentSize,
  getAdditionalCSS,
  getType,
};
