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
  console.log("intialising settings with options: ",options)
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
    SettingsHeadline("Colors:"),
    wrapInInset(colorSettings(options)),
    SettingsHeadline("Favorites:"),
    wrapInInset(createTextInput("Favorite Folder Identifier", "favorites")),
    SettingsHeadline("Remove Folder from Tree:"),

    wrapInInset(createChips()),
  ]);
}
function wrapInInset(elements) {
  const wrapper = CreateDivWithClass("inset-settings");
  if (elements.length != undefined) {
    wrapper.appendChildren(elements);
  } else {
    wrapper.appendChild(elements);
  }
  return wrapper;
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
  resetButton.innerHTML = `<span>Reset Colors</span>` + resetIcon();
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
  applyButton.innerHTML = `<span>Apply Colors</span>` + colorIcon();

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

function SettingsHeadline(text) {
  const headline = CreateElementWithClass("h2", "settings-section");
  headline.innerHTML = text;
  const link = CreateElementWithClass("li");
  link.appendChildren([headline]);
  return link;
}
