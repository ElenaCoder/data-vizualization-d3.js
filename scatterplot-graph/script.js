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

// Define color scale for data categories
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Format time values as 'MM:SS' using timeFormat
const timeFormat = d3.timeFormat('%M:%S');

// Create x-axis and y-axis with proper formatting
const xAxis = d3.axisBottom(x).tickFormat(d3.format('d')); // Bottom x-axis with number formatting
const yAxis = d3.axisLeft(y).tickFormat(timeFormat); // Left y-axis with time formatting