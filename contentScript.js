/* #region Initial Variables */
let globalBookmarkTreeOptions = {};
let defaultOptios = {
  enableSearch: true,
  skipFolders: ["Mozilla Firefox"],
  favoriteFolderIdentifier: "Favorites",
  preactivatedList: ["Bookmarks", "Kategorie"],
};

let relpath = chrome.runtime.getURL("/");
console.log("extension path=" + relpath);

let tree;
let currentlyActive = [];
let toactivatelist = [];
let onclicklisteners = [];

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
  initSearch();
  chrome.storage.sync.get("bookmark-tree-settings", function (obj) {
    localOptions = obj;
    if (!obj || Object.keys(obj).length === 0) {
      localOptions = defaultOptios;
      setOptions(localOptions);
      console.log("initialised options object in sync storage", localOptions);
    } else {
      consumeOptionsUpdate(obj["bookmark-tree-settings"]);
    }
    drawTree();
    return obj;
  });
}

function getOptions() {
  chrome.storage.sync.get("bookmark-tree-settings", function (obj) {
    globalBookmarkTreeOptions = obj["bookmark-tree-settings"];
    consumeOptionsUpdate(globalBookmarkTreeOptions);
    drawTree();
    return obj;
  });
}

function consumeOptionsUpdate(newOptions) {
  globalBookmarkTreeOptions = newOptions;
  console.log("apply loaded options", newOptions);
  setSearchEnabled(newOptions.enableSearch);
}

function setOptions(newOptions) {
  consumeOptionsUpdate(newOptions);
  chrome.storage.sync.set({ "bookmark-tree-settings": newOptions });
}

function removeBm(trashid) {
  let bmid = trashid.substring("remove".length, trashid.length);
  console.log("remove", bmid);
  try {
    let id = document.getElementById(bmid);
    id.style.display = "none";
  } catch (error) {}
  chrome.runtime.sendMessage({ deleteBm: bmid });
}

function removeFromActiveArray(element) {
  let filtered = currentlyActive.filter(function (value) {
    return value[0] !== element[0] && value[1] !== element[1];
  });
  currentlyActive = filtered;
}

function drawTree() {
  let depth = 0;
  let thumbnaildiv = CreateDivWithClass("thumbnailcontainer");
  let displaydiv = CreateDivWithClass("displaycontainer");
  let bmdiv = CreateDivWithClass("bmcontainer");
  bm.innerHTML = "";
  bm.appendChildren([thumbnaildiv, displaydiv, bmdiv]);
  recursiveDrawObj(tree, thumbnaildiv, displaydiv, bmdiv, depth);

  //preactivates a few things.
  toactivatelist.forEach((e) => {
    toggleFolderbyClassIntoDisplaydiv(document.getElementById(e));
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
    removeFromActiveArray([classes[1], sender.id]);
  } else {
    //iscollapes => set to open
    //see if other thumbnail in same region is open
    let elementActiveInSameDisplayContainer = currentlyActive.find(
      (elem) => elem[0] === classes[1]
    );
    if (elementActiveInSameDisplayContainer != undefined) {
      // one is open

      //remove display
      let activediv = document.getElementById(
        getFolderContentId(elementActiveInSameDisplayContainer[1])
      );
      activediv.classList.remove("active");
      //remove active status from thumbnail

      let activethumbnail = document.getElementById(
        elementActiveInSameDisplayContainer[1]
      );
      activethumbnail.classList.remove("active");
      //remove from list of currently active thumbnails
      removeFromActiveArray(elementActiveInSameDisplayContainer);
    }
    currentlyActive.push([classes[1], sender.id]);
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

  onclicklisteners.push(thumbnail.id);
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
    obj.id + "displaycontainer"
  );
  //extra div for all the bookmarks
  //cause css cannot handle it elsewise
  let bmdiv = CreateDivWithClass("bmcontainer");
  content.appendChildren([thumbnaildiv, displaydiv, bmdiv]);
  //add children
  obj.children.forEach((e) => {
    recursiveDrawObj(e, thumbnaildiv, displaydiv, bmdiv, depth);
  });
  superdisplaydiv.appendChild(contentcontainer);
  if (globalBookmarkTreeOptions.preactivatedList.indexOf(obj.title) != -1) {
    toactivatelist.push(obj.id);
  }
  depth++;
}

function drawTrashCan(id) {
  let imgtrash = drawTrashCanIcon(id);
  imgtrash.onclick = function (e) {
    removeBm(e.target.id);
  };
  onclicklisteners.push(imgtrash.id);
  return imgtrash;
}

function drawFavorites(test) {
  var sites = test.children;
  let list = document.getElementById("list");
  for (let i = 0; i < sites.length; i++) {
    list.innerHTML +=
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
