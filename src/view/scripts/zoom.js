"use strict";

const $ = require("jquery");
const remote = require("electron").remote;
const constants = require("../../constants");

let animFrameRequested = false;
let zoomTimer = null;

const calculateHeight = () => {
  $.each($(".pageContainer"), (idx, elt) => {
    $(elt).height($(elt).width() / elt.backgroundRatio);
  });
};

const calculateWidth = () => {
  $.each($(".pageContainer"), (idx, elt) => {
    $(elt).css("flex-basis", $(elt).height() * elt.backgroundRatio);
  });
};

const zoomIn = (step = 50) => {
  $(".pageContainer").css("flex-basis", $(".pageContainer").width() + step);
  calculateHeight();
  updateAllInputsFontSize();
};

const zoomOut = (step = 50) => {
  $(".pageContainer").css("flex-basis", $(".pageContainer").width() - step);
  calculateHeight();
  updateAllInputsFontSize();
};

const zoomToWidth = () => {
  $(".pageContainer").css("flex-basis", $("#mainContent").innerWidth() - 10);
  calculateHeight();
  updateAllInputsFontSize();
};

const zoomToNatural = () => {
  $(".pageContainer").css("flex-basis", $(".pageContainer")[0].originalWidth);
  calculateHeight();
  updateAllInputsFontSize();
};

const zoomToHeight = () => {
  $(".pageContainer").height($("#mainContent").innerHeight() - 10);
  calculateWidth();
  updateAllInputsFontSize();
};

const updateAllInputsFontSize = () => {
  if (zoomTimer !== null) {
    clearTimeout(zoomTimer);
  }

  zoomTimer = setTimeout(() => {
    $.each($("*." + constants.TOOLS.TEXTINPUT), (idx, elt) => {
      if ($(elt).val().length > 0) {
        setTimeout(() => {
          updateInputFontSize(elt);
        }, 5);
      }
    });
  }, 100);
};

const updateInputFontSize = (target) => {
  if ($(target).val().length > 0) {
    while (target.scrollHeight <= target.clientHeight) {
      $(target).css("font-size", "+=2");
    }

    while (target.scrollHeight > target.clientHeight) {
      $(target).css("font-size", "-=2");
    }
  } else {
    $(target).css("font-size", target.clientHeight * 0.9);
  }
};

const zoomHandler = (event) => {
  let hotKey = event.ctrlKey;
  if (remote.process.platform === "darwin") {
    hotKey = event.metaKey;
  }

  if (hotKey == true) {
    event.preventDefault();
    event.stopPropagation();

    if (!animFrameRequested) {
      animFrameRequested = true;
      requestAnimationFrame(function () {
        setTimeout(() => {
          if (event.deltaY > 0) {
            zoomOut();
          } else {
            zoomIn();
          }
        }, 0);

        animFrameRequested = false;
      });
    }
  }
};

const initZoomControls = () => {
  window.removeEventListener("wheel", zoomHandler, { passive: false });
  window.addEventListener("wheel", zoomHandler, { passive: false }); // modern desktop

  zoomToHeight();
};

module.exports = {
  initZoomControls,
  updateInputFontSize,
  zoomIn,
  zoomOut,
  zoomToWidth,
  zoomToHeight,
  zoomToNatural,
};
