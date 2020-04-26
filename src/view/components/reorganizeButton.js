"use strict";

const $ = require("jquery");
let constants = require("../../constants");
let toolBar = require("../scripts/toolbar");

const selfId = constants.TOOLS.REORGANIZE;

const getElement = () => {
  let elt = $("<button></button>");
  elt.attr("id", selfId);
  elt.attr("class", "toolbarButton");

  let icon = $("<img>");
  icon.prop("src", "./img/reorganize.svg");

  elt.append(icon);

  return elt;
};

const activate = () => {
  console.debug("Activating " + selfId);

  let overlay = $("<div>");
  overlay.css("position", "absolute");
  overlay.css("width", "100%");
  overlay.css("height", "100%");
  overlay.css("background-color", "rgba(0,0,0,0.5)");
  overlay.css("top", "0");
  overlay.css("left", "0");
  overlay.css("display", "flex");
  overlay.css("flex-direction", "column");

  let reorganizeDiv = $("<div>");
  reorganizeDiv.css("position", "relative");
  reorganizeDiv.css("margin", "auto auto 0 auto");
  reorganizeDiv.css("background-color", "white");
  reorganizeDiv.css("border", "black 1px solid");
  reorganizeDiv.css("width", "fit-content");
  reorganizeDiv.css("height", "30%");
  reorganizeDiv.css("padding", "1em");
  reorganizeDiv.css("display", "flex");

  generatePreviewPages(reorganizeDiv);

  let saveButton = $("<button>");
  saveButton.append("Save");
  saveButton.click(() => {
    overlay.remove();
    toolBar.setTool(constants.TOOLS.POINTER);
  });
  saveButton.css("margin", "10px auto auto auto");

  overlay.append(reorganizeDiv);
  overlay.append(saveButton);

  $("body").append(overlay);
};

const generatePreviewPages = (parentDiv) => {
  $(".pageContainer").each((idx, elt) => {
    let pagePreview = $("<div>");
    pagePreview.css("display", "flex");
    pagePreview.css("flex-direction", "column");
    pagePreview.css("margin", "10px");
    pagePreview.css("border", "black 1px solid");
    pagePreview.css("height", "90%");

    let pageImg = $("<img>");
    pageImg.prop("src", $(elt).find("img").prop("src"));
    pageImg.css("height", "90%");
    pageImg.css("width", "auto");

    let buttonDiv = $("<div>");
    buttonDiv.css("display", "flex");
    buttonDiv.css("margin", "auto");

    let buttonLeft = $("<button>");
    buttonLeft.append("<");
    buttonLeft.click(() => {
      let previousPage = $(elt).prev(".pageContainer");
      if (previousPage.length > 0) {
        $(elt).remove();
        previousPage.before(elt);
        parentDiv.empty();
        generatePreviewPages(parentDiv);
      }
    });

    let buttonDelete = $("<button>");
    buttonDelete.append("Delete page");
    buttonDelete.css("margin", "0 5px 0 5px");

    buttonDelete.click(() => {
      $(elt).remove();
      parentDiv.empty();
      generatePreviewPages(parentDiv);
    });

    let buttonRight = $("<button>");
    buttonRight.append(">");

    buttonRight.click(() => {
      let nextPage = $(elt).next(".pageContainer");
      if (nextPage.length > 0) {
        $(elt).remove();
        nextPage.after(elt);
        parentDiv.empty();
        generatePreviewPages(parentDiv);
      }
    });

    buttonDiv.append(buttonLeft);
    buttonDiv.append(buttonDelete);
    buttonDiv.append(buttonRight);

    pagePreview.append(pageImg);
    pagePreview.append(buttonDiv);

    parentDiv.append(pagePreview);
  });
};

const deactivate = () => {
  console.debug("Deactivating " + selfId);
};

module.exports = {
  getElement,
  activate,
  deactivate,
};
