function createTextInput(
  callback,
  iconstring,
  shouldClearInputAfterButtonPress
) {
  function applyChange() {
    const test = () => callback(textInputField.value);
    test();
    if (shouldClearInputAfterButtonPress) {
      textInputField.value = "";
    }
  }
  const inputContainer = CreateDivWithClass("input-field-container");
  const textInputField = CreateElementWithClass("input", "text-input");
  const applyButton = CreateElementWithClass(
    "button",
    "text-input-apply-button"
  );
  applyButton.onclick = () => {
    applyChange();
  };
  inputContainer.onkeydown = (event) => {
    if (event.key == "Enter") {
      applyChange();
    }
  };

  applyButton.innerHTML = iconstring;
  textInputField.type = "text";
  inputContainer.appendChildren([textInputField, applyButton]);
  return inputContainer;
}

function createTextInputWithLabel(
  labelstring,
  callback,
  iconstring,
  shouldClearInputAfterButtonPress
) {
  const container = CreateDivWithClass("text-input-label");
  const inputfield = createTextInput(
    callback,
    iconstring,
    shouldClearInputAfterButtonPress
  );
  const inputLabel = CreateElementWithClass("span");
  inputLabel.innerHTML = labelstring;
  container.appendChildren([inputLabel, inputfield]);
  //create input field with enter button
  return container;
}
