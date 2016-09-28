
var margin = {top: 0, 
			right: 0, 
			bottom: 0, 
			left: 0 };

var svg = d3.select("svg");

var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;

var g = svg.append("g")
		.attr("class", "plot")
		.attr("transform", "translate(" + 600 + "," + 250 + ")")

var data = [];

function getDataStream(leftArm, rightArm){

	var x = d3.scaleLinear()
    .domain([0, 50]) 
    .range([0, width]); 

    var y = d3.scaleLinear()
    .domain([-0.8553981633974483, 0.6446018366025527])
    .range([height, 0]); 

    var line = d3.line()
    	.x(function(d, i) { return x(i); })
    	.y(function(d, i) { return y(d); });


    g.append("defs").append("clipPath")
	    .attr("id", "clip")
	  .append("rect")
	    .attr("width", width)
	    .attr("height", height);	

	g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(d3.axisBottom(x));

    g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y));

    g.append("g")
	    .attr("clip-path", "url(#clip)")
	  .append("path") 
	    .datum(leftArm) 
	    .attr("class", "line") 
	  .transition()
	    .duration(500)
	    .ease(d3.easeLinear)
	    .on("start", tick);

	function tick(d) {
	  // Push a new data point onto the back.

	  console.log("I got data ", d);

	  data.push(d); 

	  // Redraw the line.
	  d3.select(this)
	      .attr("d", line)
	      .attr("transform", null);

	  // Slide it to the left.
	  d3.active(this)
	      .attr("transform", "translate(" + x(-1) + ",0)")
	    .transition()
	      .on("start", tick);

	  // Pop the old data point off the front.
	  data.shift();

	}

} 




