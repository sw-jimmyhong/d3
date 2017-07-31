function zoomSelective() {
	var svg = d3.select("#zoom-selective"),
		width = +svg.attr("width"),
		height = +svg.attr("height");

	var radius = 30;
	var circle1 = {
		x: 200,
		y: height / 2
	};
	var circle2 = {
		x: 600,
		y: height / 2
	};

	var circle1 = svg.append("circle")
		.attr("cx", circle1.x)
		.attr("cy", circle1.y)
		.attr("r", radius)
		.attr("fill", "orange");

	var circle2 = svg.append("circle")
		.attr("cx", circle2.x)
		.attr("cy", circle2.y)
		.attr("r", radius)
		.attr("fill", "red");

	//define zoom behaviour 
	var zoom_handler = d3.zoom()
		.on("zoom", zoom_actions);

	zoom_handler(circle1);
	zoom_handler(circle2);

	function zoom_actions() {
		var transform = d3.zoomTransform(this);
		// same as  this.setAttribute("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
		this.setAttribute("transform", transform)
	}
}

zoomSelective();