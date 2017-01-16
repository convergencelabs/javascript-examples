Convergence.connectAnonymously(DOMAIN_URL).then(function(domain) {
  return domain.models().open("input-binder", "test", function() {
    return defaultData;
  });
}).then(function(model) {
  const textInput = document.getElementById("textInput");
  ConvergenceInputElementBinder.bindTextInput(textInput, model.elementAt("textInput"));

  const textArea = document.getElementById("textArea");
  ConvergenceInputElementBinder.bindTextInput(textArea, model.elementAt("textArea"));

  const numberInput = document.getElementById("numberInput");
  ConvergenceInputElementBinder.bindNumberInput(numberInput, model.elementAt("numberInput"));

  const checkboxInput = document.getElementById("checkboxInput");
  ConvergenceInputElementBinder.bindCheckboxInput(checkboxInput, model.elementAt("checkboxInput"));

  const rangeInput = document.getElementById("rangeInput");
  ConvergenceInputElementBinder.bindRangeInput(rangeInput, model.elementAt("rangeInput"));

  const colorInput = document.getElementById("colorInput");
  ConvergenceInputElementBinder.bindColorInput(colorInput, model.elementAt("colorInput"));

  const singleSelect = document.getElementById("singleSelect");
  ConvergenceInputElementBinder.bindSingleSelect(singleSelect, model.elementAt("singleSelect"));

  const multiSelect = document.getElementById("multiSelect");
  ConvergenceInputElementBinder.bindMultiSelect(multiSelect, model.elementAt("multiSelect"));

  const radioInputs = [];
  radioInputs.push(document.getElementById("radio1"));
  radioInputs.push(document.getElementById("radio2"));
  radioInputs.push(document.getElementById("radio3"));
  ConvergenceInputElementBinder.bindRadioInputs(radioInputs, model.elementAt("radioInputs"));
}).catch(function(error) {
  console.error(error);
});

const defaultData = {
  textInput: "textInput",
  textArea: "textArea",
  numberInput: 10,
  rangeInput: 5,
  checkboxInput: true,
  colorInput: "#0000FF",
  singleSelect: "one",
  multiSelect: ["one", "three"],
  radioInputs: "two"
};