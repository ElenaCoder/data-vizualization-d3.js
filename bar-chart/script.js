const width = 800;
const height = 400;
let barWidth;
let dataQuantity;

// Create tooltip
const tooltip = d3
    .select('.chartContainer')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

// Create overlay
const overlay = d3
    .select('.chartContainer')
    .append('div')
    .attr('class', 'overlay')
    .style('opacity', 0);

const svgContainer = d3
    .select('.chartContainer')
    .append('svg')
    .attr('width', width + 100)
    .attr('height', height + 60);

fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
)
    .then((response) => response.json())
    .then((data) => {
        dataQuantity = data.data.length;
        barWidth = width / dataQuantity;

        // Process data
        const years = data.data.map((item) => {
            let quarter;
            const temp = item[0].substring(5, 7);

            switch (temp) {
                case '01':
                    quarter = 'Q1';
                    break;
                case '04':
                    quarter = 'Q2';
                    break;
                case '07':
                    quarter = 'Q3';
                    break;
                case '10':
                    quarter = 'Q4';
                    break;
                default:
                    throw new Error('Unknown quarter value: ' + temp);
            }

            return `${item[0].substring(0, 4)} ${quarter}`;
        });

        const yearsDate = data.data.map((item) => new Date(item[0]));

        // Set up xScale and xAxis
        const xMax = new Date(d3.max(yearsDate));
        xMax.setMonth(xMax.getMonth() + 3);

        const xScale = d3
            .scaleTime()
            .domain([d3.min(yearsDate), xMax])
            .range([0, width]);
        const xAxis = d3.axisBottom().scale(xScale);

        // Set up yScale and yAxis
        const GDP = data.data.map((item) => item[1]);
        const gdpMax = d3.max(GDP);

        const linearScale = d3
            .scaleLinear()
            .domain([0, gdpMax])
            .range([0, height]);

        const yAxisScale = d3
            .scaleLinear()
            .domain([0, gdpMax])
            .range([height, 10]);

        const yAxis = d3.axisLeft(yAxisScale);

        const scaledGDP = GDP.map((item) => linearScale(item));

        // Append x-axis
        svgContainer
            .append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', 'translate(60, 400)');

        // Append y-axis
        svgContainer
            .append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', 'translate(60, 0)');

        // Append rotated text for Y-axis label
        svgContainer
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -200)
            .attr('y', 80)
            .text('Gross Domestic Product');

        // Append text for more information
        svgContainer
            .append('text')
            .attr('x', width / 2 + 90)
            .attr('y', height + 50)
            .text(
                'More Information: http://www.bea.gov/national/pdf/nipaguid.pdf',
            )
            .attr('class', 'info');

        // Append rectangles
        d3.select('svg')
            .selectAll('rect')
            .data(scaledGDP)
            .enter()
            .append('rect')
            .attr('data-date', (d, i) => data.data[i][0])
            .attr('data-gdp', (d, i) => data.data[i][1])
            .attr('class', 'bar')
            .attr('x', (d, i) => xScale(yearsDate[i]))
            .attr('y', (d) => height - d)
            .attr('width', barWidth)
            .attr('height', (d) => d)
            .attr('index', (d, i) => i)
            .style('fill', '#0B666A')
            .attr('transform', 'translate(60, 0)')
            .on('mouseover', handleMouseOver)
            .on('mouseout', function () {
                tooltip.transition().duration(100).style('opacity', 0);
                overlay.transition().duration(100).style('opacity', 0);
            });

        // Function to handle mouseover event
        function handleMouseOver(event, d) {
            const index = this.getAttribute('index');
            const xPosition = index * barWidth;
            const yPosition = height - d;

            showOverlay(d, xPosition, yPosition);
            showTooltip(index);
        }

        // Function to show overlay
        function showOverlay(height, x, y) {
            overlay
                .transition()
                .duration(50)
                .style('height', height + 'px')
                .style('width', barWidth + 'px')
                .style('opacity', 0.9)
                .style('left', x + 'px')
                .style('top', y + 'px')
                .style('transform', 'translateX(60px)');
        }

        // Function to show tooltip
        function showTooltip(index) {
            const xPosition = index * barWidth + 30;
            const yPosition = height - 100;

            tooltip
                .transition()
                .duration(100)
                .style('opacity', 0.9)
            tooltip
                .html(
                    years[index] +
                        '<br>' +
                        '$' +
                        GDP[index]
                            .toFixed(1)
                            .replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
                        ' Billion',
                )
                .attr('data-date', data.data[index][0])
                .style('left', xPosition + 'px')
                .style('top', yPosition + 'px')
                .style('transform', 'translateX(60px)');
        }
    });
