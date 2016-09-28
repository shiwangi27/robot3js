
var svg = d3.select("svg").style("z-index", -10).style("position","absolute").on("touchmove mousemove", moved),
    width = +svg.attr("width"),
    height = +svg.attr("height");


// svg.append("text")
//   .text("Hi! I'm Rusty. Your animated robot. You can completely interact with me.")
//   .attr("transform", "translate(50,50)")
//   .attr("font-size","20px")
//   .attr("color", "#f00")
//   //.attr("position","absolute")
//   .attr("z-index", 0) 

// Create Random set of co-ordinates as data points. 
var sites = d3.range(100)
    .map(function(d) { return [Math.random() * width, Math.random() * height]; });

//console.log(sites);

// Defines a bouding box for the Voronoi map
var voronoi = d3.voronoi()
    .extent([[-1, -1], [width + 1, height + 1]]);

var poly = d3.extent(voronoi.polygons(sites), d => d[0][0])

var color = d3.scaleLinear().domain(poly).range(['#f0f0f0','#636363'])


// voronoi.polygons(data) takes in the sites which is again 2D point locations. You can use your own data here. 
var polygon = svg.append("g")
    .attr("class", "polygons")
  .selectAll("path")
  .data(voronoi.polygons(sites)) 
  .enter().append("path")
    .call(redrawPolygon);


var site = svg.append("g")
    .attr("class", "sites")
  .selectAll("circle")
  .data(sites)
  .enter().append("circle")
    .attr("r", 2.5)
    .call(redrawSite); 

// Initial mouse point at sites[0] coordinates 
function moved() {
  sites[0] = d3.mouse(this);
  redraw();
} 

function redraw() {
  var diagram = voronoi(sites);
  polygon = polygon.data(diagram.polygons()).call(redrawPolygon);
  site = site.data(sites).call(redrawSite);
}

function redrawPolygon(polygon) {
  polygon
      .style('fill', d => color(d[0][0]))
      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });
}


// Draws the ( sites[0], sites[1] ) in each data point. 
function redrawSite(site) {
  site
      .attr("cx", function(d) { return d[0]; })
      .attr("cy", function(d) { return d[1]; });
}