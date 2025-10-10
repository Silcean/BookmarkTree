let currentChipsValues = [
  "baum",
  "very long chipname",
  "tits",
  "an even longer more humongos, unecesasry elngthy chipname",
  "test",
];
//TODO apply this to settings
function createChips() {
  const chipscontainer = CreateDivWithClass("chips", "chips-container");
  const currentChipsContainer = CreateDivWithClass(
    "chips",
    "current-chips-container"
  );
  const addchipscontainer = CreateDivWithClass("add-chips-container");
  const textInputField = CreateElementWithClass("input", "text-input");
  const inputLabel = CreateElementWithClass("span");
  inputLabel.innerHTML = "Add folder name to skip list:";
  const addChipsButton = CreateElementWithClass("button", "chip-button");
  addChipsButton.innerHTML = addIcon();
  addChipsButton.onclick = () => {
    const newvalue = textInputField.value;
    if (currentChipsValues.indexOf(newvalue) == -1 && newvalue != "")
      currentChipsValues.push(newvalue);
    textInputField.value = "";
    renderChips();
  };
  textInputField.type = "text";
  addchipscontainer.appendChildren([textInputField, addChipsButton]);
  chipscontainer.appendChildren([
    inputLabel,
    addchipscontainer,
    currentChipsContainer,
  ]);
  //create input field with enter button
  return chipscontainer;
}

function createSingleChip(name) {
  const chipcontainer = CreateDivWithClass("single-chip", getChipId(name));
  const label = CreateElementWithClass("span");
  label.innerHTML = name;
  const button = CreateElementWithClass("button", "chip-button");
  button.onclick = () => removeChip(name);
  button.innerHTML = closeIcon();
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
