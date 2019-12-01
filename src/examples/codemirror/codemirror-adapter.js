class CodeMirrorConvergenceAdapter {
  constructor(editor, realtimeString) {
    this._editor = editor;
    this._model = realtimeString;
    this._colorAssigner = new ConvergenceColorAssigner.ColorAssigner();
  }

  bind() {
    this._initSharedData();
    this._initSharedCursors();
    this._initSharedSelection();
  }

  _initSharedData() {
    this._editor.setValue(this._model.value());

    this._contentManager = new CodeMirrorCollabExt.EditorContentManager({
      editor: this._editor,
      onInsert: (index, text) => {
        this._model.insert(index, text);
      },
      onReplace: (index, length, text) => {
        this._model.model().startBatch();
        this._model.remove(index, length);
        this._model.insert(index, text);
        this._model.model().completeBatch();
      },
      onDelete: (index, length) => {
        this._model.remove(index, length);
      },
      remoteOrigin: "convergence"
    });

    this._model.events().subscribe(e => {
      switch (e.name) {
        case "insert":
          this._contentManager.insert(e.index, e.value);
          break;
        case "remove":
          this._contentManager.delete(e.index, e.value.length);
          break;
        default:
      }
    });
  }

  _initSharedCursors() {
    this._remoteCursorManager = new CodeMirrorCollabExt.RemoteCursorManager({
      editor: this._editor,
      tooltips: true,
      tooltipDuration: 2
    });
    this._cursorReference = this._model.indexReference("cursor");

    const references = this._model.references({key: "cursor"});
    references.forEach((reference) => {
      if (!reference.isLocal()) {
        this._addRemoteCursor(reference);
      }
    });

    this._setLocalCursor();
    this._cursorReference.share();

    this._editor.on("cursorActivity", (e) => {
      this._setLocalCursor();
    });

    this._model.on("reference", (e) => {
      if (e.reference.key() === "cursor") {
        this._addRemoteCursor(e.reference);
      }
    });
  }

  _setLocalCursor() {
    const position = this._editor.getCursor();
    const index = this._editor.indexFromPos(position);
    this._cursorReference.set(index);
  }

  _addRemoteCursor(reference) {
    const color = this._colorAssigner.getColorAsHex(reference.sessionId());
    const remoteCursor = this._remoteCursorManager.addCursor(reference.sessionId(), color, reference.user().displayName);

    reference.on("cleared", () => remoteCursor.hide());
    reference.on("disposed", () => remoteCursor.dispose());
    reference.on("set", () => {
      const cursorIndex = reference.value();
      remoteCursor.setIndex(cursorIndex);
    });
  }


  _initSharedSelection() {
    this._remoteSelectionManager = new CodeMirrorCollabExt.RemoteSelectionManager({editor: this._editor});

    this._selectionReference = this._model.rangeReference("selection");
    this._setLocalSelection();
    this._selectionReference.share();

    this._editor.on("cursorActivity", (e) => {
      this._setLocalSelection();
    });

    const references = this._model.references({key: "selection"});
    references.forEach((reference) => {
      if (!reference.isLocal()) {
        this._addRemoteSelection(reference);
      }
    });

    this._model.on("reference", (e) => {
      if (e.reference.key() === "selection") {
        this._addRemoteSelection(e.reference);
      }
    });
  }

  _setLocalSelection() {
    const fromPosition = this._editor.getCursor("from");
    const fromIndex = this._editor.indexFromPos(fromPosition);
    const toPosition = this._editor.getCursor("to");
    const toIndex = this._editor.indexFromPos(toPosition);

    if (fromIndex !== toIndex) {
      this._selectionReference.set({start: fromIndex, end: toIndex});
    } else if (this._selectionReference.isSet()) {
      this._selectionReference.clear();
    }
  }

  _addRemoteSelection(reference) {
    const color = this._colorAssigner.getColorAsHex(reference.sessionId())
    const remoteSelection = this._remoteSelectionManager.addSelection(reference.sessionId(), color);

    if (reference.isSet()) {
      const selection = reference.value();
      remoteSelection.setIndices(selection.start, selection.end);
    }

    reference.on("cleared", () => remoteSelection.hide());
    reference.on("disposed", () => remoteSelection.dispose());
    reference.on("set", () => {
      const selection = reference.value();
      remoteSelection.setIndices(selection.start, selection.end);
    });
  }
}
