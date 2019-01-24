const colorAssigner = new ColorAssigner();
let textEditor;
let localSelectionReference;

const username = "User-" + (Math.floor(Math.random()*900000) + 100000);
document.getElementById("username").innerHTML = username;

Convergence.connectAnonymously(DOMAIN_URL, username).then(domain => {
  return domain.models().openAutoCreate({
    collection: "examples",
    id: "collab-textarea",
    data: defaultData
  });
}).then(model => {
  const textarea = document.getElementById("textarea");
  const rts = model.elementAt(["text"]);

  // Set the initial data, and set the cursor to the beginning.
  textarea.value = rts.value();
  textarea.selectionStart = 0;
  textarea.selectionEnd = 0;

  // Create the editor and set up two way data binding.
  textEditor = new HtmlTextCollabExt.CollaborativeTextEditor({
    control: textarea,
    onInsert: (index, value) => rts.insert(index, value),
    onDelete: (index, length) => rts.remove(index, length),
    onSelectionChanged: sendLocalSelection
  });

  rts.on(Convergence.StringInsertEvent.NAME, (e) => textEditor.insertText(e.index, e.value));
  rts.on(Convergence.StringRemoveEvent.NAME, (e) => textEditor.deleteText(e.index, e.value.length));

  // handle reference events
  initSharedSelection(rts);

}).catch(error => {
  console.error(error);
});

function sendLocalSelection() {
  const selection = textEditor.selectionManager().getSelection();
  localSelectionReference.set({start: selection.anchor, end: selection.target});
}

function initSharedSelection(rts) {
  localSelectionReference = rts.rangeReference("selection");

  const references = rts.references({key: "selection"});
  references.forEach((reference) => {
    if (!reference.isLocal()) {
      addSelection(reference);
    }
  });

  sendLocalSelection();
  localSelectionReference.share();

  rts.on("reference", (e) => {
    if (e.reference.key() === "selection") {
      this.addSelection(e.reference);
    }
  });
}

function addSelection(reference) {
  const color = colorAssigner.getColorAsHex(reference.sessionId());
  const remoteRange = reference.value();

  const selectionManager = textEditor.selectionManager();

  selectionManager.addCollaborator(
    reference.sessionId(),
    reference.user().displayName,
    color,
    {anchor: remoteRange.start, target: remoteRange.end});

  reference.on("cleared", () => selectionManager.removeCollaborator(reference.sessionId()) );
  reference.on("disposed", () => selectionManager.removeCollaborator(reference.sessionId()) );
  reference.on("set", (e) => {
    const selection = reference.value();
    const collaborator = selectionManager.getCollaborator(reference.sessionId());
    collaborator.setSelection({anchor: selection.start, target: selection.end});
    if (!e.synthetic) {
      collaborator.flashCursorToolTip(2);
    }
  });
}

const defaultData = {
  text: TEXT_DATA,
};
