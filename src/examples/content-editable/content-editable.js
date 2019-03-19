const editable = document.getElementById("editable");

Convergence.connectAnonymously(CONVERGENCE_URL).then(domain => {
  const initialData = ConvergenceDomUtils.DomConverter.htmlToJson(
    "Here is some initial text with a <b>bold</b> section and some <i>italics</i>."
  );
  return domain.models().openAutoCreate({
    collection: "example-content-editable",
    id: convergenceExampleId,
    data: initialData,
    ephemeral: true
  });
}).then(model => {
  const binder = new ConvergenceDomUtils.DomBinder(editable, model);
  editable.contentEditable = true;
});
