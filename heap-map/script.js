// URL of the temperature data JSON file
const url =
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

// Predefined color scales for the heatmap
var colorbrewer = {
    RdYlBu: {
        3: ['#fc8d59', '#ffffbf', '#91bfdb'],
        4: ['#d7191c', '#fdae61', '#abd9e9', '#2c7bb6'],
        5: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'],
        6: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'],
        7: [
            '#d73027',
            '#fc8d59',
            '#fee090',
            '#ffffbf',
            '#e0f3f8',
            '#91bfdb',
            '#4575b4',
        ],
        8: [
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#fee090',
            '#e0f3f8',
            '#abd9e9',
            '#74add1',
            '#4575b4',
        ],
        9: [
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#fee090',
            '#ffffbf',
            '#e0f3f8',
            '#abd9e9',
            '#74add1',
            '#4575b4',
        ],
        10: [
            '#a50026',
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#fee090',
            '#e0f3f8',
            '#abd9e9',
            '#74add1',
            '#4575b4',
            '#313695',
        ],
        11: [
            '#a50026',
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#fee090',
            '#ffffbf',
            '#e0f3f8',
            '#abd9e9',
            '#74add1',
            '#4575b4',
            '#313695',
        ],
    },
    RdBu: {
        3: ['#ef8a62', '#f7f7f7', '#67a9cf'],
        4: ['#ca0020', '#f4a582', '#92c5de', '#0571b0'],
        5: ['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0'],
        6: ['#b2182b', '#ef8a62', '#fddbc7', '#d1e5f0', '#67a9cf', '#2166ac'],
        7: [
            '#b2182b',
            '#ef8a62',
            '#fddbc7',
            '#f7f7f7',
            '#d1e5f0',
            '#67a9cf',
            '#2166ac',
        ],
        8: [
            '#b2182b',
            '#d6604d',
            '#f4a582',
            '#fddbc7',
            '#d1e5f0',
            '#92c5de',
            '#4393c3',
            '#2166ac',
        ],
        9: [
            '#b2182b',
            '#d6604d',
            '#f4a582',
            '#fddbc7',
            '#f7f7f7',
            '#d1e5f0',
            '#92c5de',
            '#4393c3',
            '#2166ac',
        ],
        10: [
            '#67001f',
            '#b2182b',
            '#d6604d',
            '#f4a582',
            '#fddbc7',
            '#d1e5f0',
            '#92c5de',
            '#4393c3',
            '#2166ac',
            '#053061',
        ],
        11: [
            '#67001f',
            '#b2182b',
            '#d6604d',
            '#f4a582',
            '#fddbc7',
            '#f7f7f7',
            '#d1e5f0',
            '#92c5de',
            '#4393c3',
            '#2166ac',
            '#053061',
        ],
    },
};

// Fetch the data from the URL and call the callback function
d3.json(url)
    .then((data) => callback(data))
    .catch((err) => console.log(err));

// Callback function to process and visualize the data
function callback(data) {
    console.log('data: ', data);

    // Adjust month indices to be zero-based
    data.monthlyVariance.forEach((val) => (val.month -= 1));

    // Create a section element to contain the visualization
    const section = d3.select('body').append('section');

    // Add heading elements for title and description
    const heading = section.append('heading');
    heading
        .append('h1')
        .attr('id', 'title')
        .text('Monthly Global Land-Surface Temperature');
    heading
        .append('h3')
        .attr('id', 'description')
        .html(
            `${data.monthlyVariance[0].year} - ${
                data.monthlyVariance[data.monthlyVariance.length - 1].year
            }: base temperature ${data.baseTemperature}&#8451;`,
        );

    // Define dimensions, padding, and tooltip
    const fontSize = 16;
    const width = 5 * Math.ceil(data.monthlyVariance.length / 12);
    const height = 33 * 12;
    const padding = {
        left: 9 * fontSize,
        right: 9 * fontSize,
        top: 1 * fontSize,
        bottom: 8 * fontSize,
    };
    const tooltip = d3
        .tip()
        .attr('class', 'd3-tip')
        .attr('id', 'tooltip')
        .html(function (d) {
            return d;
        })
        .direction('n')
        .offset([-10, 0]);

    // Create the SVG container and apply the tooltip
    const svg = section
        .append('svg')
        .attr('width', width + padding.left + padding.right)
        .attr('height', height + padding.top + padding.bottom)
        .call(tooltip);

    // Create y-axis scale
    const yScale = d3
        .scaleBand()
        .domain(data.monthlyVariance.map((val) => val.month))
        .rangeRound([0, height])
        .padding(0);

    // Create y-axis
    const yAxis = d3
        .axisLeft()
        .scale(yScale)
        .tickValues(yScale.domain())
        .tickFormat((month) => {
            const date = new Date(0);
            date.setUTCMonth(month);
            const format = d3.utcFormat('%B');
            return format(date);
        })
        .tickSize(10, 1);
    // Added Y-axis to the SVG with Month Labels
    svg.append('g')
        .classed('y-axis', true)
        .attr('id', 'y-axis')
        .attr(
            'transform',
            'translate(' + padding.left + ',' + padding.top + ')',
        )
        .call(yAxis)
        .append('text')
        .text('Months')
        .style('text-anchor', 'end')
        .attr(
            'transform',
            'translate(' +
                -7 * fontSize +
                ',' +
                height / 2 +
                ')' +
                'rotate(-90)',
        )
        .attr('fill', 'black');

    // Create x-axis scale
    const xScale = d3
        .scaleBand()
        .domain(data.monthlyVariance.map((val) => val.year))
        .range([0, width])
        .padding(0);

    // Create x-axis
    const xAxis = d3
        .axisBottom()
        .scale(xScale)
        .tickValues(
            xScale.domain().filter(function (year) {
                // set ticks to years divisible by 10
                return year % 10 === 0;
            }),
        )
        .tickFormat(function (year) {
            var date = new Date(0);
            date.setUTCFullYear(year);
            var format = d3.utcFormat('%Y');
            return format(date);
        })
        .tickSize(10, 1);

}
