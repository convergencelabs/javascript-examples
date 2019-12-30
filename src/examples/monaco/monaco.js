// Connect to the domain.  See ../config.js for the connection settings.

const username = "User-" + Math.round(Math.random() * 10000);

define("monaco-example", [
  'vs/editor/editor.main',
  'Convergence',
  'MonacoConvergenceAdapter'], function (_, Convergence, MonacoConvergenceAdapter) {

  //
  // Create the target editor where events will be played into.
  //
  const editor = monaco.editor.create(document.getElementById("monaco-editor"), {
    value: defaultEditorContents,
    theme: "vs-dark'",
    language: 'javascript'
  });

  Convergence.connectAnonymously(CONVERGENCE_URL, username)
    .then(d => {
      domain = d;
      // Now open the model, creating it using the initial data if it does not exist.
      return domain.models().openAutoCreate({
        collection: "example-monaco",
        id: convergenceExampleId,
        data: {
          "text": defaultEditorContents
        }
      })
    })
    .then((model) => {
      const adapter = new MonacoConvergenceAdapter(editor, model.elementAt("text"));
      adapter.bind();
      exampleLoaded();
    })
    .catch(error => {
      console.error("Could not open model ", error);
    });
});
