"use strict";

const $ = require("jquery");
const { dialog } = require("electron").remote;
const fs = require("fs");

let constants = require("../../constants");
let mainScript = require("./mainScript");
let pageManager = require("./pages");
let components = require("./components");

let savedFileName = null;

const saveSheet = () => {
  handleSaveFile(savedFileName);
};

const saveSheetAs = () => {
  handleSaveFile();
};

const saveSheetAsTemplate = () => {
  handleSaveFile(null, true);
};

const handleSaveFile = (fileName = null, template = false) => {
  const sheetData = createSheetData(template);
  console.debug(sheetData);

  if (fileName === null) {
    dialog
      .showSaveDialog({
        filters: [
          { name: "RPG Sheets", extensions: ["rpSheet"] },
          { name: "All Files", extensions: ["*"] },
        ],
      })
      .then((fileData) => {
        doSaveData(fileData, sheetData, template);
      });
  } else {
    doSaveData({ filePath: fileName, canceled: false }, sheetData);
  }
};

const doSaveData = (fileData, data) => {
  if (fileData.filePath === undefined || fileData.canceled) {
    console.log("You didn't save the file");
    return;
  }

  savedFileName = fileData.filePath;

  if (!savedFileName.endsWith(".rpSheet")) {
    savedFileName += ".rpSheet";
  }

  mainScript.setWindowTitle(
    savedFileName.substring(0, savedFileName.length - 8)
  );

  // fileName is a string that contains the path and filename created in the save file dialog.
  fs.writeFile(savedFileName, JSON.stringify(data), (err) => {
    if (err) {
      alert("An error ocurred creating the file " + err.message);
    }

    alert("The file has been succesfully saved");
  });
};

const createSheetData = (template = false) => {
  const sheetData = {
    pages: [],
  };

  $(".pageContainer").each((idx, elt) => {
    let fullBGUrl = $(elt).css("background-image");
    let pageData = {
      background: fullBGUrl.substring(5, fullBGUrl.length - 2),
      fields: [],
    };

    $(elt)
      .find("input,textarea")
      .each((idx, elt) => {
        let fieldValue;

        if ($(elt).prop("type") == "checkbox") {
          fieldValue = $(elt).is(":checked");
        } else {
          fieldValue = $(elt).val();
        }

        let additionalCSS = [];
        for (let cssElt of elt.style) {
          if (!constants.UNEDITABLE_CSS.includes(cssElt)) {
            additionalCSS.push({
              prop: cssElt,
              value: template ? "" : elt.style[cssElt],
            });
          }
        }

        let fieldData = {
          position: {
            x: elt.style.left.replace("%", ""),
            y: elt.style.top.replace("%", ""),
          },
          size: {
            width: elt.style.width.replace("%", ""),
            height: elt.style.height.replace("%", ""),
          },
          value: fieldValue,
          type:
            $(elt).prop("tagName").toLowerCase() === "textarea"
              ? constants.TOOLS.TEXTAREA
              : $(elt).prop("type") === "checkbox"
              ? constants.TOOLS.CHECKBOX
              : constants.TOOLS.TEXTINPUT,
          order: $(elt).prop("tabindex") ? $(elt).prop("tabindex") : 0,
          additionalCSS: additionalCSS,
        };

        pageData.fields.push(fieldData);
      });
    sheetData.pages.push(pageData);
  });

  return sheetData;
};

const openSheet = (file = false) => {
  if (file) {
    if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
      doOpen(file);
    }
  } else {
    dialog
      .showOpenDialog({
        filters: [
          { name: "RPG Sheets", extensions: ["rpSheet"] },
          { name: "All Files", extensions: ["*"] },
        ],
        properties: ["openFile"],
      })
      .then((fileData) => {
        if (fileData.filePaths === [] || fileData.canceled) {
          console.log("You didn't open any file");
          return;
        }

        doOpen(fileData.filePaths[0]);
      });
  }
};

const doOpen = (filePath) => {
  savedFileName = filePath;
  mainScript.setWindowTitle(
    savedFileName.substring(0, savedFileName.length - 8)
  );

  let sheetData = JSON.parse(fs.readFileSync(savedFileName));

  try {
    generateFromData(sheetData);
  } catch (e) {
    console.error(e);
    mainScript.initApp();
  }
};

const generateFromData = (data = null) => {
  $("#mainContent").empty();

  if (data) {
    for (let page of data.pages) {
      pageManager.addPage(page.background).then((pageElement) => {
        for (let field of page.fields) {
          components.addComponent(
            field.type,
            pageElement,
            field.position,
            field.size,
            field.value,
            field.order,
            field.additionalCSS
          );
        }
      });
    }
  }

  console.log("Generated from " + JSON.stringify(data));
};

const newSheet = () => {
  savedFileName = null;
  mainScript.initApp();
};

module.exports = {
  saveSheet,
  saveSheetAs,
  saveSheetAsTemplate,
  openSheet,
  newSheet,
};
