// Define dataset URLs and information
const DATASETS = {
    kickstarterPledges: {
        TITLE: 'Kickstarter Pledges',
        DESCRIPTION:
            'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category',
        FILE_PATH:
            'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json',
    },
    movieSales: {
        TITLE: 'Movie Sales',
        DESCRIPTION: 'Top 100 Highest Grossing Movies Grouped By Genre',
        FILE_PATH:
            'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json',
    },
    videogameSales: {
        TITLE: 'Video Game Sales',
        DESCRIPTION: 'Top 100 Most Sold Video Games Grouped by Platform',
        FILE_PATH:
            'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json',
    },
};

// Create links
d3.select('body')
    .selectAll('a')
    .data([
        { label: 'Video Game Data Set |', data: 'videogameSales' },
        { label: 'Movies Data Set |', data: 'movieSales' },
        { label: 'Kickstarter Data Set', data: 'kickstarterPledges' },
    ])
    .enter()
    .append('a')
    .attr('href', (d) => `?data=${d.data}`)
    .text((d) => d.label)
    .style('margin-right', '10px');

// Create h1 title
d3.select('body').append('h1').attr('id', 'title');

// Create description div
d3.select('body').append('div').attr('id', 'description');

// Create tree-map SVG
d3.select('body')
    .append('svg')
    .attr('id', 'tree-map')
    .attr('width', 960)
    .attr('height', 570);

// Create legend SVG
d3.select('body').append('svg').attr('id', 'legend').attr('width', 500);

// Get dataset parameter from URL or use the default
var urlParams = new URLSearchParams(window.location.search);
const DEFAULT_DATASET = 'videogameSales';
const DATASET = DATASETS[urlParams.get('data') || DEFAULT_DATASET];

// Set the title and description based on the selected dataset
document.getElementById('title').innerHTML = DATASET.TITLE;
document.getElementById('description').innerHTML = DATASET.DESCRIPTION;

// Select DOM elements
const body = d3.select('body');
const svg = d3.select('#tree-map');
const width = Number(svg.attr('width'));
const height = Number(svg.attr('height'));
const legend = d3.select('#legend');
const tooltip = body
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('opacity', 0);

// Define color scale using d3's scaleOrdinal and a custom color scheme
const color = d3.scaleOrdinal(d3.schemeSet3.map(fader));

// Define the treemap layout with size and padding
const treemap = d3.treemap().size([width, height]).paddingInner(1);

// Load data and create visualization
d3.json(DATASET.FILE_PATH)
    .then(createVisualization)
    .catch((err) => console.log(err));

function createVisualization(data) {
    // Constructing the hierarchy of the data for treemap layout
    const root = d3
        .hierarchy(data)
        .eachBefore((d) => {
            d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name;
        })
        .sum(sumBySize)
        .sort((a, b) => b.height - a.height || b.value - a.value);

    // Apply treemap layout to the hierarchy
    treemap(root);

    // Create a group for each cell in the treemap
    const cell = svg
        .selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('class', 'group')
        .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    // Append a rectangle for each cell
    cell.append('rect')
        .attr('id', (d) => d.data.id)
        .attr('class', 'tile')
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('data-name', (d) => d.data.name)
        .attr('data-category', (d) => d.data.category)
        .attr('data-value', (d) => d.data.value)
        .attr('fill', (d) => color(d.data.category))
        .on('mousemove', handleMousemove)
        .on('mouseout', handleMouseout);

    // Append text labels for each cell
    cell.append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data(function (d) {
            // Splitting text into multiple lines
            return d.data.name.split(/(?=[A-Z][^A-Z])/g);
        })
        .enter()
        .append('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => 13 + i * 10)
        .text((d) => d);

    // Extract unique categories from the data
    const categoriesSet = new Set(
        root.leaves().map((nodes) => nodes.data.category),
    );
    // Convert the Set back to an array
    const categories = [...categoriesSet];

    // Create the legend
    const legend = d3.select('#legend');
    const legendWidth = +legend.attr('width');
    const LEGEND_OFFSET = 10;
    const LEGEND_RECT_SIZE = 15;
    const LEGEND_H_SPACING = 150;
    const LEGEND_V_SPACING = 10;
    const LEGEND_TEXT_X_OFFSET = 3;
    const LEGEND_TEXT_Y_OFFSET = -2;
    const legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);

    // Create legend elements for each category
    const legendElem = legend
        .append('g')
        .attr('transform', 'translate(60,' + LEGEND_OFFSET + ')')
        .selectAll('g')
        .data(categories)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            return (
                'translate(' +
                (i % legendElemsPerRow) * LEGEND_H_SPACING +
                ',' +
                (Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
                    LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow)) +
                ')'
            );
        });

    // Append colored rectangles to represent categories in the legend
    legendElem
        .append('rect')
        .attr('width', LEGEND_RECT_SIZE)
        .attr('height', LEGEND_RECT_SIZE)
        .attr('class', 'legend-item')
        .attr('fill', function (d) {
            return color(d);
        });

    // Append text labels for legend items
    legendElem
        .append('text')
        .attr('x', LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
        .attr('y', LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
        .text(function (d) {
            return d;
        });
}

// Helper functions
function fader(color) {
    return d3.interpolateRgb(color, '#fff')(0.2);
}

function sumBySize(d) {
    return d.value;
}

function handleMousemove(event, d) {
    tooltip
        .style('opacity', 0.9)
        .html(
            `Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`,
        )
        .attr('data-value', d.data.value)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 28}px`);
}

function handleMouseout() {
    tooltip.style('opacity', 0);
}