const width = 800;
const height = 400;
let barWidth;

const tooltip = d3
    .select('.chartContainer')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

const overlay = d3
    .select('.chartContainer')
    .append('div')
    .attr('class', 'overlay')
    .style('opacity', 0);

const svgContainer = d3
    .select('.chartContainer')
    .append('svg')
    .attr('width', width)
    .attr('height', height);