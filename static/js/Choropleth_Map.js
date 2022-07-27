function USMap(data) {

    document.getElementById("us-chart").innerHTML = "";

    var data = JSON.parse(data);
    var state = data['State']; //Name of the state is stored here.
    var value = data[Object.keys(data)[1]]; //Value for each state From the Data.

    var height = 500;
    var width = 1300;
    var lowColor = "#FDF2E9";
    var highColor = "#784212";

    // Projection
    var projection = d3.geoAlbersUsa()
        .translate([width / 3, height / 3]) //Translate to center
        .scale([750]); //scale things down to see entire U.S.

    // Define path generator
    var path = d3.geoPath().projection(projection);

    var values = Object.keys(value).map(function (key) {
        return value[key];
    });

    var minVal = d3.min(values)
    var maxVal = d3.max(values)
    var arr = [];

    function split(left, right, parts) {
        var result = [],
            delta = (right - left) / (parts - 1);

        while (left < right) {
            result.push(parseInt(left));
            left += delta;
        }
        result.push(right);
        return result;
    }

    arr = split(minVal, maxVal, 10)

    var ramp = d3.scaleThreshold().domain([10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000]).range(['#FDF2E9', '#ffcc80', '#F5CBA7', '#F0B27A', '#EB984E', '#E67E22', '#BA4A00', '#AF601A', '#935116', '#784212']);
    //Create SVG element and append map to the SVG
    var svg = d3.select("#us-chart")
        .append("svg")
        .attr("id", "my_map_svg")
        .attr("width", width / 1.5)
        .attr("height", height / 1.5)
        .append("g")
        .attr("transform", "translate(" + 50 + "," + 0 + ")");


    d3.json("static/us-states-data.json", function (json) {

        for (var j = 0; j < json.features.length; j++) {
            json.features[j].properties.value = 0;
        }

        for (var i = 0; i < 52; i++) {
            var dataState = state[i];
            var dataValue = value[i];

            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;
                if (dataState == jsonState) {
                    json.features[j].properties.value = dataValue;
                    break;
                }
            }
        }

        // Tooltip
        var div = d3.select("#us-chart").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0.3);

        // SVG Path.
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "map_path")
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function (d) {
                return ramp(d.properties.value)
            })
            .on("mouseover", function (d) {
                div.transition()
                    .duration(150)
                    .style("opacity", .8)
                div.html(d.properties.name + ": " + d.properties.value)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .attr('class', 'd3-tip')
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
                global_dashboard("map", "state", d.properties.name);
            });

        var legend_width = 90, legend_height = 240;

        var key = d3.select("#us-chart")
            .append("svg").attr("id", "my_map_svg")
            .attr("width", legend_width)
            .attr("height", legend_height)
            .attr("class", "legend")
            .attr("transform",
                "translate(" + 40 + "," + 60 + ")");

        var legend = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "100%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", highColor)
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", lowColor)
            .attr("stop-opacity", 1);

        key.append("rect")
            .attr("width", legend_width - 80)
            .attr("height", legend_height)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(0,10)");

        var y = d3.scaleLinear()
            .range([legend_height - 10, 0])
            .domain([minVal, maxVal]);

        var yAxis = d3.axisRight(y);

        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(10,10)")
            .style("stroke", "#ddd")
            .call(yAxis)
    });


}
