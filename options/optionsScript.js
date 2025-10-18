/* #region Initial Variables */
console.log("init options");
let globalBookmarkTreeOptions = {};
let defaultOptios = {
  enableSearch: true,
  enableFavorites: true,
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

function consumeFavoritesEnabledUpdate(isEnabled) {
  setFavoritesEnabled(isEnabled);
  globalBookmarkTreeOptions.enableFavorites = isEnabled;
}

function consumeSkipFoldersUpdate(folderNames) {
  globalBookmarkTreeOptions.skipFolders = folderNames;
  return true;
}

function consumeFavoriteUpdate(favoriteFolder) {
  globalBookmarkTreeOptions.favoriteFolderIdentifier = favoriteFolder;
  return true;
}

function consumeOpenedFolders(folderNames) {
  globalBookmarkTreeOptions.openedFolders = folderNames;
}

function consumeOptionsUpdate(newOptions, allowTreeRedraw) {
  let shouldRerenderTree = false;
  executeIfValueHasBeenSet(newOptions.colors, consumeColorsUpdate);
  executeIfValueHasBeenSet(
    newOptions.enableFavorites,
    consumeFavoritesEnabledUpdate
  );
  executeIfValueHasBeenSet(newOptions.enableSearch, consumeSearchEnabledUpdate);
  executeIfValueHasBeenSet(newOptions.openedFolders, consumeOpenedFolders);

  shouldRerenderTree = executeIfValueHasBeenSet(newOptions.skipFolders,consumeSkipFoldersUpdate)
    ||executeIfValueHasBeenSet(newOptions.favoriteFolderIdentifier,consumeFavoriteUpdate)

  if (shouldRerenderTree && allowTreeRedraw) drawTree();
  console.log("apply loaded options", newOptions);
}
function executeIfValueHasBeenSet(value, method) {
  if (value != null || value != undefined) return method(value);
  return false
}
function getOptions() {
  chrome.storage.sync.get("bookmark-tree-settings", function (obj) {
    globalBookmarkTreeOptions = obj["bookmark-tree-settings"];
    consumeOptionsUpdate(globalBookmarkTreeOptions);
    drawTree();
    return obj;
  });
}

function setOptions(newOptions, allowTreeRedraw = true) {
  consumeOptionsUpdate(newOptions, allowTreeRedraw);
  chrome.storage.sync.set({
    "bookmark-tree-settings": globalBookmarkTreeOptions,
  });
}
