"use strict";

const $ = require("jquery");
let constants = require("../../constants");

const selfId = constants.TOOLS.EDIT;
let openedOptionsDiv;

const getElement = () => {
  let elt = $("<button></button>");
  elt.attr("id", selfId);
  elt.attr("class", "toolbarButton");

  let icon = $("<img>");
  icon.prop("src", "./img/edit.svg");

  elt.append(icon);

  return elt;
};

const activate = () => {
  console.debug("Activating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/editActivate.svg");
  $(".pageContainer input,textarea").css("cursor", "default");
  $(".pageContainer input,textarea").css("outline", "red 2px solid");

  $(".pageContainer input,textarea").mousedown(event => {
    event.preventDefault();
  });

  $(".pageContainer input,textarea").click(clickFunction);
};

const clickFunction = (event) => {
  event.preventDefault();
  if (openedOptionsDiv) {
    openedOptionsDiv.remove();
    $(".pageContainer input,textarea").css("outline", "red 2px solid");
  }

  $(event.target).css("outline", "blue 2px solid");
  openedOptionsDiv = createOptionsDiv(event.target);
  $(event.target)
    .parent()
    .append(openedOptionsDiv);
}

const deactivate = () => {
  console.debug("Deactivating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/edit.svg");
  $(".pageContainer input,textarea").css("cursor", "");
  $(".pageContainer input,textarea").css("outline", "");

  $(".pageContainer input,textarea").off("mousedown");
  $(".pageContainer input,textarea").off("click");

  $(".optionsDiv").remove();
};

const createOptionsDiv = target => {
  let optionsDiv = $("<div>");
  optionsDiv.prop("class", "optionsDiv");
  optionsDiv.css("top", $(target).position().top + $(target).height() + 30);
  optionsDiv.css("left", $(target).position().left);

  let hPositionInput = $("<input>");
  hPositionInput.prop("type", "number");
  hPositionInput.val(
    Number(target.style.left.substring(0, target.style.left.length - 1)) * 100
  );
  hPositionInput.change(() => {
    $(target).css("left", hPositionInput.val() / 100 + "%");
  });

  let vPositionInput = $("<input>");
  vPositionInput.prop("type", "number");
  vPositionInput.val(
    Number(target.style.top.substring(0, target.style.top.length - 1)) * 100
  );
  vPositionInput.change(() => {
    $(target).css("top", vPositionInput.val() / 100 + "%");
  });

  let positionDiv = $("<div>");

  positionDiv.append("Position : h : ");
  positionDiv.append(hPositionInput);
  positionDiv.append(" / v : ");
  positionDiv.append(vPositionInput);

  let hSizeInput = $("<input>");
  hSizeInput.prop("type", "number");
  hSizeInput.val(
    Number(target.style.width.substring(0, target.style.width.length - 1)) * 100
  );
  hSizeInput.change(() => {
    $(target).css("width", hSizeInput.val() / 100 + "%");
  });

  let vSizeInput = $("<input>");
  vSizeInput.prop("type", "number");
  vSizeInput.val(
    Number(target.style.height.substring(0, target.style.height.length - 1)) *
      100
  );
  vSizeInput.change(() => {
    $(target).css("height", vSizeInput.val() / 100 + "%");
  });

  let sizeDiv = $("<div>");

  sizeDiv.append("Size : h : ");
  sizeDiv.append(hSizeInput);
  sizeDiv.append(" / v : ");
  sizeDiv.append(vSizeInput);

  let orderInput = $("<input>");
  orderInput.prop("type", "number");
  orderInput.val($(target).prop("tabindex"));
  orderInput.change(() => {
    $(target).prop("tabindex", orderInput.val());
  });

  let orderDiv = $("<div>");

  orderDiv.append("Field order in sheet : ");
  orderDiv.append(orderInput);

  let cssDiv = $("<div>");

  let cssString = "";
  let previousCSSFields = [];

  for (let cssElt of target.style) {
    if (!constants.UNEDITABLE_CSS.includes(cssElt)) {
      cssString += cssElt + ": " + target.style[cssElt] + ";\n";
      previousCSSFields.push(cssElt);
    }
  }

  let cssText = $("<textarea>");
  cssText.text(cssString);
  cssText.css("resize", "auto");
  cssText.css("width", "100%");
  cssText.css("height", "10em");
  cssText.change(() => {
    let newCSSLines = cssText.val().split("\n");

    let newCSSProps = newCSSLines.map(elt => {
      let eltClean = elt.endsWith(";") ? elt.substring(0, elt.length - 1) : elt;

      return {
        prop: eltClean.split(": ", 2)[0],
        value: eltClean.split(": ", 2)[1]
      };
    });

    for (let oldProp of previousCSSFields) {
      $(target).css(oldProp, "");
    }

    for (let newProp of newCSSProps) {
      if (
        newProp.prop &&
        newProp.value &&
        !constants.UNEDITABLE_CSS.includes(newProp.prop)
      ) {
        console.debug("setting " + newProp.prop + " to " + newProp.value);
        $(target).css(newProp.prop, newProp.value);
      }
    }
  });

  cssDiv.append("<div>Custom CSS</div>");
  cssDiv.append(cssText);

  let buttonsDiv = $("<div>");
  let deleteButton = $("<button>");
  deleteButton.text("Delete");
  deleteButton.click(() => {
    $(target).remove();
    optionsDiv.remove();
  });

  let saveButton = $("<button>");
  saveButton.text("Save");
  saveButton.click(() => {
    optionsDiv.remove();
  });
  buttonsDiv.append(deleteButton);
  buttonsDiv.append(saveButton);

  optionsDiv.append(positionDiv);
  optionsDiv.append(sizeDiv);
  optionsDiv.append(orderDiv);
  optionsDiv.append(cssDiv);
  optionsDiv.append(buttonsDiv);

  return optionsDiv;
};

module.exports = {
  getElement,
  activate,
  deactivate
};
