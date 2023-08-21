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

// Get dataset parameter from URL or use the default
var urlParams = new URLSearchParams(window.location.search);
const DEFAULT_DATASET = 'videogames';
const DATASET = DATASETS[urlParams.get('data') || DEFAULT_DATASET];


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
d3.select('body').append('h1').attr('id', 'title').text('Video Game Sales');

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
