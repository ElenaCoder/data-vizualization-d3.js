// Define the data source URL
const url =
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// Define the chart margin and dimensions
const margin = {
    top: 60,
    right: 30,
    bottom: 30,
    left: 60,
};
const width = 920 - margin.right - margin.left;
const height = 630 - margin.top - margin.bottom;

// Create x and y scales
const x = d3.scaleLinear().range([0, width]); // Linear scale for x-axis
const y = d3.scaleTime().range([0, height]); // Time scale for y-axis
