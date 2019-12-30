// Connect to the domain.  See ../config.js for the connection settings.
const username = randomDisplayName();

Convergence.connectAnonymously(CONVERGENCE_URL, username)
  .then(domain => {
    return domain.models().openAutoCreate({
      collection: "example-easymde",
      id: convergenceExampleId,
      data: { text: defaultEditorContents},
      ephemeral: true
    })
  })
  .then((model) => {
    const element = document.getElementById("easymde-editor");
    const editor = new EasyMDE({element: element});
    const adapter = new CodeMirrorConvergenceAdapter(editor.codemirror, model.elementAt("text"));
    adapter.bind();
    exampleLoaded();
  })
  .catch(error => {
    console.error("Could not open model ", error);
  });