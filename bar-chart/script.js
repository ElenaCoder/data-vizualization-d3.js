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
    });
