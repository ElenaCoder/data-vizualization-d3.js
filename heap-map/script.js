// URL of the temperature data JSON file
const url =
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

// Predefined color scales for the heatmap
const colorbrewer = {
    RedToBlue: {
        3: ['#a50026', '#ffffbf', '#4575b4'],
        4: ['#a50026', '#fc8d59', '#91bfdb', '#4575b4'],
        5: ['#a50026', '#f46d43', '#fdae61', '#91bfdb', '#4575b4'],
        6: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#abd9e9', '#2c7bb6'],
        7: [
            '#a50026',
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#ffffbf',
            '#abd9e9',
            '#2c7bb6',
        ],
        8: [
            '#a50026',
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#e0f3f8',
            '#91bfdb',
            '#4575b4',
            '#313695',
        ],
        9: [
            '#a50026',
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#e0f3f8',
            '#ffffbf',
            '#abd9e9',
            '#67a9cf',
            '#3690c0',
        ],
        10: [
            '#a50026',
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#e0f3f8',
            '#ffffbf',
            '#abd9e9',
            '#67a9cf',
            '#3690c0',
            '#0570b0',
        ],
        11: [
            '#a50026',
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#e0f3f8',
            '#ffffbf',
            '#abd9e9',
            '#67a9cf',
            '#3690c0',
            '#0570b0',
            '#034e7b',
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
    const width = 3.5 * Math.ceil(data.monthlyVariance.length / 12);
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
        .style('font-size', '1.2rem')
        .style('text-anchor', 'middle')
        .attr(
            'transform',
            'translate(' +
                -5 * fontSize +
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

    // Added X-axis to the SVG with Year Labels
    svg.append('g')
        .classed('x-axis', true)
        .attr('id', 'x-axis')
        .attr(
            'transform',
            'translate(' + padding.left + ',' + (height + padding.top) + ')',
        )
        .call(xAxis)
        .append('text')
        .text('Years')
        .style('font-size', '1.2rem')
        .style('text-anchor', 'middle')
        .attr('transform', 'translate(' + width / 2 + ',' + 3 * fontSize + ')')
        .attr('fill', 'black');

    // Get the legend colors in reverse order
    const legendColors = colorbrewer.RedToBlue[11].reverse();
    const legendWidth = 600;
    const legendHeight = 300 / legendColors.length;

    // Calculate the variance, minimum temperature, and maximum temperature
    const variance = data.monthlyVariance.map((val) => val.variance);
    const minTemp = data.baseTemperature + Math.min(...variance);
    const maxTemp = data.baseTemperature + Math.max(...variance);

    // Create a threshold scale for the legend colors
    const legendThreshold = d3
        .scaleThreshold()
        .domain(
            ((min, max, count) => {
                const array = [];
                const step = (max - min) / count;
                let base = min;
                for (let i = 1; i < count; i++) {
                    array.push(base + i * step);
                }
                return array;
            })(minTemp, maxTemp, legendColors.length),
        )
        .range(legendColors);

    // Create a linear scale for the legend x-axis
    const legendX = d3
        .scaleLinear()
        .domain([minTemp, maxTemp])
        .range([0, legendWidth]);

    // Create the x-axis for the legend
    const legendXAxis = d3
        .axisBottom()
        .scale(legendX)
        .tickSize(10)
        .tickValues(legendThreshold.domain())
        .tickFormat(d3.format('.1f'));

    // Append a group for the legend
    const legend = svg
        .append('g')
        .classed('legend', true)
        .attr('id', 'legend')
        .attr(
            'transform',
            `translate(${padding.left},${
                padding.top + height + padding.bottom - 2 * legendHeight
            })`,
        );

    // Add rectangles for each color in the legend
    legend
        .append('g')
        .selectAll('rect')
        .data(
            legendThreshold.range().map((color) => {
                let d = legendThreshold.invertExtent(color);
                if (d[0] === null) {
                    d[0] = legendX.domain()[0];
                }
                if (d[1] === null) {
                    d[1] = legendX.domain()[1];
                }
                return d;
            }),
        )
        .enter()
        .append('rect')
        .style('fill', (d) => legendThreshold(d[0]))
        .attr('x', (d) => legendX(d[0]))
        .attr('y', 0)
        .attr('width', (d) =>
            d[0] && d[1] ? legendX(d[1]) - legendX(d[0]) : legendX(null),
        )
        .attr('height', legendHeight);

    // Add the x-axis to the legend
    legend
        .append('g')
        .attr('transform', `translate(0,${legendHeight})`)
        .call(legendXAxis);

    svg.append('g')
        .classed('map', true)
        .attr(
            'transform',
            'translate(' + padding.left + ',' + padding.top + ')',
        )
        .selectAll('rect')
        // Bind data to heatmap cells
        .data(data.monthlyVariance)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        // Set data attributes for month, year, and temperature
        .attr('data-month', (d) => d.month)
        .attr('data-year', (d) => d.year)
        .attr('data-temp', (d) => data.baseTemperature + d.variance)
        // Set x, y, width, and height attributes using scales
        .attr('x', (d) => xScale(d.year))
        .attr('y', (d) => yScale(d.month))
        .attr('width', (d) => xScale.bandwidth(d.year))
        .attr('height', (d) => yScale.bandwidth(d.month))
        .attr('fill', (d) => legendThreshold(data.baseTemperature + d.variance))
        // Add mouseover event listener for tooltip displa
        .on('mouseover', function (event, d) {
            // Calculate date from year and month
            var date = new Date(d.year, d.month);
            // Generate tooltip content
            var str =
                "<span class='date'>" +
                d3.utcFormat('%Y - %B')(date) +
                '</span>' +
                '<br />' +
                "<span class='temperature'>" +
                d3.format('.1f')(data.baseTemperature + d.variance) +
                '&#8451;' +
                '</span>' +
                '<br />' +
                "<span class='variance'>" +
                d3.format('+.1f')(d.variance) +
                '&#8451;' +
                '</span>';
            // Set tooltip data and show tooltip
            tooltip.attr('data-year', d.year);
            tooltip.show(str, this);
        })
        // Add mouseout event listener to hide tooltip
        .on('mouseout', tooltip.hide);
}
