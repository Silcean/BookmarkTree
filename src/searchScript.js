function setSearchEnabled(isEnabled) {
  searchParentContainer.style = !isEnabled ? "display: none;" : "";
  SetToggleSwitchValue("enableSearchInput", isEnabled);
}
let searchParentContainer;
let searchInputField;
let searchClearButton;
let searchExecuteButton;

function initSearch() {
  searchParentContainer = document.getElementById("search");
  searchInputField = document.getElementById("searchinput");
  searchClearButton = document.getElementById("clearbutton");
  searchExecuteButton = document.getElementById("search-execute-button");

  executeSearch = () => {
    searchResultList.innerHTML = "";
    term = searchinput.value.trim();
    if (term != "") {
      searchrecurse(tree, term);
    }
  };
  clear = () => {
    searchResultList.innerHTML = "";
    searchInputField.value = "";
  };

  onEnter = (event) => {
    //Enter Key
    if (event.keyCode == 13) {
      executeSearch();
    }
  };

  //#endregion
  searchInputField.onkeydown = onEnter;
  searchClearButton.onclick = clear;
  searchExecuteButton.onclick = executeSearch;
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
