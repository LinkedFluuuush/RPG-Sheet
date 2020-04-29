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

const zoomIn = () => {
  $(".pageContainer").css("flex-basis", $(".pageContainer").width() + 50);
  calculateHeight();
};

const zoomOut = () => {
  $(".pageContainer").css("flex-basis", $(".pageContainer").width() - 50);
  calculateHeight();
};

const zoomToWidth = () => {
  $(".pageContainer").css("flex-basis", $("#mainContent").innerWidth() - 10);
  calculateHeight();
};

const zoomToNatural = () => {
  $(".pageContainer").css("flex-basis", $(".pageContainer")[0].originalWidth);
  calculateHeight();
};

const zoomToHeight = () => {
  $(".pageContainer").height($("#mainContent").innerHeight() - 10);
  calculateWidth();
};

const updateAllInputsFontSize = () => {
  $.each($("*." + constants.TOOLS.TEXTINPUT), (idx, elt) => {
    if ($(elt).val().length > 0) {
      setTimeout(() => {
        updateInputFontSize(elt);
      }, 0);
    }
  });
};

const updateInputFontSize = async (target) => {
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

const zoomDefaultHandler = (event) => {
  let hotKey = event.ctrlKey;
  if (remote.process.platform === "darwin") {
    hotKey = event.metaKey;
  }

  if (hotKey == true && event.key == "0") {
    event.preventDefault();
    zoomToHeight();
    updateAllInputsFontSize();
  }
  if (hotKey == true && event.key == "1") {
    event.preventDefault();
    zoomToNatural();
    updateAllInputsFontSize();
  }

  if (hotKey == true && event.key == "2") {
    event.preventDefault();
    zoomToWidth();
    updateAllInputsFontSize();
  }
};

const zoomHandler = (event) => {
  if (!animFrameRequested) {
    animFrameRequested = true;
    requestAnimationFrame(function () {
      let hotKey = event.ctrlKey;
      if (remote.process.platform === "darwin") {
        hotKey = event.metaKey;
      }

      setTimeout(() => {
        if (hotKey == true) {
          if (event.originalEvent.deltaY > 0) {
            zoomOut();
          } else {
            zoomIn();
          }
        }
      }, 0);

      if (zoomTimer !== null) {
        clearTimeout(zoomTimer);
      }

      zoomTimer = setTimeout(() => {
        updateAllInputsFontSize();
      }, 100);
      animFrameRequested = false;
    });
  }
};

const initZoomControls = () => {
  $(window).off("mousewheel", zoomHandler);
  $(window).off("DOMMouseScroll", zoomHandler);
  $(window).off("keydown", zoomHandler);
  $(window).bind("mousewheel DOMMouseScroll", zoomHandler);

  $(window).bind("keydown", zoomDefaultHandler);

  zoomToHeight();
  updateAllInputsFontSize();
};

module.exports = {
  initZoomControls,
  updateInputFontSize,
};
