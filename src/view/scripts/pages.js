"use strict";

const $ = require("jquery");
const fs = require("fs");
const FileType = require("file-type");
const { dialog } = require("electron").remote;
const zoomUtils = require("./zoom");

const createNewPage = async () => {
  return dialog
    .showOpenDialog({
      filters: [
        { name: "Images", extensions: ["jpg", "jpeg", "png", "gif", "bmp"] },
      ],
      properties: ["openFile"],
    })
    .then((fileData) => {
      if (fileData.filePaths === [] || fileData.canceled) {
        throw new Error("You didn't open any file");
      }

      return addPage(fileData.filePaths[0]).then((page) => {
        $(".welcomeScreenDiv").remove();
        return page;
      });
    });
};

const changePageBackground = (page) => {
  dialog
    .showOpenDialog({
      filters: [
        { name: "Images", extensions: ["jpg", "jpeg", "png", "gif", "bmp"] },
      ],
      properties: ["openFile"],
    })
    .then((fileData) => {
      if (fileData.filePaths !== [] && !fileData.canceled) {
        console.debug("Changing page to " + fileData.filePaths[0]);
        setPageImage(
          page,
          fileData.filePaths[0],
          page.find("img").css("width")
        );
      }
    });
};

const addPage = async (image) => {
  return new Promise((resolve) => {
    let newPage = $("<div>");
    newPage.addClass("pageContainer");
    newPage.prop("id", "page_" + ($(".pageContainer").length + 1));

    setPageImage(newPage, image).then(() => {
      $("#mainContent").append(newPage);
      zoomUtils.initZoomControls();

      resolve(newPage);
    });
  });
};

const setPageImage = async (page, image, imageWidth = null) => {
  let backgroundImg = "";
  if (image.startsWith("data:")) {
    backgroundImg = image.replace(/(\r\n|\n|\r)/gm, "");
  } else {
    let rawBackground = fs.readFileSync(image);
    let fileType = await FileType.fromFile(image);
    backgroundImg =
      "data:" +
      fileType.mime +
      ";base64," +
      new Buffer(rawBackground)
        .toString("base64")
        .replace(/(\r\n|\n|\r)/gm, "");
  }

  page.css("background-image", "url('" + backgroundImg + "')");

  if (imageWidth) {
    page.css("width", imageWidth);
  }

  let originalSize = await getImageDimensions(backgroundImg);
  page.prop("originalWidth", originalSize.w);
  page.prop("originalHeight", originalSize.h);
  page.prop("backgroundRatio", originalSize.w / originalSize.h);
};

function getImageDimensions(base64) {
  return new Promise(function (resolved) {
    var i = new Image();
    i.onload = function () {
      resolved({ w: i.width, h: i.height });
    };
    i.src = base64;
  });
}

module.exports = {
  addPage,
  setPageImage,
  createNewPage,
  changePageBackground,
};
