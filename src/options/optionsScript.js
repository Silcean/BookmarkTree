/* #region Initial Variables */
console.log("init options");
let globalBookmarkTreeOptions = {};
let defaultOptions = {
  enableSearch: true,
  enableFavorites: true,
  enableTree: true,
  skipFolders: [],
  favoriteFolderIdentifier: "",
  openedFolders: [],
  dividerWidth: 66,
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

function consumeEnableTreeUpdate(enableTree) {
  setTreeEnabled(enableTree)
  globalBookmarkTreeOptions.enableTree = enableTree;
}

function consumeOpenedFolders(folderNames) {
  globalBookmarkTreeOptions.openedFolders = folderNames;
}
function consumedividerWidth(width) {
  globalBookmarkTreeOptions.dividerWidth = width;
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
  executeIfValueHasBeenSet(newOptions.enableTree,consumeEnableTreeUpdate)
  executeIfValueHasBeenSet(newOptions.dividerWidth,consumedividerWidth)

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
