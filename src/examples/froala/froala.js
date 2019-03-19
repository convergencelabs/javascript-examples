// Connect to the domain.  See ../config.js for the connection settings.
const initialContents = "Here is some initial rich text with a <b>bold</b> section and some <i>italics</i>.";

Convergence.connectAnonymously(CONVERGENCE_URL)
  .then(d => {
    domain = d;

    const initialData = ConvergenceDomUtils.DomConverter.htmlToJson(initialContents);
    // Now open the model, creating it using the initial data if it does not exist.
    return domain.models().openAutoCreate({
      collection: "example-froala",
      id: convergenceExampleId,
      data: initialData,
      ephemeral: true
    })
  })
  .then(handleOpen)
  .catch(error => {
    console.error("Could not open model: " + error);
  });

function handleOpen(model) {
  $(function() {
    $("#loading").remove();

    const textArea = $('#froala');
    textArea.froalaEditor(FROALA_OPTIONS);

    // This is a little trick to get a reference to the editor object. Perhaps there is an easier way?
    let froalaEditor;
    textArea.on('froalaEditor.html.set', function (e, editor, inputEvent) {
      froalaEditor = editor;
    });
    textArea.froalaEditor('html.set', ConvergenceDomUtils.DomConverter.jsonToNode(model.root().value()).innerHTML);

    const binder = new ConvergenceDomUtils.DomBinder(froalaEditor.el, model.root());
  });
}

const TOOLBAR_BUTTONS = ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'];

const FROALA_OPTIONS = {
  toolbarInline: false,
  toolbarButtons: TOOLBAR_BUTTONS,
  toolbarButtonsSM: TOOLBAR_BUTTONS,
  toolbarButtonsMD: TOOLBAR_BUTTONS,
  toolbarButtonsXS: TOOLBAR_BUTTONS,
  height: 300
};


