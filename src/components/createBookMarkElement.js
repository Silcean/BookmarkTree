drawBookMarkLink = (containerType, obj, depth, shouldDrawTrashCan) => {
  if (!obj) return;
  var container = CreateElementWithClass(
    containerType,
    "bookmark-line-element " +
      getLinkToBookmarkClass(obj.id) +
      " " +
      getDepthClass(depth)
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
        }
      }
    }
  );
}
