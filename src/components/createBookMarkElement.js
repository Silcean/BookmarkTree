drawBookMarkLink = (containerType, obj, depth, shouldDrawTrashCan) => {
  if (!obj) return;
  var container = CreateElementWithClass(
    containerType,
    "bookmark-line-element " + getDepthClass(depth),
    getLinkToBookmarkId(obj.id)
  );

  var titlespan = document.createElement("span");
  titlespan.innerHTML += obj.title;

  let a = document.createElement("a");
  a.href = obj.url;
  const originalElement = drawBookmarkIcon(obj.url);
  const fallbackElement = drawFallbackIcon();
  fallbackElement.style.display = "none";
  a.appendChild(originalElement);
  a.appendChild(fallbackElement);
  a.appendChild(titlespan);
  startfallbackTrack(obj.url, originalElement, fallbackElement);
  container.appendChild(a);
  if (shouldDrawTrashCan) container.appendChild(createDeleteButton(obj.id));
  return container;
};
let triedAttempt = 0;
let maxAttempt = 5;
async function startfallbackTrack(url, originalElement, fallbackElement) {
  const earlyReturn = await checkNoDefaultForUrlInStorage(url);
  if (earlyReturn) {
    // console.log("cache says ", url, " is no default image");
    return;
  }
  const newUrl = getFaviconUrl(url);
  const defaultString = getDefaultCompareString();
  // if (triedAttempt>maxAttempt) return;
  triedAttempt++;
  chrome.runtime.sendMessage(
    {
      message: "isDefaultIcon",
      data: {
        url: newUrl,
        defaultIconString: defaultString,
      },
    },
    (response) => {
      if (response.error) {
        console.error("Error:", response.error);
      } else {
        if (response.isDefault) {
          originalElement.style.display = "none";
          fallbackElement.style.display = "unset";
        } else {
          setNoDefautForUrlInStorage(url);
        }
      }
    }
  );
}
async function setNoDefautForUrlInStorage(url) {
  const key = new URL(url).hostname;
  await getStorageInterface().set({ [key]: true });
}

async function checkNoDefaultForUrlInStorage(url) {
  const key = new URL(url).hostname;
  const res = await getStorageInterface().get(key);
  if (res != undefined && Object.keys(res).length != 0) return true;
  return false;
}

function getStorageInterface() {
  if (typeof browser !== "undefined") {
    return browser.storage.local;
  } else if (typeof chrome !== "undefined") {
    return chrome.storage.local;
  } else {
    return browser.storage.local;
  }
}
