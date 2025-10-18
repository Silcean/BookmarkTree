const left = document.getElementById("layout-bm-and-search");
const right = document.getElementById("layout-favorites-container");
const divider = document.getElementById("layout-divider");
const settlingsList = document.getElementById("settings-list");

let isDragging = false;

const minPercent = 20;
const maxPercent = 90;
console.log("divider", divider);
divider.addEventListener("mousedown", () => {
  isDragging = true;
  document.body.classList.add("is-dragging");
  setTransitionEnabled(false);
  setSettingsWindowsTransparency(true)
});
window.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.classList.remove("is-dragging");
  setTransitionEnabled(true);
  setSettingsWindowsTransparency(false)

});
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const totalWidth = window.innerWidth;
  let percent = (e.clientX / totalWidth) * 100;

  if (percent < minPercent) percent = minPercent;
  if (percent > maxPercent) percent = maxPercent;
  writeDividerValuesToDom(percent);
  saveLayoutWidth(percent);
});

function setTransitionEnabled(enabled) {
  const value = enabled ? "width 0.2s ease" : "none";
  left.style.transition = value;
  right.style.transition = value;
  divider.style.transition = enabled ? "background 0.2s ease" : "none";
}


function setSettingsWindowsTransparency(isTransparent){
  settlingsList.style.opacity=isTransparent?0.5:1
}
const saveLayoutWidth = debounce((widthPercent) => {
  console.log("saving width percentage");
  setOptions({ dividerWidth: widthPercent });
}, 300);

function writeDividerValuesToDom(percentage) {
  left.style.width = percentage + "%";
  right.style.width = 100 - percentage + "%";
  divider.style.right = 100 - percentage + "%";
}
