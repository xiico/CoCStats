$(document).ready(function() {
        $('.table-results').DataTable({"pagingType": "numbers", stateSave: true});
    } );
google.charts.load('current', {'packages':['corechart']});
//retrieve clan history
var ajaxRequest = {
    type: "GET",
    url: '/rankchart' + ($("#chart").attr("data-location") ? "/" + $("#chart").attr("data-location") : "/null"),
    dataType: "json",
    success: function (data) {
        if(data) {
            google.charts.setOnLoadCallback(function(){drawChart(data)});
        }
    },
    error: function (error) {//remove gif
        console.log(error);
    }
};
$.ajax(ajaxRequest);

function drawChart(historyData) {
//   var data = google.visualization.arrayToDataTable([
//     ['Year', 'Sales', /*'Expenses'*/],
//     ['2004',  1000,     /* 400*/],
//     ['2005',  1170,     /* 460*/],
//     ['2006',  660,      /* 1120*/],
//     ['2007',  1030,     /* 540*/]
//   ]);
  var data = google.visualization.arrayToDataTable(historyData);
  var options = {
    title: 'Clan Points History',
    //curveType: 'function',
    legend: { position: 'bottom' },
    chartArea: {'width': '85%', 'height': '75%'},
    tooltip: { trigger: 'selection' }
  };
  var chart = new google.visualization.LineChart(document.getElementById('chart'));

  chart.setAction({
      id: 'rank',
      text: 'clan details',
      action: function (e) {
          selection = chart.getSelection();
          window.location.href = historyData[0][selection[0].column].link;
      }
  });

  chart.draw(data, options);
}