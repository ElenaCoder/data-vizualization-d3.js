🔔 🔔 🔔
---

## About the project

This is the **Visualize Data with a Bar Chart** project, created as part of the freeCodeCamp Data Visualization certification.
The objective is to build a web app that visualizes data using a bar chart.

## Technologies used

- HTML
- CSS
- JavaScript
- D3.js

## User Stories

The app should fulfill the following user stories and pass all of the provided tests.

1. **Title Element**: The chart should have a title with the corresponding id="title".
2. **X-Axis**: The chart should have a g element for the x-axis with the corresponding id="x-axis".
3. **Y-Axis**: The chart should have a g element for the y-axis with the corresponding id="y-axis".
4. **Tick Labels**: Both the x-axis and y-axis should contain multiple tick labels, each with a corresponding class="tick".
5. **Rect Elements**: The chart should have a rect element for each data point with a corresponding class="bar" to display the data.
6. **Data Properties**: Each .bar should have the properties data-date and data-gdp containing date and GDP values.
7. **Data-Date Order**: The .bar elements' data-date properties should match the order of the provided data.
8. **Data-GDP Order**: The .bar elements' data-gdp properties should match the order of the provided data.
9. **Bar Height**: Each .bar element's height should accurately represent the data's corresponding GDP.
10. **Alignment with X-Axis**: The data-date attribute and its corresponding .bar element should align with the corresponding value on the x-axis.
11. **Alignment with Y-Axis**: The data-gdp attribute and its corresponding .bar element should align with the corresponding value on the y-axis.
12. **Tooltip**: When mousing over an area, a tooltip with the corresponding id="tooltip" should appear, displaying more information about the area.
13. **Tooltip Data-Date**: The tooltip should have a data-date property that corresponds to the data-date of the active area.

## Dataset

The project requires the use of the provided dataset: [GDP-data.json](https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json).

## Demo

You can check out a live demo of this project [here](https://elenacoder.github.io/data-vizualization-d3.js/bar-chart/).


## License

This project is licensed under the MIT License.

---