// Connect to the domain.  See ../../config.js for the connection settings.
Convergence.connectAnonymously(DOMAIN_URL)
  .then(function (d) {
    domain = d;
    // Now open the model, creating it using the initial data if it does not exist.
    return domain.models().open("ace", "example", function () {
      return {
        "text": defaultEditorContents
      };
    })
  })
  .then(handleOpen)
  .catch(function (error) {
    console.error("Could not open model: " + error);
  });

var AceRange = ace.require("ace/range").Range;

var colorAssigner = new ColorAssigner();

var editor = null;
var session = null;
var doc = null;

function handleOpen(model) {
  editor = ace.edit("ace-editor");
  editor.setTheme('ace/theme/monokai');

  session = editor.getSession();
  session.setMode('ace/mode/javascript');

  doc = session.getDocument();

  var textModel = model.elementAt("text");

  initModel(textModel);
  initSharedCursors(textModel);
  initSharedSelection(textModel);

  var radarViewElement = document.getElementById("radar-view");
  initRadarView(textModel, radarViewElement);
}

/////////////////////////////////////////////////////////////////////////////
// Text Binding
/////////////////////////////////////////////////////////////////////////////
var suppressEvents = false;

function initModel(textModel) {
  var session = editor.getSession();
  session.setValue(textModel.value());

  textModel.on("insert", (e) => {
    var pos = doc.indexToPosition(e.index);
    suppressEvents = true;
    doc.insert(pos, e.value);
    suppressEvents = false;
  });

  textModel.on("remove", (e) => {
    var start = doc.indexToPosition(e.index);
    var end = doc.indexToPosition(e.index + e.value.length);
    suppressEvents = true;
    doc.remove(new AceRange(start.row, start.column, end.row, end.column));
    suppressEvents = false;
  });

  textModel.on("value", function (e) {
    suppressEvents = true;
    doc.setValue(e.value);
    suppressEvents = false;
  });

  editor.on('change', (delta) => {
    if (suppressEvents) {
      return;
    }

    var pos = doc.positionToIndex(delta.start);
    switch (delta.action) {
      case "insert":
        textModel.insert(pos, delta.lines.join("\n"));
        break;
      case "remove":
        textModel.remove(pos, delta.lines.join("\n").length);
        break;
      default:
        throw new Error("unknown action: " + delta.action);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////
// Cursor Binding
/////////////////////////////////////////////////////////////////////////////
var cursorKey = "cursor";
var cursorReference = null;
var cursorManager = null;

function initSharedCursors(textElement) {
  cursorManager = new AceCollabExt.AceMultiCursorManager(editor);
  cursorReference = textElement.indexReference(cursorKey);

  var references = textElement.references({key: cursorKey});
  references.forEach((reference) => {
    if (!reference.isLocal()) {
      addCursor(reference);
    }
  });

  setLocalCursor();
  cursorReference.share();

  editor.getSession().selection.on('changeCursor', () => setLocalCursor());

  textElement.on("reference", (e) => {
    if (e.reference.key() === cursorKey) {
      this.addCursor(e.reference);
    }
  });
}

function setLocalCursor() {
  var position = editor.getCursorPosition();
  var index = doc.positionToIndex(position);
  cursorReference.set(index);
}

function addCursor(reference) {
  const color = colorAssigner.getColorAsHex(reference.sessionId());
  var remoteCursorIndex = reference.value();
  cursorManager.addCursor(reference.sessionId(), reference.username(), color, remoteCursorIndex);

  reference.on("cleared", () => cursorManager.clearCursor(reference.sessionId()) );
  reference.on("disposed", () => cursorManager.removeCursor(reference.sessionId()) );
  reference.on("set", () => {
    var cursorIndex = reference.value();
    var cursorRow = doc.indexToPosition(cursorIndex).row;
    cursorManager.setCursor(reference.sessionId(), cursorIndex);

    if (radarView.hasView(reference.sessionId())) {
      radarView.setCursorRow(reference.sessionId(), cursorRow);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////
// Selection Binding
/////////////////////////////////////////////////////////////////////////////
var selectionManager = null;
var selectionReference = null;
var selectionKey = "selection";

function initSharedSelection(textModel) {
  selectionManager = new AceCollabExt.AceMultiSelectionManager(editor);

  selectionReference = textModel.rangeReference(selectionKey);
  setLocalSelection();
  selectionReference.share();

  session.selection.on('changeSelection', () => setLocalSelection());

  const references = textModel.references({key: selectionKey});
  references.forEach((reference) => {
    if (!reference.isLocal()) {
      addSelection(reference);
    }
  });

  textModel.on("reference", (e) => {
    if (e.reference.key() === selectionKey) {
      addSelection(e.reference);
    }
  });
}

function setLocalSelection() {
  if (!editor.selection.isEmpty()) {
    const aceRanges = editor.selection.getAllRanges();
    const indexRanges = aceRanges.map((aceRagne) => {
      const start = doc.positionToIndex(aceRagne.start);
      const end = doc.positionToIndex(aceRagne.end);
      return {start: start, end: end};
    });

    selectionReference.set(indexRanges);
  } else if (selectionReference.isSet()) {
    selectionReference.clear();
  }
}

function addSelection(reference) {
  const color = colorAssigner.getColorAsHex(reference.sessionId());
  const remoteSelection = reference.values().map(range => toAceRange(range));
  selectionManager.addSelection(reference.sessionId(), reference.username(), color, remoteSelection);

  reference.on("cleared", () => selectionManager.clearSelection(reference.sessionId()));
  reference.on("disposed", () => selectionManager.removeSelection(reference.sessionId()));
  reference.on("set", () => {
    selectionManager.setSelection(
      reference.sessionId(), reference.values().map(range => toAceRange(range)));
  });
}

function toAceRange(range) {
  if (typeof range !== 'object') {
    return null;
  }

  let start = range.start;
  let end = range.end;

  if (start > end) {
    const temp = start;
    start = end;
    end = temp;
  }

  const rangeAnchor = doc.indexToPosition(start);
  const rangeLead = doc.indexToPosition(end);
  return new AceRange(rangeAnchor.row, rangeAnchor.column, rangeLead.row, rangeLead.column);
}

/////////////////////////////////////////////////////////////////////////////
// Radar View Binding
/////////////////////////////////////////////////////////////////////////////
var radarView = null;
var viewReference = null;
var viewKey = "view";

function initRadarView(textModel, radarViewElement) {
  radarView = new AceCollabExt.AceRadarView(radarViewElement, editor);
  viewReference = textModel.rangeReference(viewKey);

  const references = textModel.references({key: viewKey});
  references.forEach((reference) => {
    if (!reference.isLocal()) {
      addView(reference);
    }
  });

  session.on('changeScrollTop', () => {
    setTimeout(() => setLocalView(), 0);
  });

  textModel.on("reference", (e) => {
    if (e.reference.key() === viewKey) {
      addView(e.reference);
    }
  });

  setTimeout(() => {
    setLocalView();
    viewReference.share();
  }, 0);
}

function setLocalView() {
  const viewportIndices = AceCollabExt.AceViewportUtil.getVisibleIndexRange(editor);
  viewReference.set({start: viewportIndices.start, end: viewportIndices.end});
}

function addView(reference) {
  const color = colorAssigner.getColorAsHex(reference.sessionId());

  // fixme need the cursor
  let cursorRow = null;
  let viewRows = null;

  if (reference.isSet()) {
    const remoteViewIndices = reference.value();
    viewRows = AceCollabExt.AceViewportUtil.indicesToRows(editor, remoteViewIndices.start, remoteViewIndices.end);
  }

  radarView.addView(reference.sessionId(), reference.username(), color, viewRows, cursorRow);

  // fixme need to implement this on the ace collab side
  reference.on("cleared", () => radarView.clearView(reference.sessionId()));
  reference.on("disposed", () => radarView.removeView(reference.sessionId()));
  reference.on("set", () => {
    const v = reference.value();
    const rows = AceCollabExt.AceViewportUtil.indicesToRows(editor, v.start, v.end);
    radarView.setViewRows(reference.sessionId(), rows);
  });
}
