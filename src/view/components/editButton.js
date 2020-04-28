"use strict";

const $ = require("jquery");
let constants = require("../../constants");
let components = require("../scripts/components");
let helper = require("./helper");
const remote = require("electron").remote;

const selfId = constants.TOOLS.EDIT;

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

  $(".pageContainer input,textarea").mousedown((event) => {
    event.preventDefault();
  });

  $(".pageContainer input,textarea").click(clickFunction);
};

const clickFunction = (event) => {
  event.preventDefault();
  closeOptionsDiv();
  $(".pageContainer input,textarea").css("outline", "red 2px solid");

  $(event.target).css("outline", "blue 2px solid");

  let placeOnTop = false;
  if (event.screenY > window.innerHeight / 2) {
    placeOnTop = true;
  }
  initKeyboardShortcuts(event.target);
  $("body").append(createOptionsDiv(event.target, placeOnTop));
  createOrderDiv(event.target);
};

const deactivate = () => {
  console.debug("Deactivating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/edit.svg");
  $(".pageContainer input,textarea").css("cursor", "");
  $(".pageContainer input,textarea").css("outline", "");

  $(".pageContainer input,textarea").off("mousedown");
  $(".pageContainer input,textarea").off("click");

  closeOptionsDiv();
};

const closeOptionsDiv = () => {
  $(window).off("keydown", keyBoardShortcutsEvent);
  $(".optionsDiv").remove();
  $("#orderCorner").remove();
};

const deleteTarget = (target) => {
  $(target).remove();
  closeOptionsDiv();
};

const copyTarget = (target) => {
  helper.handleComponentCopying(target, () => {
    deactivate();
    activate();
  });
  closeOptionsDiv();
};

const saveTarget = (target) => {
  updatePosition(target);
  updateOrder(target);
  updateCSS(target);
  closeOptionsDiv(target);
};

const moveTarget = (target, direction, step = 5) => {
  switch (direction.toLowerCase()) {
    case "up":
      $("#vPosition").val(Number($("#vPosition").val()) - step);
      break;
    case "down":
      $("#vPosition").val(Number($("#vPosition").val()) + step);
      break;
    case "left":
      $("#hPosition").val(Number($("#hPosition").val()) - step);
      break;
    case "right":
      $("#hPosition").val(Number($("#hPosition").val()) + step);
      break;
  }

  updatePosition(target);
};

const resizeTarget = (target, direction, step = 5) => {
  switch (direction.toLowerCase()) {
    case "up":
      $("#vSize").val(Number($("#vSize").val()) - step);
      break;
    case "down":
      $("#vSize").val(Number($("#vSize").val()) + step);
      break;
    case "left":
      $("#hSize").val(Number($("#hSize").val()) - step);
      break;
    case "right":
      $("#hSize").val(Number($("#hSize").val()) + step);
      break;
  }

  updatePosition(target);
};

const updatePosition = (target) => {
  $(target).css("left", $("#hPosition").val() / 100 + "%");
  $(target).css("top", $("#vPosition").val() / 100 + "%");
  $(target).css("width", $("#hSize").val() / 100 + "%");
  $(target).css("height", $("#vSize").val() / 100 + "%");

  let topRightCornerPosition = {
    x: (Number($("#hPosition").val()) + Number($("#hSize").val())) / 100,
    y: $("#vPosition").val() / 100,
  };

  $("#orderCorner").css("top", topRightCornerPosition.y + "%");
  $("#orderCorner").css("left", topRightCornerPosition.x + "%");
};

const updateOrder = (target) => {
  $(target).prop("tabindex", $("#order").val());
};

const updateCSS = (target) => {
  let newCSSLines = $("#cssText").val().split("\n");

  let newCSSProps = newCSSLines.map((elt) => {
    let eltClean = elt.endsWith(";") ? elt.substring(0, elt.length - 1) : elt;

    return {
      prop: eltClean.split(": ", 2)[0],
      value: eltClean.split(": ", 2)[1],
    };
  });

  let previousCSSFields = [];

  for (let cssElt of target.style) {
    if (!constants.UNEDITABLE_CSS.includes(cssElt)) {
      previousCSSFields.push(cssElt);
    }
  }

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
};

