# Collaborative TextArea

This is essentially a live example of the [HTML Text Collaborative Extensions](https://github.com/convergencelabs/html-text-collab-ext).  The extensions are themselves backend-independent, but this example uses Convergence to synchronize state.

Due to the simple data model (a string!), collaboration within a textarea is relatively simple.  However, rendering remote selections and cursors on top of a textarea is a bit tricky, which is where the collaborative extensions come in.  The text collaborative extensions combined with Convergence gives you a collaborative `<textarea>` or `<input>` with very little effort.
