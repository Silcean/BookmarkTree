drawBookMarkLink = (containerType, obj, depth, shouldDrawTrashCan) => {
  if (!obj) return;
  var container = CreateElementWithClass(
    containerType,
    "bookmark-line-element " + getLinkToBookmarkClass(obj.id) + " " + getDepthClass(depth)
  );

  var titlespan = document.createElement("span");
  titlespan.innerHTML += obj.title;
  drawBookmarkIcon(obj.url);

  let a = document.createElement("a");
  a.href = obj.url;

  a.appendChild(drawBookmarkIcon(obj.url));
  a.appendChild(titlespan);
  container.appendChild(a);
  if (shouldDrawTrashCan) container.appendChild(createDeleteButton(obj.id));
  return container;
};
