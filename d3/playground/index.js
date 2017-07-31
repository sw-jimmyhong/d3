function gridData() {
  var data = new Array();
  var width = 15;
  var height = 15;
  var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
  var ypos = 1;
  var click = 0;
  var size = 30;

  // iterate for rows	
  for (var row = 0; row < size; row++) {
    data.push(new Array());

    // iterate for cells/columns inside rows
    for (var column = 0; column < size; column++) {
      data[row].push({
        x: xpos,
        y: ypos,
        width: width,
        height: height,
        click: click
      })
      // increment the x position. I.e. move it over by 50 (width variable)
      xpos += width;
    }
    // reset the x position after a row is complete
    xpos = 1;
    // increment the y position for the next row. Move it down 50 (height variable)
    ypos += height;
  }
  return data;
}

var gridData = gridData();
// log the data to the console for quick debugging
console.log(gridData);

// main grid
var width = 500;
var height = 500;
var grid = d3.select("#grid")
  .append("svg")
  .attr("id", "main_grid")
  .attr("width", width)
  .attr("height", height);

// add rows
var row = grid.selectAll(".row")
  .data(gridData)
  .enter().append("g")
  .attr("class", "row");

// add columns
var column = row.selectAll(".square")
  .data(function (d) {
    return d;
  })
  .enter().append("rect")
  .attr("class", "square")
  .attr("x", function (d) {
    return d.x;
  })
  .attr("y", function (d) {
    return d.y;
  })
  .attr("width", function (d) {
    return d.width;
  })
  .attr("height", function (d) {
    return d.height;
  })
  .style("fill", "#fff")
  .style("stroke", "#cccccc") // grid line color
  .on('click', function (d) {
    d.click++;
    if ((d.click) % 4 == 0) {
      d3.select(this).style("fill", "#fff");
    }
    if ((d.click) % 4 == 1) {
      d3.select(this).style("fill", "#2C93E8");
    }
    if ((d.click) % 4 == 2) {
      d3.select(this).style("fill", "#F56C4E");
    }
    if ((d.click) % 4 == 3) {
      d3.select(this).style("fill", "#838690");
    }
  });

//create zoom handler 
var zoom_handler = d3.zoom()
  .on("zoom", zoom_actions);

//specify what to do when zoom event listener is triggered 
function zoom_actions() {
  column.attr("transform", d3.event.transform);
  
}

//add zoom behaviour to the grid element 
//zoom_handler(grid);

function createDuplicate() {
  var test = d3.select("#main_grid");
  console.log('dup ', test);
  // get main grid
  var grid = document.getElementById("main_grid");
  // remove id attr
  grid.removeAttribute("id");
  // clone the node
  var clone = grid.cloneNode(true);
  d3.select(clone).attr("transform", "translate(1,1)");
  // grab minimap id
  var dup = document.getElementById("minimap");
  // append the cloned node to minimap
  dup.append(clone);
  //console.log(clone);


}

createDuplicate();