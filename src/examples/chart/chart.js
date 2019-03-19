const RealtimeChart = function () {
  this.controls = [];
};

RealtimeChart.prototype = {

  /**
   * Initializes the demo by connecting to the domain and opening the model.
   */
  init: function () {
    // Connect to the domain.  See ../connection.js for the connection settings.
    Convergence.connectAnonymously(CONVERGENCE_URL).then(domain => {
      // Now open the model, creating it using the initial data if it does not exist.
      return domain.models().openAutoCreate({
        collection: "example-chart",
        id: convergenceExampleId,
        data: initialData,
        ephemeral: true
      });
    }).then(model => {
      // Initialize the chart with the model data and wire up the events.
      this.createChart(model.root().value());
      this.realTimeModel = model;
      this.bindToSliders();
      this.listenForRemoteChanges();
    }).catch(error => {
      console.log("Could not open model: " + error);
    });
  },

  /**
   * Creates the chart.js chart using the supplied JSON data and creates the
   * slider controls for each wedge of the pie chart.
   *
   * @param initialData The initial chart data.
   */
  createChart: function (initialData) {
    const ctx = document.getElementById("pieChart");
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: initialData,
      options: {
        responsive: false,
        duration: 0,
        legend: {
          onClick: () => {
          }
        }
      }
    });

    // Create slider controls for each segment, initialized with the current data
    const dataset = initialData.datasets[0];
    initialData.labels.forEach((label, index) => {
      const attrs = {
        label: label,
        value: dataset.data[index],
        color: dataset.backgroundColor[index]
      };
      const control = new ChartControl(attrs);
      control.addToDom();
      this.controls.push(control);
    });
  },

  /**
   * Add an event handler to each control for when the user changes the value
   * by sliding the slider.
   */
  bindToSliders: function () {
    this.controls.forEach((control, index) => {
      control.onSlide((value) => {
        const val = Math.round(parseInt(value[0], 10));

        // update the RealTimeValue.  This notifies any listeners
        this.realTimeModel.elementAt(['datasets', 0, 'data', index]).value(val);

        // Update the control widget and rerender the chart
        control.updateInputVal(val);
        this.updateSegmentValue(index, val);
      });
    });
  },

  /**
   * Listen for remote data model changes and update the correct slider and data
   * in the chart.
   */
  listenForRemoteChanges: function () {
    this.controls.forEach((control, index) => {
      // Update the UI when a segment's value is explicitly changed
      // This can be triggered either from the slider of another chart example, or
      // by explicitly typing in the value in the Model Editor of the Admin UI
      this.realTimeModel
        .elementAt('datasets', 0, 'data', index)
        .on(Convergence.RealTimeNumber.Events.VALUE, (e) => {
        control.updateSliderVal(e.element.value());
        this.updateSegmentValue(index, e.element.value());
      });

      // Update the UI when a segment's value is incremented or decremented
      // This can be triggered with a value's spinner in the Model Editor of the Admin UI
      this.realTimeModel
        .elementAt('datasets', 0, 'data', index)
        .on(Convergence.RealTimeNumber.Events.DELTA, (e) => {
        const value = this.getSegmentValue(index) + e.value;
        control.updateSliderVal(value);
        this.updateSegmentdata(index, value);
      });

      // Update the UI when a segment's color changes
      // This can be triggered by editing a "backgroundColor" value in the Admin UI
      const rtColorValue = this.realTimeModel.elementAt('datasets', 0, 'backgroundColor', index);
      rtColorValue.on(Convergence.RealTimeString.Events.MODEL_CHANGED, () => {
        const newColor = rtColorValue.value();
        control.updateSliderColor(newColor);
        this.updateSegmentColor(index, newColor);
      });

      // Update the UI when a segment's label changes
      // This can be triggered by editing a "labels" value in the Admin UI
      const rtLabelValue = this.realTimeModel.elementAt('labels', index);
      rtLabelValue.on(Convergence.RealTimeString.Events.MODEL_CHANGED, () => {
        const newLabel = rtLabelValue.value();
        this.updateLabel(index, newLabel);
      });
    });
  },

  /**
   * Sets the specified chart segment to the specified value.
   */
  updateSegmentValue: function (index, value) {
    this.pieChart.data.datasets[0].data[index] = value;
    this.pieChart.update();
  },

  /**
   * Sets the specified chart segment to the specified color.
   */
  updateSegmentColor: function (index, color) {
    this.pieChart.data.datasets[0].backgroundColor[index] = color;
    this.pieChart.update();
  },

  /**
   * Sets the specified slider number box to the specified value.
   */
  updateLabel: function (index, value) {
    this.pieChart.data.labels[index] = value;
    this.pieChart.update();
  },

  /**
   * Gets the value of the specified chart segment.
   */
  getSegmentValue: function (index) {
    return this.pieChart.data.datasets[0].data[index];
  }
};

function ChartControl(attrs) {
  this.id = attrs.label;
  this.value = attrs.value;
  this.color = attrs.color;
}
ChartControl.prototype = {
  addToDom: function () {
    const controlsDiv = document.getElementById("controls");

    const controlDiv = document.createElement("div");
    controlDiv.className = "control";

    this.sliderEl = document.createElement("div");
    this.sliderEl.className = "slider";
    this.sliderEl.id = this.id;
    this.sliderEl.style.background = this.color;
    controlDiv.appendChild(this.sliderEl);

    const valueDiv = document.createElement("div");
    valueDiv.className = "value";

    this.valueInput = document.createElement("input");
    this.valueInput.type = "text";
    this.valueInput.disabled = true;
    this.valueInput.value = this.value;
    valueDiv.appendChild(this.valueInput);

    controlDiv.appendChild(valueDiv);

    this.createSlider(this.sliderEl);

    controlsDiv.appendChild(controlDiv);
  },
  createSlider: function () {
    noUiSlider.create(this.sliderEl, {
      animate: false,
      start: 40,
      connect: [false, true],
      step: 1,
      range: {
        'min': 0,
        'max': 100
      }
    });
    this.sliderEl.noUiSlider.set(this.value);
  },
  onSlide: function (onSlideFn) {
    this.sliderEl.noUiSlider.on('slide', onSlideFn);
  },
  updateInputVal: function (val) {
    this.valueInput.value = val;
  },
  updateSliderVal: function (val) {
    this.updateInputVal(val);
    this.sliderEl.noUiSlider.set(val);
  },
  updateSliderColor: function (color) {
    this.sliderEl.style.background = color;
  }
};

// The default data that is provided if the model does not exist.
const initialData = {
  labels: ["Red", "Green", "Yellow", "Blue"],
  datasets: [
    {
      data: [80, 50, 30, 18],
      backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#62b4f7"]
    }
  ]
};

const realTimeChart = new RealtimeChart();
realTimeChart.init();
