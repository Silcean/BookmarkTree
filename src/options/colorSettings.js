const ColorPickers = [
  {
    label: "Background Color: ",
    domId: "colorpicker-settings-complete-background",
    optionsKey: "background",
    cssVariable: "--bg-color",
  },
  {
    label: "Text Color: ",
    domId: "colorpicker-settings-color-text",
    optionsKey: "textColor",
    cssVariable: "--default-text-color",
  },
  {
    label: "Accent Color: ",
    domId: "colorpicker-settings-color-accent",
    optionsKey: "accentBackground",
    cssVariable: "--accent-background-color",
  },  {
    label: "Accent Text Color: ",
    domId: "colorpicker-settings-color-text-accent",
    optionsKey: "accentText",
    cssVariable: "--accent-text-color",
  },
  {
    label: "Folder Color: ",
    domId: "colorpicker-settings-color-folder",
    optionsKey: "folderBackground",
    cssVariable: "--folder-color",
  },
  {
    label: "Active Folder Color: ",
    domId: "colorpicker-settings-color-active-folder",
    optionsKey: "folderBackgroundActivated",
    cssVariable: "--folder-open-color",
  },
  {
    label: "Folder Text Color: ",
    domId: "colorpicker-settings-color-text-folder",
    optionsKey: "folderTextColor",
    cssVariable: "--folder-text-color",
  },
  {
    label: "Pop Up Background Color: ",
    domId: "colorpicker-settings-color-overlay",
    optionsKey: "overlayBackground",
    cssVariable: "--overlay-container-color",
  },
];

function colorSettings(options) {
  const colorbuttons = CreateElementWithClass("li");
  colorbuttons.appendChildren([
    createColorSettingsApplyButton(),
    createColorSettingsResetButton(),
  ]);
  colorbuttons.style = "display: flex; margin: 0px;";
  return [...ColorPickers.map((x) => addColorPicker(x, options)), colorbuttons];
}

function watchColorPicker() {
  applyColorsToCss({
    colors: getColorsFromInputs(),
  });
}

function addColorPicker(colorPickerObject, options) {
  //object strucutre. got i miss typescript
  // {
  //   label: "Background Color: ",
  //   domId: "settings-color-folder",
  //   optionsKey: "background",
  //   cssVariable: "--bg-color",
  // }

  const listElement = CreateElementWithClass("li", "color-setting");
  listElement.style = "display: flex; align-items: center; gap: 0.5rem;";

  const titleSpan = CreateElementWithClass("span");
  titleSpan.style = "white-space:nowrap";
  titleSpan.textContent = colorPickerObject.label;

  const picker = createColorPickerElement(colorPickerObject, options);
  listElement.appendChildren([
    titleSpan,
    CreateElementWithClass("div", "right-group").appendChildren([picker]),
  ]);
  return listElement;
}

function createColorPickerElement(colorPickerObject, options) {
  const picker = document.createElement("input");
  picker.type = "color";
  picker.id = colorPickerObject.domId;
  picker.value = options.colors[colorPickerObject.optionsKey];
  picker.addEventListener("input", () => watchColorPicker());

  return CreateElementWithClass("label", "color-bubble").appendChildren([
    picker,
  ]);
}

function createColorSettingsResetButton() {
  return createRaisedButton(`<span>Reset Colors</span>` + resetIcon(), () => {
    applyColorsToCss(globalBookmarkTreeOptions);
    applyColorsToInputs(globalBookmarkTreeOptions);
  });
}

function createColorSettingsApplyButton() {
  return createRaisedButton(`<span>Apply Colors</span>` + colorIcon(), () => {
    setOptions({ colors: getColorsFromInputs() });
  });
}

function getColorPickerValue(id) {
  return document.getElementById(id).value;
}

function applyColorsToCss(options) {
  ColorPickers.forEach((x) =>
    setRootCssVariable(x.cssVariable, options.colors[x.optionsKey])
  );
}

function applyColorsToInputs(options) {
  function setValueById(id, value) {
    document.getElementById(id).value = value;
  }
  ColorPickers.forEach((x) =>
    setValueById(x.domId, options.colors[x.optionsKey])
  );
}

function getColorsFromInputs() {
  let colorsObject = {};
  ColorPickers.map(
    (x) => (colorsObject[x.optionsKey] = getColorPickerValue(x.domId))
  );
  return colorsObject;
}
