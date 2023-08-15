// Define the data source URL
const url =
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// Define the chart margin and dimensions
const margin = {
    top: 60,
    right: 40,
    bottom: 80,
    left: 80,
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

// Create a tooltip div
const div = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('opacity', 1);

// Create an SVG element within the body to hold the graph
const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'graph')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Fetch and process data
fetch(url)
    .then((response) => response.json())
    .then((data) => {
        // Data preprocessing here
        data.forEach((d) => {
            d.Place = Number(d.Place);
            const [minutes, seconds] = d.Time.split(':');
            d.Time = new Date(1970, 0, 1, 0, minutes, seconds);
        });

        // Set up x and y domains
        const domainMax = d3.max(data, (d) => d.Year + 1);
        const domainMin = d3.min(data, (d) => d.Year - 1);
        x.domain([domainMin, domainMax]);

        const timeMin = d3.min(data, (d) => d.Time);
        const timeMax = d3.max(data, (d) => d.Time);
        y.domain([timeMin, timeMax]);

        // Create x-axis
        svg.append('g')
            .attr('class', 'x axis')
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        // Create y-axis
        svg.append('g')
            .attr('class', 'y axis')
            .attr('id', 'y-axis')
            .call(yAxis);

        // Create label for x-axis
        svg.append('text')
            .attr('class', 'x-axis-label')
            .attr('x', width)
            .attr('y', 530)
            .style('text-anchor', 'end')
            .text('Year');

        // Create label for y-axis
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -160)
            .attr('y', -44)
            .style('font-size', 18)
            .text('Time in Minutes');

        // Create data points (circles)
        svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', 6)
            .attr('cx', (d) => x(d.Year))
            .attr('cy', (d) => y(d.Time))
            .attr('data-xvalue', (d) => d.Year)
            .attr('data-yvalue', (d) => d.Time.toISOString())
            .style('fill', (d) => color(d.Doping !== ''))
            .on('mouseover', function (event, d) {
                div.style('opacity', 0.9);
                div.attr('data-year', d.Year);
                div.html(
                    `<b>${d.Name}</b>` +
                        ': ' +
                        d.Nationality +
                        '<br/>' +
                        '<b>Year: </b>' +
                        d.Year +
                        ', <b>Time: </b>' +
                        timeFormat(d.Time) +
                        '<br/><br/>' +
                        '<hr>' +
                        (d.Doping ? '<br/>' + `<b>${d.Doping}</b>` : ''),
                )
                    .style('left', event.pageX + 5 + 'px')
                    .style('top', event.pageY - 38 + 'px');
            });
    });
