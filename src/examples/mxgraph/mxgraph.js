const {
  ActivityColorManager,
  MxGraphAdapter,
  PointerManager,
  SelectionManager,
  Deserializer
} = ConvergenceMxGraphAdapter;

async function start() {
  const domain = await Convergence.connectAnonymously(CONVERGENCE_URL, "test user");
  const model = await domain
      .models()
      .openAutoCreate({
        id: convergenceExampleId,
        collection: "example-mxgraph",
        ephemeral: true,
        data: () => {
          return DEFAULT_GRAPH;
        }
      });

  const activityOptions = {
    autoCreate: {
      ephemeral: true,
      worldPermissions: ["join", "view_state", "set_state"]
    }
  }

  const activity = await domain.activities().join("mxgraph", convergenceExampleId, activityOptions);

  const container = document.getElementById("mxgraph");

  const graphModel = Deserializer.deserializeMxGraphModel(model.root().value());
  const graph = new mxGraph(container, graphModel);
  setTimeout(() => {
    const colorManger = new ActivityColorManager(activity);
    const graphAdapter = new MxGraphAdapter(graph, model.root());
    const pointerManager = new PointerManager(graph, activity, colorManger);
    const selectionManager = new SelectionManager(graph, activity, colorManger, graphAdapter);
    exampleLoaded();
  }, 0);
}

start().catch(e => console.error(e));