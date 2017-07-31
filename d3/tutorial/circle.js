function createCircles() {
    var svg = d3.select("#circle"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var radius = 20;
    var point = {
        x: 50,
        y: 50
    };


    for (var i = 1; i <= 10; i++) {
        svg.append("circle")
            .attr("cx", point.x)
            .attr("cy", point.y)
            .attr("r", radius)
            .attr("fill", "gray")
            .attr("transform", "translate(" + (i * 30) + "," + (i * 30) + ")");

    }
}

function createDuplicate(){
    var item = document.getElementById("circle");
    var item_clone = item.cloneNode(true);
    item_clone.removeAttribute("id");
    console.log(item_clone);
    var element = document.getElementById("dup");
    element.appendChild(item_clone);
}

createCircles();
createDuplicate();

// for (var i = 1; i <= 10; i++) {
//     svg.append("circle")
//         .attr("cx", point.x)
//         .attr("cy", point.y)
//         .attr("r", radius)
//         .attr("fill", "blue")
//         .attr("transform", "translate(" + (i * 40) + "," + (i * 40) + ")" +
//             " scale(" + (1 + i / 5) + ")");
//         }


// var p = document.getElementById("zoomable");
// var p_clone = p.cloneNode(true);
// p_clone.removeAttribute("id");
// var element = document.getElementById("minimap");
// element.appendChild(p_clone);
// console.log(p_clone);