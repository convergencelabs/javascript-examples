const editable = document.getElementById("editable");

Convergence.connectAnonymously(CONVERGENCE_URL).then(domain => {
  return domain.models().openAutoCreate({
    collection: "example-content-editable",
    id: convergenceExampleId,
    data: () => {
      return ConvergenceDomUtils.DomConverter.htmlToJson(
        "Here is some initial text with a <b>bold</b> section and some <i>italics</i>."
      );
    },
    ephemeral: true
  });
}).then(model => {
  new ConvergenceDomUtils.DomBinder(editable, model);
  editable.contentEditable = "true";
  exampleLoaded();
});
