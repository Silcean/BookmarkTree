/* #region Initial Variables */
console.log("init options");
let globalBookmarkTreeOptions = {};
let defaultOptios = {
  enableSearch: true,
  skipFolders: ["Mozilla Firefox"],
  favoriteFolderIdentifier: "Favorites",
  openedFolders: ["Bookmarks", "Kategorie"],
  colors: {
    background: "#48bf91",
    folderBackground: "#036952",
    folderBackgroundActivated: "#004b3a",
    folderTextColor: "#97b4ad",
    textColor: "black",
  },
};

function consumeColorsUpdate(colors) {
  //Just. dont worry about it. this has to be this way. Leave me alone
  applyColorsToCss({ colors: colors });
  globalBookmarkTreeOptions.colors = colors;
}

function consumeSearchEnabledUpdate(isEnabled) {
  setSearchEnabled(isEnabled);
  globalBookmarkTreeOptions.enableSearch = isEnabled;
}

function consumeSkipFoldersUpdate(folderNames) {
  globalBookmarkTreeOptions.skipFolders = folderNames;
  drawTree();
}

function consumeFavoriteUpdate(favoriteFolder) {
  globalBookmarkTreeOptions.favoriteFolderIdentifier = favoriteFolder;
  drawTree();
}

function consumeOpenedFolders(folderNames) {
  globalBookmarkTreeOptions.openedFolders = folderNames;
}
function consumeOptionsUpdate(newOptions) {
  if (newOptions.colors) consumeColorsUpdate(newOptions.colors);
  if (newOptions.enableSearch)
    consumeSearchEnabledUpdate(newOptions.enableSearch);
  if (newOptions.skipFolders) consumeSkipFoldersUpdate(newOptions.skipFolders);
  if (newOptions.favoriteFolderIdentifier)
    consumeFavoriteUpdate(newOptions.favoriteFolderIdentifier);
  if (newOptions.openedFolders) consumeOpenedFolders(newOptions.openedFolders);
  //TODO make update for openedFolders
  console.log("apply loaded options", newOptions);
}

function getOptions() {
  chrome.storage.sync.get("bookmark-tree-settings", function (obj) {
    globalBookmarkTreeOptions = obj["bookmark-tree-settings"];
    consumeOptionsUpdate(globalBookmarkTreeOptions);
    drawTree();
    return obj;
  });
}

function setOptions(newOptions) {
  consumeOptionsUpdate(newOptions);
  chrome.storage.sync.set({
    "bookmark-tree-settings": globalBookmarkTreeOptions,
  });
}
