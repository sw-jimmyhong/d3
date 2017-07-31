// svg and margin dimension
var svg_dx = 1000,
    svg_dy = 500,
    margin_x = 100;

var shapes = [
    d3.symbolCircle,
    d3.symbolCross,
    d3.symbolDiamond,
    d3.symbolSquare,
    d3.symbolStar,
    d3.symbolTriangle,
    d3.symbolWye
];

var x = d3.scalePoint()
    .domain(d3.range(0, shapes.length))
    .range([margin_x, svg_dx - margin_x]);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", svg_dx)
    .attr("height", svg_dy);

var symbol = d3.symbol().size([1500]),
    color = d3.schemeCategory20;

var drag_behavior = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged);

var drag_this = d3.drag().subject(this)
    .on('start',function (d) {
        console.log("start");
        if (d.x1){
            d.x1 =  d3.event.x - d.xt;
            d.y1 =  d3.event.y - d.yt;
        }else{
            d.x1 = d3.event.x;
            d.y1 = d3.event.y;
        }
    })
    .on('drag',function(d){
        d3.select(this)
        .attr("transform", "translate(" + (d3.event.x - d.x1)  + "," + (d3.event.y - d.y1) + ")");

        d.xt = d3.event.x - d.x1;
        d.yt = d3.event.y - d.y1;
    });


// svg.append("g")
//     .attr("transform", "translate(0,0)")
//     .call(drag_this)
//     .selectAll("path")
//     .data(shapes)
//     .enter()
//     .append("path")
//     .attr("d", symbol.type(shape => shape))
//     .attr("transform", (shape, i) => "translate(" + x(i) + ", -40)")
//     .style("fill", (shape, i) => color[i])
//     .call(drag_behavior)
//     .transition()
//     .duration((shape, i) => i * 800)
//     .attr("transform", (shape, i) => "translate(" + x(i) + "," + (svg_dy / 2) + ")");
svg.append("g")
    .selectAll("path")
    .data(shapes)
    .enter()
    .append("path")
    .attr("d", symbol.type(shape => shape))
    .attr("transform", (shape, i) => "translate(" + x(i) + ", -40)")
    .style("fill", (shape, i) => color[i])
    .call(drag_behavior)
    .transition()
    .duration((shape, i) => i * 800)
    .attr("transform", (shape, i) => "translate(" + x(i) + "," + (svg_dy / 2) + ")");

function dragstarted() {
    d3.select(this).raise();
}

function dragged(shape) {

    var dx = d3.event.sourceEvent.offsetX,
        dy = d3.event.sourceEvent.offsetY;

    d3.select(this)
        .attr("transform", shape => "translate(" + dx + "," + dy + ")");
}