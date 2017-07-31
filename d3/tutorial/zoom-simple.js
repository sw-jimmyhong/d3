function zoomSimple(){
    var svg = d3.select("#zoom-simple"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
    
//create some circles at random points on the screen 
//create 50 circles of radius 20
//specify centre points randomly through the map function 
var radius = 20;
var circle_data = d3.range(50).map(function() {
    return{
        x : Math.round(Math.random() * (width - radius*2 ) + radius),
        y : Math.round(Math.random() * (height - radius*2 ) + radius)
    }; 
}); 

//draw the circles on the page 
var circles = svg.append("g")
    .attr("class", "circles")
    .selectAll("circle")
        .data(circle_data)
        .enter()
        .append("circle")
        //same as .attr("cx", function(d) {return(d.x)})
        .attr("cx", (d) => d.x)
        //same as .attr("cy", function(d) {return(d.y)})
        .attr("cy", (d) => d.y)
        .attr("r", radius)
        .attr("fill", "green");

        
//create zoom handler 
var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

//specify what to do when zoom event listener is triggered 
function zoom_actions(){
 circles.attr("transform", d3.event.transform);
}

//add zoom behaviour to the svg element 
//same as svg.call(zoom_handler); 
zoom_handler(svg);
}

zoomSimple();