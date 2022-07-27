function Bar_Chart(data, crime) {
    document.getElementById("bar-chart").innerHTML = "";

    var myData = JSON.parse(data);
    var name = 0;

    var dataNameList = [];
    var dataValArray = [];

    for (var i in myData) {
        var item = myData[i];
        for (var j in item) {
            if (name == 1) {
                dataValArray.push(item[j]);
            } else if (name == 2) {
                dataNameList.push(item[j]);
            }
        }
        name = name + 1;
    }

    var height = 400;
    var width = 400;

    var svg = d3.select("#bar-chart")
        .append("svg")
        .attr("id", "bar_graph")
        .attr("width", width)
        .attr("height", height)

    var g = svg.append("g")
        .attr("transform", "translate(" + -20 + "," + -25 + ")");

    var x = d3.scaleBand().domain(dataNameList).range([height, 0]).padding(0.5);
    var y = d3.scaleLinear().domain([d3.min(dataValArray), d3.max(dataValArray)]).range([0, width]);

    var xAxis = d3.axisBottom(y);
    var yAxis = d3.axisLeft(x);

    g.append("g")
        .attr("transform", "translate(100," + height + ")").style("fill", "white")
        .call(xAxis.tickFormat(function (d) {
            return d;
        }).ticks(5)).style("stroke", "white")

    g.append("g")
        .attr("transform", "translate(100,0)").style("fill", "white")
        .call(yAxis).style("stroke", "white")
        .append("text")
        .attr("transform", "rotate(-90)")

    svg.append("text")
        .attr("transform",
            "translate(" + (width - 190) + " ," +
            (height) + ")")
        .attr("dx", "0.01em")
        .style("text-anchor", "middle")
        .style("font-size", "12")
        .style("fill", "white")
        .text("Frequency of " + crime);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1.5em")
        .style("text-anchor", "middle")
        .style("font-size", "12")
        .style("fill", "white")
        .text("Years from 2014 to 2019");
    g.append("g").attr("transform", "translate(100," + height + ")")

    g.selectAll(".bar")
        .data(dataNameList)
        .enter().append("rect")
        .attr("class", "bar")
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)
        .on("click",clickBar)
        .attr("fill", "#FFA500") //"#b5e7a0")
        .attr("y", function (d) {
            return x(d);
        })
        .attr("x", 100)
        .attr("height", x.bandwidth())

        .attr("width", 0)
        .transition()
        .ease(d3.easeLinear)
        .duration(400)
        .delay(function (d, i) {
            return i * 100;
        })
        .attr("width", function (d, i) {
            return y(dataValArray[i]);
        })

    var tool_tip = d3.tip()
        .attr('class', 'd3-bar-tip')
        .html('<div id="tipDiv"><p></p></div>')

    function onMouseOver(d, i) {
        d3.select(this).attr('class', 'highlight');
        d3.select(this)
            .transition()
            .duration(100)
            .attr("y", function (d) {
                console.log("value of bar: " + dataValArray[i]);
                return x(d);
            })
            .attr("x", 100)
            .attr("height", x.bandwidth())
            .attr('text-anchor', 'center')
            .attr("fill", "#e65100")
            .style('opacity', 0.5)
        svg.call(tool_tip);
        tool_tip.show();
        document.getElementById('tipDiv').innerHTML = "<p>" + dataValArray[i] + "</p>";
    }

    function onMouseOut(d, i) {
        d3.select(this).attr('class', 'bar');
        d3.select(this)
            .transition()
            .duration(100)
            .attr("fill", "#FFA500")//"#b5e7a0"
            .style("fill-opacity", 100);
        d3.selectAll('.val')
            .remove()
        tool_tip.hide();
        document.getElementById('tipDiv').innerHTML = "";
    }

    function clickBar(d,i) {
        //global_dashboard("bar", "year", dataNameList[i]);
    }
}