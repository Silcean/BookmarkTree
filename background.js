var tree;
var tabsWaitingForTree = [];
console.log("WORKER: init backgroundscript")
chrome.runtime.onStartup.addListener( () => {
    console.log(`onStartup()`);
});
//respondes to request for the bookmark tree from tabs
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(
    "WORKER: Message from: " + sender.tab.id + "  " + JSON.stringify(request)
  );
  if (request.message === "wantTreeUwU") {
    if (tree == undefined) {
      //if the tree has not loaded yet, add tab to array
      tabsWaitingForTree.push(sender.tab.id);
      console.log(
        "WORKER: No existing tree, added tab '",
        tabsWaitingForTree + "' to waiting"
      );
      sendResponse({ message: "NoTree" });
      loadTree(1);
    } else {
      //sends tree
      console.log("WORKER: Sending Tree");
      sendResponse({ message: tree });
    }
  } else if (request.deleteBm != undefined) {
    try {
      chrome.bookmarks.remove(request.deleteBm, function () {
        sendResponse({ deleteBm: "success" });
        console.log("WORKER: deleted" + request.deleteBm);
        updateTree();
      });
    } catch (error) {}
  } else if (request.getPath != undefined) {
    sendResponse({ getPath: chrome.runtime.getURL(request.getPath) });
  }
});

loadTree = async (firstload) => {
  chrome.bookmarks.getTree((result) => {
    //got tree
    console.log("WORKER: Loaded Bookmark Tree");
    tree = result;
    if (firstload == 1) {
      console.log(
        "WORKER: Sending Bookmarks to following Tabs: ",
        tabsWaitingForTree
      );
      //go through all saved tabs, which got proto object before
      tabsWaitingForTree.forEach((e) => {
        //sends tree
        chrome.tabs.sendMessage(e, { giveTreeUwU: tree });
        console.log("WORKER: Sent Tree to Tab " + e);
      });
      tabsWaitingForTree = []; //resets tabs
    }
  });
};

updateTree = async () => {
  tree = undefined;
  await loadTree();
  chrome.tabs.query({ title: "New Tab" }, (tabs) => {
    for (var i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(
        tabs[i].id,
        { updateTree: tree },
        function (response) {
          console.log(
            "WORKER: Tree Update Response from Tab:",
            response.updateTree
          );
        }
      );
    }
  });
};

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  //TODO This updates and rerenders the whole tree, maybe optimise so it only updates below changed id
  console.log(
    "WORKER: New Bookmark has been added, sending updated tree to tabs"
  );
  updateTree();
});

chrome.bookmarks.onMoved.addListener((id, bookmark) => {
  //TODO This updates and rerenders the whole tree, maybe optimise
  console.log("WORKER: Bookmark has been moved, sending updated tree to tabs");
  updateTree();
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
