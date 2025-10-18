let settingsOpenState = false;
let thoseChipsLikeTheFolderSkipList;
function toggleSettings() {
  if (settingsOpenState) {
    closeSettings();
  } else {
    openSettings();
  }
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
    
  thoseChipsLikeTheFolderSkipList = new Chips(
    "skip-folder-chips",
    options.skipFolders,
    updateSettingsFromFolderSkips
  );
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
  headline.innerHTML = text;
  const link = CreateElementWithClass("li");
  link.appendChild(headline);
  return link;
}
