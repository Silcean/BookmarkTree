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

function writeSkipFoldersToSettings(folderNames){

}

function openSettings() {
  setSettingsVariable("unset");
}

function closeSettings() {
  setSettingsVariable("none");
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
