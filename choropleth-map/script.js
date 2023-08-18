const EDUCATION_FILE =
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
const COUNTY_FILE =
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

const body = d3.select('body');

// Create a container div using D3
const container = d3.select('body').append('div').attr('id', 'main');

// Set the title using D3
container
    .append('h1')
    .attr('id', 'title')
    .text('United States Educational Attainment');

// Set the description using D3
container
    .append('div')
    .attr('id', 'description')
    .text(
        "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)",
    );

// Create the SVG element using D3
const svg = container.append('svg').attr('width', 960).attr('height', 600);

// Set the source link using D3
const source = container.append('div').attr('id', 'source');
source.append('span').text('Source: ');
source
    .append('a')
    .attr(
        'href',
        'https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx',
    )
    .text('USDA Economic Research Service');

// Tooltip setup
const tooltip = body
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('opacity', 1);

const path = d3.geoPath();

// Scales and color setup
const x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);
const color = d3.scaleThreshold()
    .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
    .range(d3.schemeGreens[9]);