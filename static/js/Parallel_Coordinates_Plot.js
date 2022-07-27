function Parallel_Coordinates_Plot(data) {
    var pcp_data = JSON.parse(data);

    document.getElementById("pcp-chart").innerHTML = "";

    var data = pcp_data[0];
    var dimensions = pcp_data[1];
    var klabel = pcp_data[2];
    var color_label = ["#ffa726", '#f57c00', '#ff6d00']; //Change Color Label
    var width = 750;
    var height = 400;
    var x_axis = d3.scalePoint().range([0, width], 1);
    var y_axis = {};
    var dragging = {}
    var axis = d3.axisLeft(), background_lines, foreground_lines;

    // Append the svg object to the body of the page
    var svg = d3.select("#pcp-chart")
        .append("svg")
        .attr("width", width + 150)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(80,10)");

    dimensions.forEach(function (attr) {
        y_axis[attr] = d3.scaleLinear().domain(d3.extent(data, function (row) {
            return +row[attr];
        })).range([height, 0])
        ;
    });

    x_axis.domain(dimensions);

    var background_lines = svg.append("g")
        .attr("class", "background_lines")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path).style("fill", "none")
        .style("stroke", "#ddd")
        .style("shape-rendering", "crispEdges")

    var foreground_lines = svg.append("g")
        .attr("class", "foreground_lines")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", function (d, i) {
            if (klabel[i] == 0) {
                return color_label[klabel[i]];
            } else if (klabel[i] == 1) {
                return color_label[klabel[i]];
            } else if (klabel[i] == 2) {
                return color_label[klabel[i]];
            }
        })

    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) {
            return "translate(" + x_axis(d) + ")";
        })
        .style("stroke", "white")
        .style("stroke-width", 0.3)
        .call(d3.drag()
            .on("start", function (d) {
                dragging[d] = this.__origin__ = x_axis(d);
                background_lines.attr("visibility", "hidden");
            })
            .on("drag", function (d) {
                dragging[d] = Math.min(width, Math.max(0, this.__origin__ += d3.event.dx));
                foreground_lines.attr("d", path);
                dimensions.sort(function (a, b) {
                    return position(a) - position(b);
                });
                x_axis.domain(dimensions);
                g.attr("transform", function (d) {
                    return "translate(" + position(d) + ")";
                })
            })
            .on("end", function (d) {
                delete this.__origin__;
                delete dragging[d];
                d3.select(this).attr("transform", "translate(" + x_axis(d) + ")").transition().duration(500);

                foreground_lines.transition().duration(500).attr("d", path);
                background_lines
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
            }));

    g.append("g")
        .attr("class", "axis")
        .each(function (d) {
            d3.select(this).call(axis.scale(y_axis[d]));
        })
        .append("text")
        .style("text-anchor", "middle")
        .attr("fill", "white")
        .attr("y_axis", -5)
        .text(function (d) {
            return d;
        });

    //Add and store a brush for each axis.
    g.append("svg:g")
        .attr("class", "brush")
        //Add the Brush Function Here.
        // .each(function (d) {
        //     return y_axis[d].brush = d3.brushY()(y_axis[d]).on("start", start).move("brush", brush);
        // })
        .selectAll("rect")
        .attr("x_axis", -12)
        .attr("width", 24);

    function position(d) {
        var v = dragging[d];
        return v == null ? x_axis(d) : v;
    }

    // Returns the path for a given data point.

    function path(d) {
        // return line(dimensions.map(function(p) { return [position(p), y_axis[p](d[p])]; }));
        return d3.line()(dimensions.map(function (key) {
            return [position(key), y_axis[key](d[key])];
        }));
    }

    function start() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground_lines lines.
    function brush() {
        var actives = dimensions.filter(function (p) {
                return !y_axis[p].brush.empty();
            }),
            extents = actives.map(function (p) {
                return y_axis[p].brush.extent();
            });

        foreground_lines.style("display", function (d) {
            return actives.every(function (p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    }

}

