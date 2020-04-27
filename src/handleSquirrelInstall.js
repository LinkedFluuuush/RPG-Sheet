"use strict";
// this should be placed at top of main.js to handle setup events quickly

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const { ProgId, ShellOption, Regedit } = require("electron-regedit");

  new ProgId({
    description: "RPG Sheet",
    extensions: ["rpSheet"],
    shell: [new ShellOption({ verb: ShellOption.OPEN })],
  });

  return Regedit.squirrelStartupEvent();
}

module.exports = {
  handleSquirrelEvent,
};
