const editable = document.getElementById("editable");

Convergence.connectAnonymously(DOMAIN_URL).then(function (domain) {
  return domain.models().open("content-editable", "test", function () {
    return ConvergenceDomUtils.DomConverter.htmlToJson(
      "Here is some initial text with a <b>bold</b> section and some <i>italics</i>."
    );
  });
}).then(function (model) {
  const binder = new ConvergenceDomUtils.DomBinder(editable, model);
  editable.contentEditable = true;
});
