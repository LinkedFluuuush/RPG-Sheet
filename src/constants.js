"use strict";

const constants = {
  TOOLS: {
    POINTER: "pointer",
    EDIT: "edit",
    TEXTINPUT: "textInput",
    TEXTAREA: "textArea",
    CHECKBOX: "checkbox",
    REORGANIZE: "reorganize",
    ORDER: "order",
  },
  UNEDITABLE_CSS: [
    "top",
    "left",
    "position",
    "width",
    "height",
    "cursor",
    "outline-color",
    "outline-style",
    "outline-width",
    "font-size",
    "padding-top",
    "padding-left",
    "padding-right",
    "padding-bottom",
  ],
  MIN_AREA_SIZE: 12,
};

constants.INPUT_TYPES = [
  constants.TOOLS.TEXTINPUT,
  constants.TOOLS.TEXTAREA,
  constants.TOOLS.CHECKBOX,
];

module.exports = constants;