const changeComponentType = (target) => {
  let additionalCSS = components.getAdditionalCSS(target);

  components.addComponent(
    $("#fieldTypeSelect").val(),
    $(target).parent(),
    {
      x: target.style.left.substring(0, target.style.left.length - 1),
      y: target.style.top.substring(0, target.style.top.length - 1),
    },
    {
      width: target.style.width.substring(0, target.style.width.length - 1),
      height: target.style.height.substring(0, target.style.height.length - 1),
    },
    $(target).val(),
    $(target).prop("tabindex"),
    additionalCSS
  );

  deleteTarget();
  deactivate();
  activate();
};

const keyBoardShortcutsEvent = (event) => {
  let hotkey =
    remote.process.platform === "darwin" ? event.metaKey : event.ctrlKey;
  let target = event.data;

  const handleDirectionEvent = (target, event, direction) => {
    event.preventDefault();
    let step = 5;
    if (hotkey) {
      step = 20;
    }

    if (event.altKey) {
      step = 1;
    }

    if (event.shiftKey) {
      resizeTarget(target, direction, step);
    } else {
      moveTarget(target, direction, step);
    }
  };

  if (
    !$(".optionsDiv").has(event.target).length &&
    $(event.target).prop("id") !== "cornerOrderInput"
  ) {
    switch (event.code) {
      case "Delete":
        deleteTarget(target);
        break;
      case "KeyC":
        if (hotkey) {
          copyTarget(target);
        }
        break;
      case "ArrowLeft":
        handleDirectionEvent(target, event, "left");
        break;
      case "ArrowRight":
        handleDirectionEvent(target, event, "right");
        break;
      case "ArrowUp":
        handleDirectionEvent(target, event, "up");
        break;
      case "ArrowDown":
        handleDirectionEvent(target, event, "down");
        break;
    }
  }

  switch (event.code) {
    case "Escape":
      saveTarget(target);
      break;
  }
};

const initKeyboardShortcuts = (target) => {
  $(window).on("keydown", target, keyBoardShortcutsEvent);
};

