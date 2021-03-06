var canvas = d3.select("#network"),
    width = canvas.attr("width"),
    height = canvas.attr("height"),
    r = 3, // radius
    color = d3.scaleOrdinal(d3.schemeCategory20),
    x = d3.scaleOrdinal().range([20, width - 20]),
    ctx = canvas.node().getContext("2d");
simulation = d3.forceSimulation()
    .force("x", d3.forceX(function (d) {
            return x(d.party);
        }).strength(0.7))
        .force("y", d3.forceY(height / 2))
        .force("collide", d3.forceCollide(r + 1))
        .force("charge", d3.forceManyBody()
            .strength(-20))
        .force("link", d3.forceLink()
            .strength(0.01)
            .id(function (d) {
                return d.name;
            }));

// graph.nodes.forEach(function(d){
//     d.x = Math.random() * width;
//     d.y = Math.random() * height;
// })
d3.json("data.json", function (err, graph) {
    if (err) throw err;

    simulation
        .nodes(graph.nodes)
        .on("tick", update)
        .force("link")
        .links(graph.links);

    canvas
        .call(d3.drag()
            .container(canvas.node())
            .subject(dragsubject)
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    function update() {
        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = "#aaa";
        graph.links.forEach(drawLink);
        ctx.stroke();

        ctx.beginPath();
        ctx.globalAlpha = 1.0;
        graph.nodes.forEach(drawNode);
        ctx.fill();
    }

    function dragsubject() {
        return simulation.find(d3.event.x, d3.event.y);
    }


})

function drawNode(d) {
    ctx.beginPath();
    ctx.fillStyle = color(d.party);
    ctx.moveTo(d.x, d.y);
    ctx.arc(d.x, d.y, r, 0, 2 * Math.PI);
    ctx.fill();
}

function drawLink(l) {
    ctx.moveTo(l.source.x, l.source.y);
    ctx.lineTo(l.target.x, l.target.y);
}

function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
    console.log(d3.event.subject);
}

function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
}

function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
}