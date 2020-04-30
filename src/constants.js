"use strict";

const constants = {
  TOOLS: {
    POINTER: "pointer",
    EDIT: "edit",
    TEXTINPUT: "textInput",
    TEXTAREA: "textArea",
    CHECKBOX: "checkbox",
    REORGANIZE: "reorganize",
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
  ],
  MIN_AREA_SIZE: 12,
};

module.exports = constants;
