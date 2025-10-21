/* #region Initial Variables */
console.log("init contentscript");

let relpath = chrome.runtime.getURL("/");
console.log("extension path=" + relpath);

let tree;
let currentlyActive = [];

let favoritesListContainer;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.giveTreeUwU != undefined) {
    var localtree = request.giveTreeUwU[0];
    console.log("Tree sent from Worker: ", localtree);
    if (isFirstInit()) {
      init();
      tree = localtree;
    } else {
      tree = localtree;
      drawTree();
    }
  } else if (request.updateTree != undefined) {
    //todo actuallly update the fucking tree
    sendResponse({ updateTree: "reveived" });
  }
});

//Main Entry point
chrome.runtime.sendMessage({ message: "wantTreeUwU" }, (response) => {
  if (response.message != "NoTree") {
    tree = response.message[0];
    console.log("tree from tabload:", tree);
    if (isFirstInit()) {
      init();
    } else {
      drawTree();
    }
  } else if (response.message == "NoTree") {
    console.log(
      "No existing tree from tabload, tree will be sent when it is loaded"
    );
  }
});

/*#endregion*/
function isFirstInit() {
  if (!globalBookmarkTreeOptions) return true;
  if (!tree) return true;
  if (Object.keys(globalBookmarkTreeOptions).length === 0) return true;
  return false;
}

function init() {
  console.log("Initialising application");
  favoritesListContainer = document.getElementById("favoritesList");
  ToggleSwitchListener("enableSearchInput", "enableSearch");
  ToggleSwitchListener("enableFavoritesInput", "enableFavorites");
  ToggleSwitchListener("enableBookmarkTreeInput", "enableTree");
  initSearch();
  chrome.storage.sync.get("bookmark-tree-settings", function (obj) {
    let localOptions;
    if (!obj || Object.keys(obj).length === 0) {
      localOptions = defaultOptions;
    } else {
      localOptions = obj["bookmark-tree-settings"];
    }
    globalBookmarkTreeOptions = localOptions;
    setOptions(localOptions, false);
    initSettings(localOptions);
    writeDividerValuesToDom(localOptions.dividerWidth);
    drawTree();
    return obj;
  });
}

function removeBm(bmid) {
  console.log("remove", bmid);
  try {
    let id = document.getElementById(getLinkToBookmarkId(bmid));
    id.style.display = "none";
  } catch (error) {}
  chrome.runtime.sendMessage({ deleteBm: bmid });
}

function removeFromActiveArray(id) {
  let filtered = currentlyActive.filter(function (value) {
    return value.id !== id;
  });
  currentlyActive = filtered;
  setOptions({ openedFolders: currentlyActive.map((x) => x.id) });
}

function addToActiveArray(element) {
  currentlyActive.push(element);
  setOptions({ openedFolders: currentlyActive.map((x) => x.id) });
}

function drawTree() {
  let depth = 0;
  let thumbnaildiv = CreateDivWithClass("thumbnailcontainer");
  let displaydiv = CreateDivWithClass("displaycontainer");
  let bmdiv = CreateDivWithClass("bmcontainer");
  clearFavorites();
  bm.innerHTML = "";
  bm.appendChildren([thumbnaildiv, displaydiv, bmdiv]);
  recursiveDrawObj(tree, thumbnaildiv, displaydiv, bmdiv, depth);

  if (favoritesListContainer.innerHTML == "") {
    favoritesListContainer.innerHTML =
      "<li><div>No Favorites selected. Select a bookmarkfolder in settings to pin sites to quickaccess, or disable favorites in settings</div></li>";
  }

  globalBookmarkTreeOptions.openedFolders.forEach((e) => {
    const foundElement = document.getElementById(e);
    if (foundElement) {
      toggleFolderbyClassIntoDisplaydiv(foundElement);
    } else {
      //TODO remove from array
    }
  });
}

function toggleFolderbyClassIntoDisplaydiv(sender) {
  console.log("Click on Folder: " + sender.id);
  let objectsfolder = document.getElementById(getFolderContentId(sender.id));
  let classes = objectsfolder.className.split(" ");
  if (classes.indexOf("active") != -1) {
    //isopen=> set to collapse
    objectsfolder.classList.remove("active");
    sender.classList.remove("active");
    removeFromActiveArray(sender.id);
  } else {
    //iscollapes => set to open
    //see if other thumbnail in same region is open
    let elementActiveInSameDisplayContainer = currentlyActive.find(
      (elem) => elem.class === classes[1]
    );
    if (elementActiveInSameDisplayContainer != undefined) {
      // one is open

      //remove display
      let activediv = document.getElementById(
        getFolderContentId(elementActiveInSameDisplayContainer.id)
      );
      activediv.classList.remove("active");
      //remove active status from thumbnail

      let activethumbnail = document.getElementById(
        elementActiveInSameDisplayContainer.id
      );
      activethumbnail.classList.remove("active");
      //remove from list of currently active thumbnails
      removeFromActiveArray(elementActiveInSameDisplayContainer.id);
    }
    addToActiveArray({
      name: sender.innerHTML,
      class: classes[1],
      id: sender.id,
    });
    objectsfolder.classList.add("active");
    sender.classList.add("active");
  }
}

