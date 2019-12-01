// Connect to the domain.  See ../config.js for the connection settings.
const username = randomDisplayName();

Convergence.connectAnonymously(CONVERGENCE_URL, username)
  .then(domain => {
    return domain.models().openAutoCreate({
      collection: "example-tui-editor",
      id: convergenceExampleId,
      data: { text: defaultEditorContents},
      ephemeral: true
    })
  })
  .then((model) => {
    const editor = new tui.Editor({
      el: document.getElementById('tui-editor'),
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      height: "500px",
      hideModeSwitch: true
    });

    const codemirror = editor.getCodeMirror();
    const adapter = new CodeMirrorConvergenceAdapter(codemirror, model.elementAt("text"));
    adapter.bind();

    exampleLoaded();
  })
  .catch(error => {
    console.error("Could not open model ", error);
  });