function CreateDivWithClass(classname, id) {
  const div = document.createElement("div");
  div.className = classname;
  if (id) div.id = id;
  return div;
}

function CreateElementWithClass(elementName, classname, id) {
  const div = document.createElement(elementName);
  div.className = classname;
  if (id) div.id = id;
  return div;
}

HTMLElement.prototype.appendChildren = function (children) {
  if (!Array.isArray(children)) {
    throw new Error("appendChildren expects an array of HTMLElements");
  }
  children.forEach((child) => {
    if (child instanceof HTMLElement) {
      this.appendChild(child);
    } else {
      throw new Error("All items in array must be HTMLElements");
    }
  });
};

HTMLElement.prototype.createChildDivWithClass = function (className) {
  const child = document.createElement("div");
  child.className += className;
  this.appendChild(child);
};

function getDepthClass(depth) {
  return "depths-" + depth;
}

function getFolderContentId(id) {
  return "folder-" + id + "-content";
}

function getDisplayFolderContentId(id) {
  return "inside-" + id;
}

function getLinkToBookmarkClass(id){
    return "link-to-bm-" + id
}