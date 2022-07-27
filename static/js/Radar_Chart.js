function Radar_Chart(data) {
    document.getElementById("radar-chart").innerHTML = "";

    d = []
    for (let i = 0; i < data.length; i++) {
        if (data[i].length != 0) {
            d.push(data[i])
        }
    }

    //setting width and height of radar chart
    var h = 300;
    var w = 300;
    //var colorscale = ['#ffb74d', '#fb8c00', '#ef6c00', '#e65100'];
    var colorscale = ['#BA4A00', '#AF601A', '#935116', '#784212'];

    //Index of array with max length
    var maxArray = []
    for (let i = 0; i < d.length; i++) {
        maxArray.push(d[i].length)
    }
    maxEle = maxArray.indexOf(Math.max(...maxArray))

    var mycfg = {
        w: w,
        h: h,
        maxValue: 0.6,
        levels: 6,
        ExtraWidthX: 300,
        color: function (i) {
            c = ['#BA4A00', '#AF601A', '#935116', '#784212'];
            return c[i];
        }
    }

    var RadarChart = {
        draw: function (id, d, options) {
            var cfg = {
                radius: 2,
                w: 100,
                h: 100,
                factor: 1,
                factorLegend: .85,
                levels: 3,
                maxValue: 0,
                radians: 2 * Math.PI,
                opacityArea: 0.5,
                ToRight: 5,
                TranslateX: 50,
                TranslateY: 70,
                ExtraWidthX: 100,
                ExtraWidthY: 100,
                color: function (i) {
                    c = ['#BA4A00', '#AF601A', '#935116', '#784212'];
                    return c[i];
                }
            };

            if ('undefined' !== typeof options) {
                for (var i in options) {
                    if ('undefined' !== typeof options[i]) {
                        cfg[i] = options[i];
                    }
                }
            }
            cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function (i) {
                return d3.max(i.map(function (o) {
                    return o.value;
                }))
            }));

            var allAxis = (d[maxEle].map(function (i, j) {
                return i.axis
            }));
            var total = allAxis.length;
            var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
            var Format = d3.format('%');
            d3.select(id).select("svg").remove();

            var g = d3.select(id)
                .append("svg").attr("id", "my_radar_svg")
                .attr("width", cfg.w + cfg.ExtraWidthX)
                .attr("height", cfg.h + cfg.ExtraWidthY)
                .append("g")
                .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
            ;


            for (var j = 0; j < cfg.levels - 1; j++) {
                var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
                g.selectAll(".levels")
                    .data(allAxis)
                    .enter()
                    .append("svg:line")
                    .attr("x1", function (d, i) {
                        return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
                    })
                    .attr("y1", function (d, i) {
                        return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
                    })
                    .attr("x2", function (d, i) {
                        return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
                    })
                    .attr("y2", function (d, i) {
                        return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
                    })
                    .attr("class", "line")
                    .style("stroke", "white")
                    //.style("stroke-opacity", "0.75")
                    .style("stroke-width", "1 px")
                    .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
            }
            series = 0;

            var axis = g.selectAll(".axis")
                .data(allAxis)
                .enter()
                .append("g")
                .attr("class", "axis");

            axis.append("line")
                .attr("x1", cfg.w / 2)
                .attr("y1", cfg.h / 2)
                .attr("x2", function (d, i) {
                    return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("y2", function (d, i) {
                    return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
                })
                .attr("class", "line")
                .style("stroke", "white")
                .style("stroke-width", "1px");

            axis.append("text")
                .attr("class", "legend")
                .text(function (d) {
                    return d
                })
                .style("font-family", "sans-serif")
                .style("font-size", "11px")
                .attr("text-anchor", "middle")
                .style("stroke", "white")
                .attr("dy", "0.75 em")
                .attr("transform", function (d, i) {
                    return "translate(0, -10)"
                })
                .attr("x", function (d, i) {
                    return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total);
                })
                .attr("y", function (d, i) {
                    return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total);
                });


            d.forEach(function (y, x) {
                dataValues = [];
                var c = g.selectAll(".nodes")
                    .data(y, function (j, i) {
                        dataValues.push([
                            cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                            cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                        ]);
                    });
                dataValues.push(dataValues[0]);
                g.selectAll(".area")
                    .data([dataValues])
                    .enter()
                    .append("polygon")
                    .attr("class", "radar-chart-serie" + series)
                    .style("stroke-width", "2px")
                    .style("stroke", cfg.color(series))
                    .attr("points", function (d) {
                        var str = "";
                        for (var pti = 0; pti < d.length; pti++) {
                            if (d[pti].length != 0) {
                                str = str + d[pti][0] + "," + d[pti][1] + " ";
                            }
                        }
                        return str;
                    })
                    .style("fill", function (j, i) {
                        return cfg.color(series)
                    })
                    // .transition()
                    //               .duration(2000)
                    .style("fill-opacity", cfg.opacityArea)
                    .on('mouseover', function (d) {
                        z = "polygon." + d3.select(this).attr("class");
                        g.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", 0.1);
                        g.selectAll(z)
                            .transition(200)
                            .style("fill-opacity", .7);
                    })
                    .on('mouseout', function () {
                        g.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", cfg.opacityArea);
                    })
                series++;
            });
            series = 0;


            d.forEach(function (y, x) {
                var c = g.selectAll(".nodes")
                    .data(y).enter()
                    .append("svg:circle")
                    .attr("class", "radar-chart-series" + series)
                    .attr('r', cfg.radius)
                    .attr("alt", function (j) {
                        return Math.max(j.value, 0)
                    })
                    .attr("cx", function (j, i) {
                        dataValues.push([
                            cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                            cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                        ]);
                        return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
                    })
                    .attr("cy", function (j, i) {
                        return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
                    })
                    .attr("data-id", function (j) {
                        return j.axis
                    })
                    .style("fill", cfg.color(series)).style("fill-opacity", .9)
                    .on('mouseover', function (d) {
                        newX = parseFloat(d3.select(this).attr('cx')) - 10;
                        newY = parseFloat(d3.select(this).attr('cy')) - 5;


                        z = "polygon." + d3.select(this).attr("class");
                        g.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", 0.1);
                        g.selectAll(z)
                            .transition(200)
                            .style("fill-opacity", .7);

                    })
                    .on('mouseout', function () {

                        g.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", cfg.opacityArea);
                    });
                c.transition()
                    .delay(1750)
                    .duration(100)
                    .style("fill-opacity", 0.9)

                c.append("svg:title")
                    .text(function (j) {
                        return Math.max(j.value, 0)
                    });

                series++;
            });

        }
    };
    RadarChart.draw("#radar-chart", d, mycfg);
}