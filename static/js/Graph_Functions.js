var year = "2018";
var state = "California";
var crime = "Total-Larceny";

$(function () {
    console.log(" Dashboard LOADING.... ");
    draw_geo_map();
    draw_pcp();
    draw_bar_chart();
    draw_line_chart();
    draw_radar_chart();
    draw_pie_chart();
});

function global_dashboard(graph, item, value) {

    if (item === "year") {
        year = value;
    }

    if (item === "crime") {
        crime = "Total-" + value;
        if (value === "Motor") {
            crime = "Totals-" + value;
        }
    }

    if (item === "state") {
        state = value;
    }

    if (graph === "line") {
        get_geo_map_data(year, crime);
        get_pcp_data(state);
        get_bar_chart_data(state, crime);
        get_line_chart_data(state, crime);
        get_radar_chart_data(state, crime);
        get_pie_chart_data(state);
    }

    if (graph === "map") {
        get_pcp_data(state);
        get_bar_chart_data(state, crime);
        get_line_chart_data(state, crime);
        get_radar_chart_data(state, crime);
        get_pie_chart_data(state);
    }

    if (graph === "pie") {
        get_geo_map_data(year, crime);
        get_pcp_data(state);
        get_bar_chart_data(state, crime);
        get_line_chart_data(state, crime);
        get_radar_chart_data(state, crime);
    }

    if (graph === "bar") {
        get_geo_map_data(year, crime);
        get_pcp_data(state);
        get_line_chart_data(state, crime);
        get_radar_chart_data(state, crime);
        get_pie_chart_data(state);
    }

}

function draw_geo_map() {
    var year = "2018";
    var crime = "Total-All";
    $.ajax({
        url: "load_us_map",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "Year": year,
            "Crime": crime
        })
    }).done(function (data) {
        USMap(data);
    });

}

// Brushing and Linking Choropleth Map
function get_geo_map_data(year, crime) {
    console.log("Year Passed: " + year);
    $.ajax({
        url: "load_us_map",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "Year": year,
            "Crime": crime
        })
    }).done(function (data) {
        USMap(data);
    });
}

function draw_pcp() {
    var State = "California";
    $.ajax({
        url: "parallel_coordinates_plot",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "State": State
        })
    }).done(function (data) {
        //  console.log(data);
        Parallel_Coordinates_Plot(data);
    });
}

// Brushing and Linking Parallel Co-ordinates Plot
function get_pcp_data(State) {
    $.ajax({
        url: "parallel_coordinates_plot",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "State": State
        })
    }).done(function (data) {
        Parallel_Coordinates_Plot(data);
    });
}


function draw_bar_chart() {
    //state
    //crime
    var State = "California";
    var crime = "Total-Murder";

    $.ajax({
        url: "bar_chart",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "State": State,
            "Crime": crime
        })
    }).done(function (data) {
        Bar_Chart(data, "Total-Murder");
    });
}

// Brushing and Linking Bar Chart
function get_bar_chart_data(State, crime) {
    $.ajax({
        url: "bar_chart",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "State": State,
            "Crime": crime
        })
    }).done(function (data) {
        Bar_Chart(data, crime);
    });
}

function draw_line_chart() {
    var State = "California";
    var crime = "Total-Murder";

    $.ajax({
        url: "line_chart",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            // "Population": Population,
            // "Year": Year
            "State": State,
            "Crime": crime
        })
    }).done(function (data) {
        Line_Chart(data);
    });

}

// Brushing and Linking Line Chart
function get_line_chart_data(State, crime) {
    $.ajax({
        url: "line_chart",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            // "Population": Population,
            // "Year": Year
            "State": State,
            "Crime": crime
        })
    }).done(function (data) {
        Line_Chart(data);
    });

}

function draw_radar_chart() {
    var State = "California";
    var Crime = "Total-Murder";
    $.ajax({
        url: "radar_chart",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "State": State,
            "Crime": Crime
        })
    }).done(function (data) {
        var d = [data['rape'], data['motor'], data['murder'], data['larceny']]
        Radar_Chart(d);
    });
}

// Brushing and Linking Line Chart
function get_radar_chart_data(State, Crime) {
    $.ajax({
        url: "radar_chart",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "State": State,
            "Crime": Crime
        })
    }).done(function (data) {
        var d = [data['rape'], data['motor'], data['murder'], data['larceny']]
        Radar_Chart(d);
    });
}

// Brushing and Linking Radar Chart
function draw_pie_chart() {
    var State = "California";
    $.ajax({
        url: "pie_chart",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "State": State
        })
    }).done(function (data) {
        Pie_Chart(data);
    });
}

// Brushing and Linking Pie Chart
function get_pie_chart_data(state) {
    $.ajax({
        url: "pie_chart",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "State": state
        })
    }).done(function (data) {
        Pie_Chart(data);
    });
}