const createOptionsDiv = (target, topWindow = false) => {
  let optionsDiv = $("<div>");
  optionsDiv.prop("class", "optionsDiv");

  if (topWindow) {
    optionsDiv.css("top", "5%");
    optionsDiv.css("bottom", "");
  } else {
    optionsDiv.css("top", "");
    optionsDiv.css("bottom", "5%");
  }

  const getPositionDiv = () => {
    let hPositionInput = $("<input>");
    hPositionInput.prop("type", "number");
    hPositionInput.prop("id", "hPosition");

    hPositionInput.val(
      Number(target.style.left.substring(0, target.style.left.length - 1)) * 100
    );
    hPositionInput.change(() => {
      updatePosition(target);
    });

    let vPositionInput = $("<input>");
    vPositionInput.prop("type", "number");
    vPositionInput.prop("id", "vPosition");

    vPositionInput.val(
      Number(target.style.top.substring(0, target.style.top.length - 1)) * 100
    );
    vPositionInput.change(() => {
      updatePosition(target);
    });

    let positionDiv = $("<div>");

    positionDiv.append("Position : h : ");
    positionDiv.append(hPositionInput);
    positionDiv.append(" / v : ");
    positionDiv.append(vPositionInput);

    return positionDiv;
  };

  const getSizeDiv = () => {
    let hSizeInput = $("<input>");
    hSizeInput.prop("type", "number");
    hSizeInput.prop("id", "hSize");

    hSizeInput.val(
      Number(target.style.width.substring(0, target.style.width.length - 1)) *
        100
    );
    hSizeInput.change(() => {
      updatePosition(target);
    });

    let vSizeInput = $("<input>");
    vSizeInput.prop("type", "number");
    vSizeInput.prop("id", "vSize");

    vSizeInput.val(
      Number(target.style.height.substring(0, target.style.height.length - 1)) *
        100
    );
    vSizeInput.change(() => {
      updatePosition(target);
    });

    let sizeDiv = $("<div>");

    sizeDiv.append("Size : h : ");
    sizeDiv.append(hSizeInput);
    sizeDiv.append(" / v : ");
    sizeDiv.append(vSizeInput);

    return sizeDiv;
  };

  const getOrderDiv = () => {
    let orderInput = $("<input>");
    orderInput.prop("type", "number");
    orderInput.prop("id", "order");
    orderInput.val($(target).prop("tabindex"));
    orderInput.change(() => {
      $("#cornerOrderInput").val(orderInput.val());
      updateOrder(target);
    });

    let orderDiv = $("<div>");

    orderDiv.append("Field order in sheet : ");
    orderDiv.append(orderInput);

    return orderDiv;
  };

  const getCSSDiv = () => {
    let cssDiv = $("<div>");

    let additionalCSS = components.getAdditionalCSS(target);
    let cssString = "";

    additionalCSS.forEach((elt) => {
      cssString += elt.prop + ": " + elt.value + ";\n";
    });

    let cssText = $("<textarea>");
    cssText.prop("id", "cssText");
    cssText.text(cssString);
    cssText.css("resize", "auto");
    cssText.css("width", "100%");
    cssText.css("height", "10em");
    cssText.change(() => {
      updateCSS(target);
    });

    cssDiv.append("<div>Custom CSS</div>");
    cssDiv.append(cssText);

    return cssDiv;
  };

  const getFieldTypeDiv = () => {
    let fieldTypeDiv = $("<div>");
    let fieldTypeSelect = $("<select>");
    fieldTypeSelect.prop("id", "fieldTypeSelect");
    let currentFieldType = components.getType(target);

    let availableCompTypes = [
      constants.TOOLS.TEXTINPUT,
      constants.TOOLS.TEXTAREA,
      constants.TOOLS.CHECKBOX,
    ];

    availableCompTypes.forEach((elt) => {
      fieldTypeSelect.append(
        "<option value='" +
          elt +
          "' " +
          (currentFieldType == elt ? "selected='selected'" : "") +
          ">" +
          elt +
          "</option>"
      );
    });

    fieldTypeSelect.change(() => {
      changeComponentType(target);
    });

    fieldTypeDiv.append(fieldTypeSelect);

    return fieldTypeDiv;
  };

  const getButtonsDiv = () => {
    let buttonsDiv = $("<div>");

    let copyButton = $("<button>");
    copyButton.text("Copy");
    copyButton.click(() => {
      copyTarget(target);
    });

    let deleteButton = $("<button>");
    deleteButton.text("Delete");
    deleteButton.click(() => {
      deleteTarget(target);
    });

    let saveButton = $("<button>");
    saveButton.text("Save");
    saveButton.click(() => {
      saveTarget(target);
    });

    buttonsDiv.append(copyButton);
    buttonsDiv.append(deleteButton);
    buttonsDiv.append(saveButton);

    return buttonsDiv;
  };

  optionsDiv.append(getPositionDiv());
  optionsDiv.append(getSizeDiv());
  optionsDiv.append(getOrderDiv());
  optionsDiv.append(getCSSDiv());
  optionsDiv.append(getFieldTypeDiv());
  optionsDiv.append(getButtonsDiv());

  return optionsDiv;
};

const createOrderDiv = (target) => {
  let orderDiv = $("<div>");
  let orderHide = $("<span>");
  orderHide.css("display", "none");
  orderHide.css("white-space", "pre");

  let orderInput = $("<input>");
  orderInput.prop("id", "cornerOrderInput");
  orderInput.prop("type", "text");

  orderInput.css("border", "none");
  orderInput.css("min-width", "10px");

  orderInput.val($(target).prop("tabindex"));
  orderInput.on("input", () => {
    orderInput.val(orderInput.val().replace(/[^0-9]/, ""));
    orderHide.text(orderInput.val());
    orderInput.width(orderHide.width());

    $("#order").val(orderInput.val());
    updateOrder(target);
  });

  orderDiv.append(orderHide);
  orderDiv.append(orderInput);

  orderDiv.css("position", "absolute");
  orderDiv.css("transform", "translate(-50%, -50%)");
  orderDiv.css("border", "1px solid black");
  orderDiv.css("background", "white");
  orderDiv.css("padding", "2px");

  orderDiv.prop("id", "orderCorner");
  $(event.target).parent().append(orderDiv);
  updatePosition(event.target);

  orderHide.text(orderInput.val());
  orderInput.width(orderHide.width());
  orderInput.focus();

  return orderDiv;
};

module.exports = {
  getElement,
  activate,
  deactivate,
};
