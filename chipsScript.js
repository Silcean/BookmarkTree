let currentChipsValues = ["test", "baum", "tits"];
//TODO apply this to settings
function createChips() {
  const chipscontainer = CreateDivWithClass("chips", "chips-container");
  const currentChipsContainer = CreateDivWithClass(
    "chips",
    "current-chips-container"
  );
  const textInputField = CreateElementWithClass("input");
  const addChipsButton = CreateElementWithClass("button");
  addChipsButton.onclick = () => {
    const newvalue = textInputField.value;
    if (currentChipsValues.indexOf(newvalue) == -1 && newvalue != "") currentChipsValues.push(newvalue);
    textInputField.value = "";
    renderChips();
  };
  textInputField.type = "text";
  chipscontainer.appendChildren([
    currentChipsContainer,
    textInputField,
    addChipsButton,
  ]);
  //create input field with enter button
  return chipscontainer;
}
function createSingleChip(name) {
  const chipcontainer = CreateDivWithClass("single-chip", getChipId(name));
  const label = CreateElementWithClass("span");

  label.innerHTML = name;
  const button = CreateElementWithClass("button");
  button.onclick = () => removeChip(name);
  button.innerHTML = "remove";
  chipcontainer.appendChild(label);
  chipcontainer.appendChild(button);
  return chipcontainer;
}
function removeChip(name) {
  const index = currentChipsValues.indexOf(name);
  if (index != -1) {
    currentChipsValues.splice(index, 1);
    const chipelement = document.getElementById(getChipId(name));
    chipelement.remove();
  }
  renderChips();
}

function renderChips() {
  const container = document.getElementById("current-chips-container");
  container.innerHTML = "";
  console.log(currentChipsValues);
  for (let index = 0; index < currentChipsValues.length; index++) {
    container.appendChild(createSingleChip(currentChipsValues[index]));
  }
}

function getChipId(name) {
  return "single-chip-id-" + name;
}
