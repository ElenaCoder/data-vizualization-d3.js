const width = 800;
const height = 400;
let barWidth;

const tooltip = d3
    .select('.chartContainer')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);


