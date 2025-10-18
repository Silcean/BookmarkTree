function setSearchEnabled(isEnabled) {
  const element = document.getElementById("search");
  document.getElementById("search").style = !isEnabled
    ? "display: none;"
    : "";
  SetToggleSwitchValue("enableSearchInput", isEnabled);
}

function initSearch() {
  executeSearch = () => {
    clear();
    term = searchinput.value.trim();
    if (term != "") {
      searchrecurse(tree, term);
    }
  };
  clear = () => {
    searchResultList.innerHTML = "";
  };

  onEnter = (event) => {
    //Enter Key
    if (event.keyCode == 13) {
      executeSearch();
    }
  };

  //#endregion
  document.getElementById("searchinput").onkeydown = onEnter;
  document.getElementById("clearbutton").onclick = clear;
  document.getElementById("search-execute-button").onclick = executeSearch;
}
async function searchrecurse(node, term) {
  if (node != null && node.url != undefined) {
    // is bookmark
    //todo rate accuracy of result for sorting
    if (node.title.toLowerCase().includes(term.toLowerCase())) {
      searchResultList.appendChild(drawBookMarkLink("li", node, 0, false));
    }
  } else if (node != null && node.id != undefined) {
    //is folder
    if (globalBookmarkTreeOptions.skipFolders.indexOf(node.title) == -1) {
      node.children.forEach((e) => {
        searchrecurse(e, term);
      });
    }
  }
}
