const EDUCATION_DATA =
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
const COUNTY_DATA =
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
const color = d3
    .scaleThreshold()
    .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
    .range(d3.schemeGreens[9]);

// Legend setup
const legend = svg
    .append('g')
    .attr('class', 'key')
    .attr('id', 'legend')
    .attr('transform', 'translate(0,40)');

legend
    .selectAll('rect')
    .data(color.range().map((d) => color.invertExtent(d)))
    .enter()
    .append('rect')
    .attr('height', 8)
    .attr('x', (d) => x(d[0]))
    .attr('width', (d) => (d[0] && d[1] ? x(d[1]) - x(d[0]) : x(null)))
    .attr('fill', (d) => color(d[0]));

legend
    .append('text')
    .attr('class', 'caption')
    .attr('x', x.range()[0])
    .attr('y', -6)
    .attr('fill', '#000')
    .attr('text-anchor', 'start')
    .attr('font-weight', 'bold');

legend
    .call(
        d3
            .axisBottom(x)
            .tickSize(13)
            .tickFormat((x) => Math.round(x) + '%')
            .tickValues(color.domain()),
    )
    .select('.domain')
    .remove();

// Load data and create visualization
Promise.all([d3.json(COUNTY_DATA), d3.json(EDUCATION_DATA)])
    .then((data) => createChoroplethMap(data[0], data[1]))
    .catch((err) => console.log(err));

function createChoroplethMap(us, education) {
    // Counties
    svg.append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(topojson.feature(us, us.objects.counties).features)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('data-fips', (d) => d.id)
        .attr('data-education', (d) => {
            const result = education.find((obj) => obj.fips === d.id);
            return result ? result.bachelorsOrHigher : 0;
        })
        .attr('fill', (d) => {
            const result = education.find((obj) => obj.fips === d.id);
            return result ? color(result.bachelorsOrHigher) : color(0);
        })
        .attr('d', path)
        .attr('class', 'county')
        .attr('data-fips', (d) => d.id)
        .attr('data-education', (d) => {
            const result = education.find((obj) => obj.fips === d.id);
            return result ? result.bachelorsOrHigher : 0;
        })
        .attr('fill', (d) => {
            const result = education.find((obj) => obj.fips === d.id);
            return result ? color(result.bachelorsOrHigher) : color(0);
        })
        .attr('d', path)
        .on('mouseover', function (event, d) {
            handleMouseOver(event, d, education); // Pass the education data
        })
        .on('mouseout', handleMouseOut);

    // Create state boundaries
    svg.append('path')
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr('class', 'states')
        .attr('d', path);
}

function handleMouseOver(event, d, education) {
    const result = education.find((obj) => obj.fips === d.id);
    if (result) {
        tooltip
            .style('opacity', 0.9)
            .html(
                () =>
                    `${result.area_name}, ${result.state}: ${result.bachelorsOrHigher}%`,
            )
            .attr('data-education', result.bachelorsOrHigher)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`);
    }
}

function handleMouseOut() {
    tooltip.style('opacity', 0);
}
