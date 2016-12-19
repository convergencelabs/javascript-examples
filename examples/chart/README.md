# Overview

This example demonstrates collaborative visualization of a pie chart using [Chart.js](http://chartjs.org) and Convergence.  The example also integrates the [noUiSlider](https://refreshless.com/nouislider/) component to allow easy manipulation of the chart data. The example primarily makes use of the Model API to syncrhonize data in real time between multiple users editing the chart data.

## Data Model
The data model for this example follows the standard Chart.js data model for a pie chart. The data could be modeled in any way. This data schema does not necessarily follow the best practices for Data Modeling in Convergence. For example deleting a pie chart wedge would require deleting the same index in four different arrays. However, for this example, the easiest thing to do was to simply adopt the model used by Chart.js.  This way users can view the [Chart.js Documentation](http://www.chartjs.org/docs/#doughnut-pie-chart-introduction) for Pie Charts to understand the data.  

The data model looks something like this:
 
```JavaScript
{
  labels: ["Red", "Blue", "Yellow"],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
  }]
}
```

### Advanced usage

You can edit a segment's label, background color and value in the Model Editor of the [Convergence Admin Console](https://admin.convergence.io).  The chart will respond to changes in the Admin Console in real time, but be careful, you can easily corrupt the data if you don't maintain a valid Chart.js pie chart schema.