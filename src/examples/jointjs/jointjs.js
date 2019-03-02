const graph = new joint.dia.Graph;
const paper = new joint.dia.Paper({
  el: document.getElementById('paper'),
  width: 800,
  height: 400,
  gridSize: 1,
  model: graph,
  snapLinks: true,
  linkPinning: false,
  embeddingMode: true,
  highlighting: {
    'default': {name: 'stroke', options: {padding: 6}},
    'embedding': {name: 'addClass', options: {className: 'highlighted-parent'}}
  },
  validateEmbedding: function (childView, parentView) {
    return parentView.model instanceof joint.shapes.devs.Coupled;
  },
  validateConnection: function (sourceView, sourceMagnet, targetView, targetMagnet) {
    return sourceMagnet != targetMagnet;
  }
});

// Setup selection behavior
let selectedCellView = null;
let selectionManager = null;

const highlightOptions = {
  highlighter: {
    name: 'stroke',
    options: {
      padding: 15,
      rx: 5,
      ry: 5
    }
  }
};

paper.on('cell:pointerdown', function (cellView) {
  if (cellView === selectedCellView) {
    return;
  }

  if (selectedCellView !== null) {
    selectedCellView.unhighlight(null, highlightOptions);
    selectedCellView = null;
  }

  if (cellView.model.isElement()) {
    selectedCellView = cellView;
    selectedCellView.highlight(null, highlightOptions);
    selectionManager.setSelectedCells(selectedCellView.model);
  } else {
    selectionManager.setSelectedCells([]);
  }
});

paper.on('blank:pointerdown', function (cellView) {
  if (selectedCellView !== null) {
    selectedCellView.unhighlight();
    selectedCellView = null;
  }

  selectionManager.setSelectedCells([]);
});

// Connect to the domain.  See ../config.js for the connection settings.
Convergence.connectAnonymously(CONVERGENCE_URL)
  .then(domain => {
    // Now open the model, creating it using the initial data if it does not exist.
    const modelPromise = domain.models().openAutoCreate({
      collection: "examples",
      id: "jointjs",
      data: () => {
        return ConvergenceJointUtils.DataConverter.graphJsonToModelData(DefaultGraphData);
      }
    });

    const activityPromise = domain.activities().join("jointjs-example");
    return Promise.all([modelPromise, activityPromise])
  })
  .then(results => {
    const model = results[0];
    const activity = results[1];

    const graphAdapter = new ConvergenceJointUtils.GraphAdapter(graph, model);
    graphAdapter.bind();

    const colorManager = new ConvergenceJointUtils.ActivityColorManager(activity);
    const pointerManager = new ConvergenceJointUtils.PointerManager(paper, activity, colorManager, "/libs/@convergence/jointjs-utils/img/cursor.svg");
    selectionManager = new ConvergenceJointUtils.SelectionManager(paper, graphAdapter, colorManager);
  })
  .catch(function (error) {
    console.error("Could not open model", error);
    throw error;
  });
