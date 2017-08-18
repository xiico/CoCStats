google.charts.load('current', {'packages':['corechart']});
//retrieve clan history
function requestChartData(chart){
    if (chart.children().length) return;
    var ajaxRequest = {
        type: "GET",
        url: '/playerhistory/' + chart.attr("data-tag") + '/' + chart.attr("data-type") ,
        dataType: "json",
        success: function (data) {
            if(data && data.length > 1) {
                google.charts.setOnLoadCallback(function(){drawChart(data, chart.attr("id"), chart.attr("data-type-name"))});
            }
        },
        error: function (error) {//remove gif
            console.log("status: " + error.status, "message: " + error.responseText);
        }
    };
    $.ajax(ajaxRequest);
}

function requestClans(div){
    if (div.children().length) return;
    var ajaxRequest = {
        type: "GET",
        url: '/playerclans/' + div.attr("data-tag") ,
        dataType: "json",
        success: function (data) {
            
            for(var i = 0, clan; clan = data[i]; i++) {
                div.append('<a class="clan-link" href="/clans/'+clan._id.clanTag.replace('#','')+'" alt="'+clan._id.clanTag+'"><span class="clan-name">'+clan._id.clanName+'</span></a>&nbsp;('+ clan.date +')<br>');
            }
        },
        error: function (error) {//remove gif
            console.log("status: " + error.status, "message: " + error.responseText);
        }
    };
    $.ajax(ajaxRequest);
}

function drawChart(historyData, chart, type) {
//   var data = google.visualization.arrayToDataTable([
//     ['Year', 'Sales', /*'Expenses'*/],
//     ['2004',  1000,     /* 400*/],
//     ['2005',  1170,     /* 460*/],
//     ['2006',  660,      /* 1120*/],
//     ['2007',  1030,     /* 540*/]
//   ]);
  var data = google.visualization.arrayToDataTable(historyData);
  var options = {
    title: 'Player ' + type + ' History',
    //curveType: 'function',
    legend: { position: 'bottom' },
    chartArea: {'width': '85%', 'height': '75%'},
  };
  var chart = new google.visualization.LineChart(document.getElementById(chart));
  chart.draw(data, options);
}

requestChartData($("#chartTrophies"));