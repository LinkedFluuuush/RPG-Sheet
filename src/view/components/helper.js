"use strict";

const $ = require("jquery");
const components = require("../scripts/components");

const handleComponentAdding = (targetElement) => {
  $(".pageContainer").css("cursor", "copy");

  let isDragging = false;
  let startCoord = { x: null, y: null };
  let endCoord = { x: null, y: null };
  let previewRectangle = $("<div>");
  previewRectangle.css("border", "black 1px solid");
  previewRectangle.css("background-color", "rgba(255,255,255,0.5)");
  previewRectangle.css("position", "absolute");
  let eventTarget;

  $(".pageContainer")
    .mousedown(function (event) {
      event.preventDefault();
      eventTarget = $(event.target);
      let parentOffset = eventTarget.offset();
      isDragging = false;
      startCoord.x = event.pageX - parentOffset.left - 1;
      startCoord.y = event.pageY - parentOffset.top - 5;

      previewRectangle.css("top", startCoord.y);
      previewRectangle.css("left", startCoord.x);
      $(event.target).append(previewRectangle);

      $(event.target).mousemove(function (event) {
        event.preventDefault();

        isDragging = true;
        let currentMousePosition = {
          x: event.pageX - parentOffset.left - 1,
          y: event.pageY - parentOffset.top - 5,
        };

        if (currentMousePosition.x < startCoord.x) {
          previewRectangle.css("left", currentMousePosition.x);
          previewRectangle.css(
            "width",
            startCoord.x - currentMousePosition.x + "px"
          );
        } else {
          previewRectangle.css("left", startCoord.x);
          previewRectangle.css(
            "width",
            currentMousePosition.x - startCoord.x + "px"
          );
        }

        if (currentMousePosition.y < startCoord.y) {
          previewRectangle.css("top", currentMousePosition.y);
          previewRectangle.css(
            "height",
            startCoord.y - currentMousePosition.y + "px"
          );
        } else {
          previewRectangle.css("top", startCoord.y);
          previewRectangle.css(
            "height",
            currentMousePosition.y - startCoord.y + "px"
          );
        }
      });
    })
    .mouseup(function (event) {
      event.preventDefault();
      let parentOffset = eventTarget.offset();
      var wasDragging = isDragging;
      isDragging = false;
      if (wasDragging) {
        endCoord.x = event.pageX - parentOffset.left - 1;
        endCoord.y = event.pageY - parentOffset.top - 5;

        let finalStartCoord = {
          x: startCoord.x < endCoord.x ? startCoord.x : endCoord.x,
          y: startCoord.y < endCoord.y ? startCoord.y : endCoord.y,
        };

        let finalSize = {
          width:
            startCoord.x < endCoord.x
              ? endCoord.x - startCoord.x
              : startCoord.x - endCoord.x,
          height:
            startCoord.y < endCoord.y
              ? endCoord.y - startCoord.y
              : startCoord.y - endCoord.y,
        };

        components.addComponent(
          targetElement,
          eventTarget,
          components.calculatePercentPosition(eventTarget, finalStartCoord),
          components.calculatePercentSize(eventTarget, finalSize)
        );
      }
      previewRectangle.remove();
      $(".pageContainer").off("mousemove");
    });
};

module.exports = {
  handleComponentAdding,
};
