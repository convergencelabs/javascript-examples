// Connect to the domain.  See ../config.js for the connection settings.

const username = "User-" + Math.round(Math.random() * 10000);

//
// Create the target editor where events will be played into.
//
const editor = new CodeMirror(document.getElementById("codemirror-editor"), {
  mode: 'javascript',
  value: defaultEditorContents,
  lineNumbers: true
});

Convergence.connectAnonymously(CONVERGENCE_URL, username)
  .then(d => {
    domain = d;
    // Now open the model, creating it using the initial data if it does not exist.
    return domain.models().openAutoCreate({
      collection: "example-codemirror",
      id: convergenceExampleId,
      data: {
        "text": defaultEditorContents
      }
    })
  })
  .then(handleOpen)
  .catch(error => {
    console.error("Could not open model ", error);
  });


function handleOpen(model) {
  const adapter = new CodeMirrorConvergenceAdapter(editor, model.elementAt("text"));
  adapter.bind();
}
