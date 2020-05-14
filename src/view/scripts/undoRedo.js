"use strict";

const $ = require("jquery");

let undoStates = [];
let redoStates = [];

const addState = (state) => {
  undoStates.push(state.clone(true));
  redoStates = [];
  console.log(undoStates);
};

const undo = () => {
  if (undoStates.length > 0) {
    let state = undoStates.pop();

    if ($("#mainContent").find(state).length > 0) {
      redoStates.push($("#mainContent").find(state).clone(true));
      let parent = $("#mainContent").find(state).parent();
      $("#mainContent").find(state).remove();
      parent.append(state);
    } else {
      state.parent().append(state);
    }
  }
};

const redo = () => {
  if (redoStates.length > 0) {
    let state = redoStates.pop();

    if ($("#mainContent").find(state).length > 0) {
      undoStates.push($("#mainContent").find(state).clone(true));
      let parent = $("#mainContent").find(state).parent();
      $("#mainContent").find(state).remove();
      parent.append(state);
    } else {
      state.parent().append(state);
    }
  }
};

module.exports = {
  addState,
  undo,
  redo,
};
