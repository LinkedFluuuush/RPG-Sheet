"use strict";

const $ = require("jquery");

const zoomIn = () => {
  $(".pageContainer .pageImgHolder").width(
    $(".pageContainer .pageImgHolder").width() + 50
  );
};

const zoomOut = () => {
  $(".pageContainer .pageImgHolder").width(
    $(".pageContainer .pageImgHolder").width() - 50
  );
};

const zoomToWidth = () => {
  $(".pageContainer .pageImgHolder").width($("#mainContent").innerWidth() - 10);
};

const zoomToNatural = () => {
  $(".pageContainer .pageImgHolder").width(
    $(".pageContainer .pageImgHolder")[0].naturalWidth
  );
};

const zoomToHeight = () => {
  if ($(".pageContainer .pageImgHolder").length > 0) {
    let naturalSizes = {
      width: $(".pageContainer .pageImgHolder")[0].originalWidth,
      height: $(".pageContainer .pageImgHolder")[0].originalHeight
    };

    let newWidth =
      (naturalSizes.width * ($("#mainContent").innerHeight() - 10)) /
      naturalSizes.height;

    $(".pageContainer .pageImgHolder").width(newWidth);
  }
  console.debug(
    "Zoomed " +
      $(".pageContainer .pageImgHolder").length +
      " pages to height " +
      $("#mainContent").innerHeight()
  );
};

const updateInputFontSize = () => {
  $("input").css("font-size", idx => {
    return $($("input")[idx]).height() * 0.9;
  });
};

const zoomDefaultHandler = event => {
  if (event.ctrlKey == true && event.key == "0") {
    event.preventDefault();
    zoomToHeight();
    updateInputFontSize();
  }
  if (event.ctrlKey == true && event.key == "1") {
    event.preventDefault();
    zoomToNatural();
    updateInputFontSize();
  }

  if (event.ctrlKey == true && event.key == "2") {
    event.preventDefault();
    zoomToWidth();
    updateInputFontSize();
  }
};

const zoomHandler = event => {
  if (event.ctrlKey == true) {
    event.preventDefault();
    if (event.originalEvent.deltaY > 0) {
      zoomOut();
    } else {
      zoomIn();
    }
    updateInputFontSize();
  }
};

const initZoomControls = () => {
  $(window).off("mousewheel", zoomHandler);
  $(window).off("DOMMouseScroll", zoomHandler);
  $(window).off("keydown", zoomHandler);
  $(window).bind("mousewheel DOMMouseScroll", zoomHandler);

  $(window).bind("keydown", zoomDefaultHandler);

  zoomToHeight();
  updateInputFontSize();
};

module.exports = {
  initZoomControls
};
