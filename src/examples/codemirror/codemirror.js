// Connect to the domain.  See ../config.js for the connection settings.

const username = randomDisplayName();

Convergence.connectAnonymously(CONVERGENCE_URL, username)
  .then(domain => {
    return domain.models().openAutoCreate({
      collection: "example-codemirror",
      id: convergenceExampleId,
      data: {text: defaultEditorContents},
      ephemeral: true
    })
  })
  .then((model => {
    const editor = new CodeMirror(document.getElementById("codemirror-editor"), {
      mode: 'javascript',
      value: defaultEditorContents,
      lineNumbers: true
    });

    const adapter = new CodeMirrorConvergenceAdapter(editor, model.elementAt("text"));
    adapter.bind();

    exampleLoaded();
  }))
  .catch(error => {
    console.error("Could not open model ", error);
  });
