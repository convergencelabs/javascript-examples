const {
  ActivityColorManager,
  MxGraphAdapter,
  PointerManager,
  SelectionManager,
  Deserializer
} = ConvergenceMxGraphAdapter;

Convergence
  .connectAnonymously(CONVERGENCE_URL, "test user")
  .then(domain => {
    const model = domain
      .models()
      .openAutoCreate({
        id: "mxgrph-example",
        collection: "mxgraph",
        ephemeral: true,
        data: () => {
          return DEFAULT_GRAPH;
        }
      });
    const activity = domain
      .activities()
      .join("mxgraph-example");
    return Promise.all([model, activity]);
  })
  .then(([model, activity]) => {
    const container = document.getElementById("mxgraph");

    const graphModel = Deserializer.deserializeMxGraphModel(model.root().value());
    const graph = new mxGraph(container, graphModel);
    setTimeout(() => {
      const colorManger = new ActivityColorManager(activity);
      const graphAdapter = new MxGraphAdapter(graph, model.root());
      const pointerManager = new PointerManager(graph, activity, colorManger);
      const selectionManager = new SelectionManager(graph, activity, colorManger, graphAdapter);
    }, 0)
  });