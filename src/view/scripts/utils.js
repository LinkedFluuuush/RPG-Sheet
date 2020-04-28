"use strict";

const $ = require("jquery");

const displayPopInMsg = (msg, type) => {
  let msgDiv = $("<div>");
  msgDiv.text(msg);
  msgDiv.addClass("popInMsg");
  msgDiv.addClass(type + "Msg");

  $("body").append(msgDiv);

  msgDiv.fadeIn(500, () => {
    setTimeout(() => {
      msgDiv.fadeOut(500, () => {
        // msgDiv.remove();
      });
    }, 2000);
  });
};

module.exports = {
  displayPopInMsg,
};
