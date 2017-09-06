$(document).ready(function() {
        $('.table-results').DataTable({
        "pagingType": "numbers",
        "aoColumnDefs": [
            { "sType": "num-html", "aTargets": [ 0 ] }
          ]
        });
    } );
$("#btnSave").click(function (e) {
    e.preventDefault();
    //show loading gif
    $("#btnSave").toggleClass("waiting");
    if($("#btnSave").html() == "Saved" || $("#btnSave").html() == ":(" ) return;
    $.ajax({
        type: "GET",
        url: '/saveclan/' + $(e.target).attr("data-tag"),
        dataType: "json",
        success: function (data) {
            $("#btnSave").toggleClass("waiting");
            if (data.ok)
                $("#btnSave").html('Saved');
            else $("#btnSave").html(':(');
        },
        error: function (error) {//remove gif
            console.error(error);
            $("#btnSave").toggleClass("waiting");
        }
    });
});
google.charts.load('current', {'packages':['corechart']});
//retrieve clan history
$.ajax({
    type: "GET",
    url: '/clanhistory/' + $("#btnSave").attr("data-tag"),
    dataType: "json",
    success: function (data) {
        if(data) {
            google.charts.setOnLoadCallback(function(){drawChart(data)});
        }
    },
    error: function (err) {//remove gif
        console.log("status: " + err.status, "message: " + err.responseText);
    }
});


google.charts.setOnLoadCallback(drawChart);
function drawChart(historyData) {
    //   var data = google.visualization.arrayToDataTable([
    //     ['Year', 'Sales', /*'Expenses'*/],
    //     ['2004',  1000,     /* 400*/],
    //     ['2005',  1170,     /* 460*/],
    //     ['2006',  660,      /* 1120*/],
    //     ['2007',  1030,     /* 540*/]
    //   ]);
    if (historyData) {
        var data = google.visualization.arrayToDataTable(historyData);
        var options = {
            title: 'Clan Points History',
            //curveType: 'function',
            legend: { position: 'bottom' }
        };
        var chart = new google.visualization.LineChart(document.getElementById('chart'));
        chart.draw(data, options);
    }
}