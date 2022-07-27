function Pie_Chart(data1) {

    document.getElementById("pie-chart").innerHTML = "";
    var new_data = JSON.parse(data1)

    //Separating data values
    indexArr = ["0", "index"]
    var values = []
    Object.keys(indexArr[0])
        .every((property) => values.push(new_data[property]))
    var data = []
    for (let i = 0; i < 4; i++) {
        data.push(values[0][i])
    }

    var width = 400,
        height = 375,
        radius = Math.min(width, height) / 2;


    var color = d3.scaleOrdinal()
        .range(["#ffa726", "#fb8c00", "#f57c00", "#ffb74d"]);

    //labels
    var legends = ["Burglary", "Larceny", "Motor", "Assault"];

    //Arcs of pie
    var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    //Labels of Arc
    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    //Using D3 library to contsruct pie
    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d;
        });

    var svg = d3.select("#pie-chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    //data on Pie
    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    //Coloring arcs
    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data);
        }).style("opacity", "0.5")
        .on("mouseover", function (d, i) {
            d3.select(this)
                .attr("stroke", "white")
                .attr("stroke-width", "0.6");
        })
        .on("mouseout", function (d, i) {
            d3.select(this)
                .transition().duration(400)
                .attr("d", arc);
        })

        //Click for linking
        .on("click", function (d, i) {
            console.log("Pie: " + legends[i]);
            global_dashboard("pie", "crime", legends[i]);
        })
        .attr("d", arc)
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
            var i = d3.interpolate(d.endAngle, d.startAngle);
            return function (a) {
                d.startAngle = i(a);
                return arc(d);
            }
        });

    // Labels on Arcs
    g.append("text")
        .attr("transform", function (d) {
            return "translate(" + labelArc.centroid(d) + ")";
        })
        .style("text-anchor", "middle")
        .style("font-size", 12)
        .style("fill", "white")
        .text(function (d, i) {
            return legends[i];
        });


}
