let settingsOpenState = false;
function toggleSettings() {
  if (settingsOpenState) {
    closeSettings();
  } else {
    openSettings();
  }
  settingsOpenState = !settingsOpenState;
}

function initSettings(options) {
  settingsButton = document.getElementById("settings-toggle-button");
  onClick = (event) => {
    toggleSettings();
  };
  settingsButton.onclick = onClick;

  const list = document.getElementById("settings-list");
  const colorbuttons = CreateElementWithClass("li");
  colorbuttons.appendChildren([createApplyButton(), createResetButton()]);
  colorbuttons.style = "display: flex;";
  list.appendChildren([
    ...colorSettings(options),
    createTextInput("Favorite Folder Identifier", "favorites"),
    createChips(),
  ]);
}
function colorSettings(options) {
  const colorbuttons = CreateElementWithClass("li");
  colorbuttons.appendChildren([createApplyButton(), createResetButton()]);
  colorbuttons.style = "display: flex;";
  return [
    addColorPicker(
      "Background Color: ",
      "settings-color-background",
      "background",
      options
    ),
    addColorPicker(
      "Folder Color: ",
      "settings-color-folder",
      "folder-background",
      options
    ),
    addColorPicker(
      "Active Folder Color: ",
      "settings-color-active-folder",
      "folder-background-active",
      options
    ),
    addColorPicker(
      "Folder Text Color: ",
      "settings-color-text-folder",
      "folder-text",
      options
    ),
    addColorPicker("Text Color: ", "settings-color-text", "text", options),
    colorbuttons,
  ];
}
function watchColorPicker() {
  applyColorsToCss({
    colors: getColorsFromInputs(),
  });
}

function getDefaultColor(type, options) {
  console.log(globalBookmarkTreeOptions);
  switch (type) {
    case "background":
      return options.colors.background;
    case "folder-background":
      return options.colors.folderBackground;
    case "folder-background-active":
      return options.colors.folderBackgroundActivated;
    case "folder-text":
      return options.colors.folderTextColor;
    default:
    case "text":
      return options.colors.textColor;
  }
}

function openSettings() {
  setSettingsVariable("unset");
}

function closeSettings() {
  setSettingsVariable("none");
}

function addColorPicker(title, id, type, options) {
  const listElement = CreateElementWithClass("li", "color-setting");
  listElement.style = "display: flex; align-items: center; gap: 0.5rem;";
  const picker = createColorPicker("colorpicker-" + id, type, options);
  const titleSpan = CreateElementWithClass("span");
  titleSpan.style = "white-space:nowrap";
  titleSpan.innerHTML = title;
  const containter = CreateElementWithClass("div", "right-group");
  containter.appendChildren([picker]);
  listElement.appendChildren([titleSpan, containter]);
  return listElement;
}

function createColorPicker(id, type, options) {
  const picker = document.createElement("input");
  picker.type = "color";
  picker.id = id;
  console.log("def color", getDefaultColor(type, options));
  picker.value = getDefaultColor(type, options);
  picker.addEventListener("input", () => watchColorPicker());
  const colorPickerWrapper = CreateElementWithClass("label", "color-bubble");
  colorPickerWrapper.appendChildren([picker]);
  return colorPickerWrapper;
}

function createResetButton() {
  //TODO make button do something
  const resetButton = CreateElementWithClass(
    "button",
    "resetbutton searchbutton optionsbutton"
  );
  resetButton.innerHTML = `<span>Reset Colors</span><svg class="buttonIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"  ><path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/></svg>`;
  resetButton.onclick = () => {
    applyColorsToCss(globalBookmarkTreeOptions);
    applyColorsToInputs(globalBookmarkTreeOptions);
  };
  return resetButton;
}

function createApplyButton() {
  //TODO make button do something
  const applyButton = CreateElementWithClass(
    "button",
    "resetbutton searchbutton optionsbutton"
  );
  applyButton.innerHTML = `<span>Apply Colors</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M346-140 100-386q-10-10-15-22t-5-25q0-13 5-25t15-22l230-229-106-106 62-65 400 400q10 10 14.5 22t4.5 25q0 13-4.5 25T686-386L440-140q-10 10-22 15t-25 5q-13 0-25-5t-22-15Zm47-506L179-432h428L393-646Zm399 526q-36 0-61-25.5T706-208q0-27 13.5-51t30.5-47l42-54 44 54q16 23 30 47t14 51q0 37-26 62.5T792-120Z"/></svg>`;

  applyButton.onclick = () => {
    let colors = getColorsFromInputs();
    applyColorsToCss(colors);
    globalBookmarkTreeOptions.color = colors;
    setOptions(globalBookmarkTreeOptions);
  };
  return applyButton;
}

function getColorPickerValue(id) {
  return document.getElementById(id).value;
}

function applyColorsToCss(options) {
  setRootCssVariable("--bg-color", options.colors.background);
  setRootCssVariable("--folder-color", options.colors.folderBackground);
  setRootCssVariable(
    "--folder-open-color",
    options.colors.folderBackgroundActivated
  );
  setRootCssVariable("--folder-text-color", options.colors.folderTextColor);
  setRootCssVariable("--default-text-color", options.colors.textColor);
}

function applyColorsToInputs(options) {
  function setValueById(id, value) {
    document.getElementById(id).value = value;
  }
  setValueById(
    "colorpicker-settings-color-folder",
    options.colors.folderBackground
  );
  setValueById(
    "colorpicker-settings-color-active-folder",
    options.colors.folderBackgroundActivated
  );
  setValueById(
    "colorpicker-settings-color-text-folder",
    options.colors.folderTextColor
  );
  setValueById(
    "colorpicker-settings-color-background",
    options.colors.background
  );
  setValueById("colorpicker-settings-color-text", options.colors.textColor);
}

function getColorsFromInputs() {
  return {
    folderBackground: getColorPickerValue("colorpicker-settings-color-folder"),
    folderBackgroundActivated: getColorPickerValue(
      "colorpicker-settings-color-active-folder"
    ),
    folderTextColor: getColorPickerValue(
      "colorpicker-settings-color-text-folder"
    ),
    background: getColorPickerValue("colorpicker-settings-color-background"),
    textColor: getColorPickerValue("colorpicker-settings-color-text"),
  };
}

function createTextInput(title, placeholder) {
  const lsitelement = CreateElementWithClass("li");
  const label = CreateElementWithClass("span");
  label.innerHTML = title;
  const input = CreateElementWithClass("input");
  input.placeholder = placeholder;
  input.value = globalBookmarkTreeOptions.favoriteFolderIdentifier;
  lsitelement.appendChildren([label, input]);
  //todo add apply button
  return lsitelement;
}

//TODO add multistring input maybe like chips?
