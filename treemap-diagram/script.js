// Create links
d3.select("body")
  .selectAll("a")
  .data([
    { label: "Video Game Data Set", data: "videogames" },
    { label: "Movies Data Set", data: "movies" },
    { label: "Kickstarter Data Set", data: "kickstarter" }
  ])
  .enter()
  .append("a")
  .attr("href", d => `?data=${d.data}`)
  .text(d => d.label)
  .style("margin-right", "10px");

// Create h1 title
d3.select("body")
  .append("h1")
  .attr("id", "title")
  .text("Video Game Sales");

// Create description div
d3.select("body")
  .append("div")
  .attr("id", "description");

// Create tree-map SVG
d3.select("body")
  .append("svg")
  .attr("id", "tree-map")
  .attr("width", 960)
  .attr("height", 570);

// Create legend SVG
d3.select("body")
  .append("svg")
  .attr("id", "legend")
  .attr("width", 500);