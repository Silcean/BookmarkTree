var tree;
var tabsWaitingForTree = [];
console.log("WORKER: init backgroundscript");
chrome.runtime.onStartup.addListener(() => {
  console.log(`onStartup()`);
});
//respondes to request for the bookmark tree from tabs
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.message === "wantTreeUwU") {
    sendResponse(getTreeResonse(sender.tab.id));
  } else if (request.message === "isDefaultIcon") {
    setTimeout(async () => {
      const result = await DefaultIconHandler(
        request.data.url,
        request.data.defaultIconString
      );
      if (result)
        // console.log("WORKER: Found default image for url:", request.data.url);
      sendResponse(result);
    });
    // Important! Return true to indicate you want to send a response asynchronously
    return true;
  } else if (request.deleteBm != undefined) {
    sendResponse(tryDeleteBookmark(request, sendResponse));
  } else if (request.getPath != undefined) {
    sendResponse({ getPath: chrome.runtime.getURL(request.getPath) });
  }
});

function tryDeleteBookmark(request, sendResponse) {
  try {
    chrome.bookmarks.remove(request.deleteBm, function () {
      console.log("WORKER: deleted" + request.deleteBm);
      updateTree();
      return { deleteBm: "success" };
    });
  } catch (error) {
    return { deleteBm: "failure" };
  }
}

function getTreeResonse(tabid) {
  if (tree == undefined) {
    //if the tree has not loaded yet, add tab to array
    tabsWaitingForTree.push(tabid);
    console.log(
      "WORKER: No existing tree, added tab '",
      tabsWaitingForTree + "' to waiting"
    );
    loadTree(1);
    return { message: "NoTree" };
  } else {
    //sends tree
    console.log("WORKER: Sending Tree");
    return { message: tree };
  }
}

async function DefaultIconHandler(iconUrl, defaultBase64) {
  try {
    const [fetchedBuffer, defaultBuffer] = await Promise.all([
      getImageBuffer(iconUrl),
      base64ToArrayBuffer(defaultBase64),
    ]);

    const isDefault = compareBuffers(fetchedBuffer, defaultBuffer);
    return { isDefault };
  } catch (error) {
    console.error("WORKER: icon compare error", error);
    return { error: error.message };
  }
}

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
function getImageBuffer(url) {
  if (typeof browser !== "undefined") {
    return getImageAsArrayBufferFirefox(url);
  } else if (typeof chrome !== "undefined") {
    return getImageBufferChrome(url);
  } else {
    return getImageAsArrayBufferFirefox(url);
  }
}

async function getImageBufferChrome(url) {
  // console.log("attempting to fetch", url);
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("Failed to fetch image: " + response.statusText);
  const blob = await response.blob();
  return await blob.arrayBuffer();
}

async function getImageAsArrayBufferFirefox(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else if (xhr.status === 404) {
        // This took me 4h for some reason firefox handles this differently than chrome.
        // This returns valid image. god lord knows why
        resolve(xhr.response);
      } else {
        console.log("xhr error", xhr.response, url);
        reject(
          new Error(`Request failed with status ${xhr.status},${xhr.response}`)
        );
      }
    };

    xhr.onerror = (error) => reject(new Error("Network error", error));
    xhr.send();
  });
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64.split(",")[1]);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function compareBuffers(buf1, buf2) {
  if (buf1.byteLength !== buf2.byteLength) return false;
  const v1 = new Uint8Array(buf1);
  const v2 = new Uint8Array(buf2);
  for (let i = 0; i < v1.length; i++) {
    if (v1[i] !== v2[i]) return false;
  }
  return true;
}
