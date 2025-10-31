class Chips {
  currentChipsValues = [];
  containerId = "";
  changeCallback = (folderNames) => {
    console.log("Chips call updated ", folderNames);
  };
  constructor(containerId, strings, changeCallback) {
    this.containerId = containerId;
    if (changeCallback) this.changeCallback = changeCallback;
    if (strings) {
      for (const tag of strings) {
        this.currentChipsValues.push(tag);
      }
    }
    this.createChips();
  }

  createChips() {
    const chipscontainer = CreateDivWithClass("chips", "chips-container");
    const currentChipsContainer = CreateDivWithClass(
      "chips current-chips-container",
      this.getCurrentChipsContainerid()
    );
    const clickhandler = (newvalue) => {
      if (this.currentChipsValues.indexOf(newvalue) == -1 && newvalue != "")
        this.currentChipsValues.push(newvalue);
      this.updateChips();
    };
    const inputfield = createTextInputWithLabel("Add folder name to skip list:",clickhandler, addIcon(), "", true);
    chipscontainer.appendChildren([
      CreateDivWithClass("spacer"),
      inputfield,
      currentChipsContainer,
    ]);
    document.getElementById(this.containerId).appendChild(chipscontainer);
    this.renderChips();
  }

  createSingleChip(name) {
    const chipcontainer = CreateDivWithClass(
      "single-chip",
      this.getChipId(name)
    );
    const label = CreateElementWithClass("span");
    label.textContent = name;
    const button = CreateElementWithClass("button", "text-input-apply-button");
    button.onclick = () => this.removeChip(name);
    button.innerHTML = closeIcon();
    chipcontainer.appendChild(label);
    chipcontainer.appendChild(button);
    return chipcontainer;
  }

  removeChip(name) {
    const index = this.currentChipsValues.indexOf(name);
    if (index != -1) {
      this.currentChipsValues.splice(index, 1);
      const chipelement = document.getElementById(this.getChipId(name));
      chipelement.remove();
    }
    this.updateChips();
  }

  addChip(name) {
    this.currentChipsValues.push(name);
    this.updateChips();
  }

  updateChips() {
    this.renderChips();
    this.changeCallback(this.currentChipsValues);
  }

  renderChips() {
    const container = document.getElementById(
      this.getCurrentChipsContainerid()
    );
    container.textContent = "";
    for (let index = 0; index < this.currentChipsValues.length; index++) {
      container.appendChild(
        this.createSingleChip(this.currentChipsValues[index])
      );
    }
  }

  getChipId(name) {
    return this.containerId + "-width-single-chip-" + name;
  }

  getCurrentChipsContainerid() {
    return "current-chips-container-" + this.containerId;
  }
}
