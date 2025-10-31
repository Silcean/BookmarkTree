let settingsOpenState = false;
let folderSkipChips;
function toggleSettings() {
  if (settingsOpenState) {
    closeSettings();
  } else {
    openSettings();
  }
  document.body.classList.toggle("slider-disabled", settingsOpenState);

  settingsOpenState = !settingsOpenState;
}

function initSettings(options) {
  console.log("intialising settings with options: ", options);
  settingsButton = document.getElementById("settings-toggle-button");
  onClick = (event) => {
    toggleSettings();
  };
  settingsButton.onclick = onClick;

  document
    .getElementById("color-settings-container")
    .appendChildren(colorSettings(options));

  document
    .getElementById("favorites-settings-container")
    .appendChildren([
      createTextInputWithLabel(
        `Selected Favorites Folder:`,
        (value) => updateFavorites(value),
        checkIcon(),
        options.favoriteFolderIdentifier,
        false
      ),
    ]);

  folderSkipChips = new Chips(
    "skip-folder-chips",
    options.skipFolders,
    updateSettingsFromFolderSkips
  );
  document.getElementById("resetSettingsToDefault").onclick = () => {
    setOptions(defaultOptions);
    applyColorsToInputs(defaultOptions);
  };
}

function updateSettingsFromFolderSkips(names) {
  setOptions({ skipFolders: names });
}

function updateFavorites(newFavorite) {
  setOptions({ favoriteFolderIdentifier: newFavorite });
}

function openSettings() {
  setSettingsVariable("unset");
}

function closeSettings() {
  setSettingsVariable("none");
}

function SettingsHeadline(text) {
  const headline = CreateElementWithClass("h2", "settings-section");
  headline.textContent = text;
  const link = CreateElementWithClass("li");
  link.appendChild(headline);
  return link;
}
