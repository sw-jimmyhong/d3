(function () {
    var width = 900,
        height = 500;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0,0)");

    var radiusScale = d3.scaleSqrt().domain([0, 65]).range([10, 50]);

    // simulation is collection of forces
    // about where we want our circles to go
    // and how we want our circles to interact

    // STEP ONE: get them to middle
    // STEP TWO: don't have them collide

    var forceXSplit = d3.forceX(function(d){
            if(d.distance < 3000){
                return 200
            } else {
                return 700
            }
        }).strength(0.05);

    var forceXCombine = d3.forceX(width / 2).strength(0.05);

    var forceCollide = d3.forceCollide(function (d) {
            return radiusScale(d.age) + 1;
        })

    var simulation = d3.forceSimulation()
        .force("x", forceXCombine)
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", forceCollide)

    d3.queue()
        .defer(d3.csv, "data.csv")
        .await(ready);

    function ready(error, datapoints) {
        console.log(datapoints);
        var circles = svg.selectAll(".artist")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "artist")
            .attr("r", function (d) {
                return radiusScale(d.age);
            })
            .attr("fill", "lightblue")
            .on("click", function (d) {
                console.log(d);
            });

        d3.select("#split").on('click', function(){
            simulation
                .force("x", forceXSplit)
                .alphaTarget(0.5)
                .restart()
        });

        d3.select("#combine").on('click', function(){
            simulation
                .force("x", forceXCombine)
                .alphaTarget(0.5)
                .restart()
        });

        simulation.nodes(datapoints)
            .on('tick', ticked);

        function ticked() {
            circles
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
        }
    }
})();