function Line_Chart(data) {

    document.getElementById("line-chart").innerHTML = "";
    var myData = JSON.parse(data);
    var height = 375
    var width = 300
    var name = 0;
    var Pop_list = [];
    var Year_list = [];
    var Population_list = []

    //Separating Year and Population list
    for (var i in myData) {
        var item = myData[i];
        for (var j in item) {
            if (name == 0) {
                Year_list.push(item[j]);
            } else if (name == 1) {
                Pop_list.push(item[j]);
            }
        }
        name = name + 1;
    }

    //Rounding off the Million values for displaying on Y-axis
    for (let i = 0; i < Pop_list.length; i++) {
        Population_list.push((Pop_list[i] / 1000000).toFixed(2))
    }

    //SVG height and width
    var svg = d3.select("#line-chart")
        .append("svg")
        .attr("id", "line_svg")
        .attr("transform", "translate(" + 35 + "," + 0 + ")")
        .attr("width", 400)
        .attr("height", height)

    var g = svg.append("g")
        .attr("transform", "translate(" + -80 + "," + -80 + ")");

    //X scale and Y scale
    var x = d3.scaleTime().range([0, width - 20]);
    var y = d3.scaleLinear().range([height - 50, 0]);

    // line data
    var valueline = d3.line()
        .x(function (d, i) {
            return x(Year_list[i]);
        })
        .y(function (d, i) {
            return y(Population_list[i]);
        });

    //Ticks values on X and Y axis
    x.domain(d3.extent(Year_list))
    y.domain([d3.min(Population_list), d3.max(Population_list)]);

    //Draw X- axis
    svg.append("g")
        .attr("transform", "translate(40," + 340 + ")").style("fill", "white")
        .call(d3.axisBottom(x)).style("stroke", "white");

    //Draw Y-axis
    svg.append("g").attr("transform", "translate(" + 40 + ",15)").style("fill", "white")
        .call(d3.axisLeft(y).ticks(6)).style("stroke", "white");

    //Draw Line as per line data
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("stroke", "#e65100")
        .attr("stroke-width", 5)
        .transition()
        .ease(d3.easeLinear)
        .duration(1000)
        .delay(function (d, i) {
            return i * 1000;
        }).attr("d", valueline(data))
        .attr("fill", "none")
        .attr("transform", "translate(" + 40 + "," + 15 + ")")

    // Appending dots for displaying year
    svg.append('g')
        .selectAll("dot")
        .data(Year_list)
        .enter()
        .append("circle")
        .on("click", onClick)
        .transition()
        .ease(d3.easeLinear)
        .duration(1000)
        .delay(function (d, i) {
            return i * 100;
        })
        .attr("cx", function (d, i) {
            return x(Year_list[i]);
        }).style("fill", "white")
        .attr("cy", function (d, i) {
            return y(Population_list[i]);
        }).style("fill", "white")
        .attr("r", 5)
        .attr("fill", "orange")
        .attr("transform", "translate(" + 40 + "," + 15 + ")");

    //Displaying year against dots
    svg.selectAll(".dotts")
        .data(data)
        .enter().append("text")
        .attr("class", "dotts")
        .attr("x", function (d, i) {
            return x(Year_list[i]);
        })
        .attr("y", function (d, i) {
            return y(Population_list[i]);
        })
        .attr("dx", ".100em")
        .attr("dy", "1em")
        .attr("font-size", "12")
        .attr("stroke", "orange")
        .text(function (d, i) {
            if (i != 0) return Year_list[i];
        });

    //X-axis label
    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height - 5) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "12")
        .style("fill", "white")
        .text("Years");

    //Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (height / 2))
        .attr("dy", "0.70em")
        .style("text-anchor", "middle")
        .style("font-size", "12")
        .style("fill", "white")
        .text("Population in Millions");

    //Click event useful for linkage
    function onClick(d, i) {
        var selectedYear = Year_list[i]
        console.log("Selected Year", Year_list[i])
        g.append("text")
            .attr('class', 'val')
            .attr("cx", function (d, i) {
                return x(Year_list[i]);
            })
            .attr("cy", function (d, i) {
                return y(Population_list[i]);
            })
            .text(function () {
                return [+Year_list[i]];
            });
        global_dashboard("line", "year", Year_list[i]);

    }
}
