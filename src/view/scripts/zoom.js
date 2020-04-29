"use strict";

const $ = require("jquery");
const remote = require("electron").remote;
const constants = require("../../constants");

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
      height: $(".pageContainer .pageImgHolder")[0].originalHeight,
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

const updateInputFontSize = (target = null) => {
  let targetsToUpdate;
  if (target) {
    targetsToUpdate = $(target);
  } else {
    targetsToUpdate = $("*." + constants.TOOLS.TEXTINPUT);
  }

  $.each(targetsToUpdate, (idx, elt) => {
    console.log("Updating size for " + elt);
    if ($(elt).val().length > 0) {
      while (elt.scrollHeight <= elt.clientHeight) {
        console.log($(elt).css("font-size"));
        console.log(elt.scrollHeight + " <= " + elt.clientHeight);

        $(elt).css("font-size", "+=1");
      }

      console.log("End grow, shrink now");

      while (elt.scrollHeight > elt.clientHeight) {
        console.log($(elt).css("font-size"));
        console.log(elt.scrollHeight + " > " + elt.clientHeight);

        $(elt).css("font-size", "-=1");
      }
    } else {
      $(elt).css("font-size", elt.clientHeight * 0.9);
    }
  });
};

const zoomDefaultHandler = (event) => {
  let hotKey = event.ctrlKey;
  if (remote.process.platform === "darwin") {
    hotKey = event.metaKey;
  }

  if (hotKey == true && event.key == "0") {
    event.preventDefault();
    zoomToHeight();
    updateInputFontSize();
  }
  if (hotKey == true && event.key == "1") {
    event.preventDefault();
    zoomToNatural();
    updateInputFontSize();
  }

  if (hotKey == true && event.key == "2") {
    event.preventDefault();
    zoomToWidth();
    updateInputFontSize();
  }
};

const zoomHandler = (event) => {
  let hotKey = event.ctrlKey;
  if (remote.process.platform === "darwin") {
    hotKey = event.metaKey;
  }

  if (hotKey == true) {
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
  initZoomControls,
  updateInputFontSize,
};
