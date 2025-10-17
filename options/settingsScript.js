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
  const list = document.getElementById("settings-list");
  const inputLabel = CreateElementWithClass("span");
  inputLabel.innerHTML =
    "Favorite bookmarks allow you to pin a collection of bookmarks for easy access. This is done by selecting a bookmark folder name, which contents will be added to the list.";
  chipsssss = document.createElement("div");
  chipsssss.id = "skip-folder-chips";

  list.appendChildren([
    SettingsHeadline("Colors:"),
    colorSettingsWrapped(options),
    SettingsHeadline("Favorites:"),
    wrapInInset([
      inputLabel,
      CreateDivWithClass("spacer"),
      createTextInputWithLabel(
        `Selected Favorites Folder:`,
        (value) => updateFavorites(value),
        checkIcon(),
        options.favoriteFolderIdentifier,
        false
      ),
    ]),
    SettingsHeadline("Remove Folder from Tree:"),
    wrapInInset(chipsssss),
    CreateDivWithClass("spacer"),
  ]);
  thoseChipsLikeTheFolderSkipList = new Chips(
    chipsssss.id,
    options.skipFolders,
    updateSettingsFromFolderSkips
  );
}

function updateSettingsFromFolderSkips(names) {
  setOptions({skipFolders:names})
}

function updateFavorites(newFavorite) {
  setOptions({favoriteFolderIdentifier:newFavorite});
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


