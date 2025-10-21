function createTextInput(
  callback,
  iconstring,
  defaultValue,
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
  if (defaultValue) textInputField.value = defaultValue;
  inputContainer.appendChildren([textInputField, applyButton]);
  return inputContainer;
}

function createTextInputWithLabel(
  labelstring,
  callback,
  iconstring,
  defaultValue,
  shouldClearInputAfterButtonPress
) {
  const container = CreateDivWithClass("text-input-label");
  const inputfield = createTextInput(
    callback,
    iconstring,
    defaultValue,
    shouldClearInputAfterButtonPress
  );
  const inputLabel = CreateElementWithClass("span");
  inputLabel.innerHTML = labelstring;
  container.appendChildren([inputLabel, inputfield]);
  //create input field with enter button
  return container;
}

function createRaisedButton(innerHTML,onClick){
  const raisedButton = CreateElementWithClass(
    "button",
    "raised-text-icon-button"
  );
  raisedButton.innerHTML = innerHTML;
  raisedButton.style = "flex-grow: 1;";
  raisedButton.onclick = onClick;
  return raisedButton;
}