"use strict";

const $ = require("jquery");
require("jquery-color");

let constants = require("../../constants");

const selfId = constants.TOOLS.ORDER;

const getElement = () => {
  let elt = $("<button></button>");
  elt.attr("id", selfId);
  elt.attr("class", "toolbarButton");
  elt.prop("title", "Order tool (Alt+O)\nReorder your fields");

  let icon = $("<img>");
  icon.prop("src", "./img/order.svg");
  icon.css("width", "inherit");

  elt.append(icon);

  return elt;
};

const activate = () => {
  console.debug("Activating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/orderActivate.svg");

  $(".pageContainer ." + constants.INPUT_TYPES.join(",.")).css(
    "cursor",
    "default"
  );
  $(".pageContainer ." + constants.INPUT_TYPES.join(",.")).css(
    "outline",
    "red 2px solid"
  );
  $(".pageContainer ." + constants.INPUT_TYPES.join(",.")).mousedown(
    (event) => {
      event.preventDefault();
    }
  );

  $(".pageContainer ." + constants.INPUT_TYPES.join(",.")).click(clickFunction);
  $.each(
    $(".pageContainer ." + constants.INPUT_TYPES.join(",.")),
    (idx, elt) => {
      createOrderDiv(elt);
    }
  );

  createCurrentPlaceDiv();
};

const createCurrentPlaceDiv = () => {
  let currentPlaceDiv = $("<div>");
  currentPlaceDiv.addClass("optionsElement");

  currentPlaceDiv.css("width", "fit-content");
  currentPlaceDiv.css("height", "fit-content");

  currentPlaceDiv.css("position", "fixed");
  currentPlaceDiv.css("bottom", "20px");
  currentPlaceDiv.css("right", "20px");
  currentPlaceDiv.css("padding", "10px");
  currentPlaceDiv.css("background-color", "white");
  currentPlaceDiv.css("border", "black 1px solid");

  let currentPlaceInput = $("<input>");
  currentPlaceInput.prop("id", "currentPlace");
  currentPlaceInput.prop("type", "number");
  currentPlaceInput.css("font-size", "20px");
  currentPlaceInput.css("width", "50px");
  currentPlaceInput.val(1);

  currentPlaceDiv.append("Next order : ");
  currentPlaceDiv.append(currentPlaceInput);
  $("body").append(currentPlaceDiv);
};

const updateCurrentPlace = (place) => {
  $("#currentPlace").val(place);
};

const clickFunction = (event) => {
  let target = event.target;
  let currentPlace = $("#currentPlace").val();
  updateOrder(target, currentPlace);
  updateCurrentPlace(Number(currentPlace) + 1);
};

const createOrderDiv = (target) => {
  let orderDiv = $("<div>");
  orderDiv.css("position", "absolute");
  orderDiv.css("transform", "translate(-50%, -50%)");
  orderDiv.css("border", "1px solid black");
  orderDiv.css("background", "white");
  orderDiv.css("padding", "2px");
  orderDiv.css("width", "fit-content");
  orderDiv.css("height", "fit-content");

  let topRightCornerPosition = {
    x:
      Number(target.style.left.replace("%", "")) +
      Number(target.style.width.replace("%", "")),
    y: target.style.top.replace("%", ""),
  };

  console.log(topRightCornerPosition);

  orderDiv.css("top", topRightCornerPosition.y + "%");
  orderDiv.css("left", topRightCornerPosition.x + "%");

  orderDiv.addClass("optionsElement");
  $(target).parent().append(orderDiv);

  $(target).data("orderDiv", orderDiv);
  updateOrder(target, $(target).prop("tabindex"));

  return orderDiv;
};

const updateOrder = (target, order) => {
  let orderDiv = $(target).data("orderDiv");
  orderDiv.text(order);
  orderDiv.animate(
    {
      backgroundColor: "green",
    },
    "fast",
    () => {
      orderDiv.animate(
        {
          backgroundColor: "",
        },
        "fast"
      );
    }
  );
  $(target).prop("tabindex", order);
};

const deactivate = () => {
  console.debug("Deactivating " + selfId);
  $("#" + selfId + " img").prop("src", "./img/order.svg");
  $(".pageContainer ." + constants.INPUT_TYPES.join(",.")).css("cursor", "");
  $(".pageContainer ." + constants.INPUT_TYPES.join(",.")).css("outline", "");

  $(".pageContainer ." + constants.INPUT_TYPES.join(",.")).off("mousedown");
  $(".pageContainer ." + constants.INPUT_TYPES.join(",.")).off("click");
  $(".optionsElement").remove();
};

module.exports = {
  getElement,
  activate,
  deactivate,
};
