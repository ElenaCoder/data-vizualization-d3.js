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
