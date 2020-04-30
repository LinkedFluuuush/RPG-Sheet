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
    $.each($("*." + constants.TOOLS.TEXTAREA), (idx, elt) => {
      if ($(elt).val().length > 0) {
        setTimeout(() => {
          updateInputFontSize(elt, constants.MIN_AREA_SIZE);
        }, 5);
      }
    });
  }, 100);
};

const updateInputFontSize = (target, minSize = 0) => {
  $(target).css("padding-top", "0");

  if ($(target).val().length > 0) {
    while (target.scrollHeight <= target.clientHeight) {
      $(target).css("font-size", "+=2");
    }

    while (
      target.scrollHeight > target.clientHeight &&
      Number($(target).css("font-size").replace("px", "")) > minSize
    ) {
      $(target).css("font-size", "-=2");
    }

    let placeholderSpan = $("<div>");
    placeholderSpan.css("visibility", "hidden");
    placeholderSpan.css("width", $(target).width());
    placeholderSpan.css("height", "fit-content");
    placeholderSpan.css("font-size", $(target).css("font-size"));

    if ($(target).data("elementType") === constants.TOOLS.TEXTINPUT) {
      placeholderSpan.addClass("unscrollable");
    } else {
      placeholderSpan.css("overflow-wrap", "break-word");
      placeholderSpan.css("overflow", "auto");
      placeholderSpan.css("white-space", "pre-wrap");
    }

    placeholderSpan.text($(target).val());
    $("body").append(placeholderSpan);

    let verticalPadding = 0;
    if ($(placeholderSpan).height() < target.clientHeight) {
      verticalPadding = (target.clientHeight - $(placeholderSpan).height()) / 2;
    }

    $(target).css("padding-top", verticalPadding);

    placeholderSpan.remove();
  } else {
    $(target).css("font-size", target.clientHeight * 0.5 + "px");
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
