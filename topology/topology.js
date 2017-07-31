"use strict";
exports.__esModule = true;
var d3 = require("d3");
var TopologyViz = (function () {
    function TopologyViz(el) {
        this.visualization = null;
        this.nodes = [];
        this.links = [];
        this.nodeMap = {};
        this.linkMap = {};
        this.simulation = null;
        this.canvas = null;
        this.tooltip = null;
        this.radius = 10;
        this.el = el;
    }
    TopologyViz.prototype.onmounted = function () {
        var svg = d3.select(this.el), width = +svg.attr("width"), height = +svg.attr("height");
        this.canvas = svg;
        var self = this;
        this.simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(-400))
            .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(100).strength(1))
            .force("x", d3.forceX(width / 2))
            .force("y", d3.forceY(height / 2))
            .alphaTarget(0.1)
            .on("tick", function () { return self.ticked(); });
        var arrowSquare = this.radius + 1;
        svg.append("defs").selectAll("marker")
            .data(["arrow"])
            .enter().append("marker")
            .attr("id", function (d) { return d; })
            .attr("refX", this.radius + (this.radius / 2) - 3.0) // right at end of line
            .attr("refY", (this.radius / 2)) // half the distance
            .attr("markerWidth", arrowSquare)
            .attr("markerHeight", arrowSquare)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,0 L0," + arrowSquare + "L" + (arrowSquare / 2) + "," + (arrowSquare / 2) + " L0,0")
            .style("stroke", "#282828")
            .style("fill", "#282828")
            .style("opacity", "1.0");
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .call(d3.zoom()
            .scaleExtent([1 / 2, 4])
            .on("zoom", function () { return self.zoomed(); }));
        this.link = svg.append("g")
            .attr("class", "links")
            .style("marker-end", "url(#arrow)")
            .selectAll("line")
            .data(this.nodes);
        this.linklabel = svg.append("g")
            .attr("class", "linklabels")
            .attr("fill", "Black")
            .attr("dy", ".35em")
            .selectAll(".linklabel")
            .data(this.link);
        this.node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.nodes);
        this.nodelabel = svg.append("g")
            .attr("class", "nodelabels")
            .selectAll(".nodelabel")
            .data(this.nodes);
        this.tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");
        this.restart();
    };
    TopologyViz.prototype.graphLoaded = function (graph) {
        for (var index = 0; index < graph.nodes.length; index++) {
            var node = graph.nodes[index];
            if (!this.nodeMap.hasOwnProperty(node.id)) {
                this.nodeMap[node.id] = node;
                this.nodes.push(node);
            }
            else {
                this.nodeMap[node.id] = node;
            }
        }
        for (var index = 0; index < graph.links.length; index++) {
            var link = graph.links[index];
            if (!this.nodeMap.hasOwnProperty(link.source) || !this.nodeMap.hasOwnProperty(link.target)) {
                // ignore links that reference we don't know about
                continue;
            }
            if (!this.linkMap.hasOwnProperty(link.id)) {
                this.linkMap[link.id] = link;
                this.links.push(link);
            }
        }
        this.restart();
    };
    TopologyViz.prototype.updateLink = function (flow) {
        var self = this;
        if (!this.linkMap.hasOwnProperty(flow.id)) {
            this.linkMap[flow.id] = flow;
            this.links.push(flow);
        }
        else {
            var link = this.linkMap[flow.id];
            if (flow.hasOwnProperty("inBytes")) {
                link.inBytes = flow.inBytes;
            }
            if (flow.hasOwnProperty("outBytes")) {
                link.outBytes = flow.outBytes;
            }
        }
        this.restart();
    };
    TopologyViz.prototype.restart = function () {
        var self = this;
        // Apply the general update pattern to the nodes.
        self.node = this.node.data(self.nodes, function (d) { return d.id; });
        self.node.exit().remove();
        self.node = self.node.enter().append("circle")
            .attr("r", 12)
            .style("fill", function (d) { return self.color(d); })
            .on("mouseover", function (d) { return self.mouseover(d); })
            .on("mouseout", function (d) { return self.mouseout(d); }).merge(self.node);
        self.node.call(d3.drag()
            .on("start", function (d) { return self.dragstarted(d); })
            .on("drag", function (d) { return self.dragged(d); })
            .on("end", function (d) { return self.dragended(d); }));
        // Apply the general update pattern to the links.
        self.link = self.link.data(self.links);
        self.link.exit().remove();
        self.link = self.link.enter().append("svg:path").merge(self.link);
        // Apply the general update pattern to the labels.
        self.nodelabel = self.nodelabel.data(self.nodes, function (d) { return d.id; });
        self.nodelabel.exit().remove();
        self.nodelabel = self.nodelabel.enter()
            .append("text")
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .text(function (d) { return d.name; })
            .merge(self.nodelabel);
        self.linklabel = self.linklabel.data(self.links);
        self.linklabel.exit().remove();
        self.linklabel = self.linklabel.enter()
            .append("text")
            .attr("id", function (d) { return d.id; })
            .text(function (l) {
            var inBytes = null;
            var outBytes = null;
            if (l.hasOwnProperty("inBytes")) {
                inBytes = l.inBytes;
            }
            if (l.hasOwnProperty("outBytes")) {
                outBytes = l.outBytes;
            }
            outBytes = self.formatBytes(outBytes);
            inBytes = self.formatBytes(inBytes);
            if (inBytes !== "" && outBytes !== "") {
                return inBytes + " / " + outBytes;
            }
            else if (inBytes !== "") {
                return inBytes + " in";
            }
            else if (outBytes !== "") {
                return outBytes + " out";
            }
        })
            .merge(self.linklabel);
        // Update and restart the simulation.
        self.simulation.nodes(self.nodes);
        self.simulation.force("link").links(self.links);
        self.simulation.alpha(1).restart();
    };
    TopologyViz.prototype.formatBytes = function (bytes) {
        if (bytes === null || bytes === 0) {
            return "";
        }
        if (bytes < 1024) {
            return bytes + "b";
        }
        bytes = (bytes / 1024).toFixed(1) + "KB";
        return bytes;
    };
    TopologyViz.prototype.ticked = function () {
        try {
            this.node.attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
            this.link.attr("d", function (d) {
                var dx = d.target.x - d.source.x, dy = d.target.y - d.source.y, dr = Math.sqrt(dx * dx + dy * dy);
                return "M" +
                    d.source.x + "," +
                    d.source.y + "A" +
                    dr + "," + dr + " 0 0,1 " +
                    d.target.x + "," +
                    d.target.y;
            });
            this.nodelabel.attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y - 16; });
            // this.linklabel.attr("transform", function (d: any) {
            //     return "translate(" + (d.source.x + d.target.x) / 2 + "," + (d.source.y + d.target.y) / 2 + ")";
            // });
            this.linklabel.attr("transform", function (d) {
                var angle = Math.atan((d.source.y - d.target.y) / (d.source.x - d.target.x)) * 180 / Math.PI;
                return "translate(" + [((d.source.x + d.target.x) / 2), ((d.source.y + d.target.y) / 2)]
                    + ")rotate(" + angle + ")";
            });
        }
        catch (e) {
            console.error("tick[" + e + "]");
        }
    };
    TopologyViz.prototype.zoomed = function () {
        this.node.attr("transform", d3.event.transform);
        this.link.attr("transform", d3.event.transform);
        this.linklabel.attr("transform", d3.event.transform);
        this.canvas.selectAll("text").attr("transform", d3.event.transform);
    };
    // boiler plate d3 click and drag functions
    TopologyViz.prototype.dragstarted = function (d) {
        if (!d3.event.active) {
            this.simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    };
    TopologyViz.prototype.dragged = function (d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };
    TopologyViz.prototype.dragended = function (d) {
        if (!d3.event.active) {
            this.simulation.alphaTarget(0);
        }
    };
    TopologyViz.prototype.mouseover = function (d) {
        this.tooltip.transition()
            .duration(200)
            .style("opacity", 20);
        this.tooltip.html(this.getTooltip(d))
            .style("left", (d3.event.pageX + 30) + "px")
            .style("top", (d3.event.pageY - 12) + "px");
    };
    TopologyViz.prototype.mouseout = function (d) {
        this.tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    };
    TopologyViz.prototype.getTooltip = function (node) {
        return "Host: " + this.nodeMap[node.id].server;
    };
    TopologyViz.prototype.color = function (node) {
        var maxLength = 32;
        var i = this.map(node.group, 0, 100, 0, 255);
        var f = 0.3;
        var r = Math.round(Math.sin(f * i + 0) * 127 + 128);
        var g = Math.round(Math.sin(f * i + 2) * 127 + 128);
        var b = Math.round(Math.sin(f * i + 4) * 127 + 128);
        return "rgb(" + r + "," + g + "," + b + ")";
    };
    TopologyViz.prototype.map = function (x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    };
    return TopologyViz;
}());
exports.TopologyViz = TopologyViz;
//# sourceMappingURL=topology.js.map