function recursiveDrawObj(obj, thumbnaildiv, displaydiv, bmdiv, depth) {
  if (globalBookmarkTreeOptions.skipFolders.indexOf(obj.title) != -1) {
    return;
  }

  if (obj.title == "" && obj.children) {
    obj.children.forEach((e) => {
      recursiveDrawObj(e, thumbnaildiv, displaydiv, bmdiv, depth);
    });
  } else {
    if (obj && obj.url != undefined) {
      // is bookmark
      bmdiv.appendChild(drawBookMarkLink("div", obj, depth, true));
    } else if (obj != null && obj.id != undefined) {
      if (obj.title == globalBookmarkTreeOptions.favoriteFolderIdentifier) {
        drawFavorites(obj);
      }
      //is folder
      depth++;
      if (obj.children.length != 0) {
        //do not draw empty folders
        drawFolder(obj, thumbnaildiv, displaydiv, depth);
      }
    }
  }
}

function drawFolder(obj, superthumbnaildiv, superdisplaydiv, depth) {
  /*
    div structure:
    <div class="folder">
        <div id=obj.id >Foldertitle</div>
        <div class='contentdiv>
            <div class='line'></div>
            <div class='content'>
                <div class='thumbnailcontainer'>//only contains clickable divs, no actual content
                    <div id=1 class="thumbnail">
                    <div id=2 class="thumbnail">
                    <div id=3 class="thumbnail">
                    <div id=4 class="thumbnail">
                </div>
                <div classname='displaycontainer' id=obj.id'+displaycontainer'>//holds all the actual content, only ona at time set visible
                    <div id=displaycontent1 ></div>
                    <div id=displaycontent2 ></div>
                    <div id=displaycontent3 ></div>
                    <div id=displaycontent4 ></div>
                </div>
                <div class='bmcontainer'>
                bms
                </div>
            </div>
            <div class='line'></div>
        </div>
    </div>
    */
  var thumbnail = CreateDivWithClass("thumbnail", obj.id);
  thumbnail.onclick = function (e) {
    toggleFolderbyClassIntoDisplaydiv(e.target);
  };
  //folder title
  thumbnail.innerHTML = obj.title;
  superthumbnaildiv.appendChild(thumbnail);

  //containerdiv, is unique to every folder
  let contentcontainer = CreateDivWithClass(
    "contentcontainer " +
      getDisplayFolderContentId(superdisplaydiv.id) +
      " " +
      getDepthClass(depth),
    getFolderContentId(obj.id)
  );

  //contentdiv
  let content = CreateDivWithClass("content");
  contentcontainer.appendChildren([
    CreateDivWithClass("line"),
    content,
    CreateDivWithClass("line"),
  ]);
  //extra div for all the thumbnails
  //cause css cannot handle it elsewise
  let thumbnaildiv = CreateDivWithClass("thumbnailcontainer");
  //displaycontainer. holds the actual content the thumbnails link to
  let displaydiv = CreateDivWithClass(
    "displaycontainer",
    "displaycontainer-" + obj.id
  );
  //extra div for all the bookmarks
  //cause css cannot handle it elsewise
  let bmdiv = CreateDivWithClass("bmcontainer");
  content.appendChildren([thumbnaildiv, displaydiv, bmdiv]);
  //add children
  obj.children.forEach((e) => {
    if (globalBookmarkTreeOptions.skipFolders.indexOf(e.title) != -1) {
      return;
    }
    recursiveDrawObj(e, thumbnaildiv, displaydiv, bmdiv, depth);
  });
  superdisplaydiv.appendChild(contentcontainer);
  depth++;
}

function createDeleteButton(id) {
  const button = CreateElementWithClass("button", "icon-button");
  button.onclick = () => removeBm(id);
  button.innerHTML = trashIcon();
  return button;
}

function drawFavorites(inputFolder) {
  var sites = inputFolder.children;
  for (let i = 0; i < sites.length; i++) {
    //filter folders
    if (!sites[i].url) return;
    favoritesListContainer.innerHTML +=
      "<li>" +
      '<a href="' +
      sites[i].url +
      '" >' +
      '<div class=imgtile ><img  src="' +
      getFaviconUrl(sites[i].url) +
      '" ></div>  ' +
      sites[i].title +
      "</a></li>";
  }
}

function clearFavorites() {
  favoritesListContainer.innerHTML = "";
}

function ToggleSwitchListener(switchId, optionsKey) {
  document.getElementById(switchId).addEventListener("click", () => {
    var checkBox = document.getElementById(switchId);
    let empty = {};
    empty[optionsKey] = checkBox.checked;
    setOptions(empty);
  });
}

function SetToggleSwitchValue(switchId, value) {
  document.getElementById(switchId).checked = value;
}

function setFavoritesEnabled(isEnabled) {
  document.body.classList.toggle("favorites-disabled", !isEnabled);
  SetToggleSwitchValue("enableFavoritesInput", isEnabled);
}

function setTreeEnabled(isEnabled) {
  document.body.classList.toggle("bookmark-disabled", !isEnabled);
  SetToggleSwitchValue("enableBookmarkTreeInput", isEnabled);
}
