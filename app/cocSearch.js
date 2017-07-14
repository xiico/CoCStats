var https = require('https');
var mock = require('../modules/mock');

var ctr = [];
var clansToReturn = function (err, clan) {
    if (err)
        throw err;
    ctr[ctr.length] = clan;
};

module.exports = {
    searchClans: function (searchType, tag, options, callBack) {
        var path = '/v1/clans';
        this.search(path,searchType, tag, options, callBack);
    },
    searchPlayers: function (searchType, tag, options, callBack) {
        var path = '/v1/players';
        this.search(path,searchType, tag, options, callBack);
    },
    search: function (path, searchType, tag, options, callBack) {
        switch (searchType) {
            case 'Name':
                if (tag != "")
                    path += '?limit=40&name=' + encodeURIComponent(tag);
                else
                    path += '?limit=40';

                path += options
                break;
            case 'rank':
                if (!tag)
                    path = '/v1/clans?minClanPoints=55000';
                else
                    path = '/v1/locations/' + tag + '/rankings/clans?limit=40';
                break;
            case 'league':
                path = '/v1/leagues/29000022/seasons/' + tag + '?limit=200';
                break;  
            case 'custom':
                break;
            default:
                path += '/' + '%23' + tag.replace('#', '')
                break;
        }
        
        console.log("searchType: " + searchType);
        console.log(path);

        https.get({
            host: 'api.clashofclans.com',
            path: path,//80U9PL8P 
            headers: { 'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImY3MjkzYmJhLTkyMDUtNDE1NS05MTU2LTA5MTZmMzE5ODY2NCIsImlhdCI6MTQ5OTk1MTcwMSwic3ViIjoiZGV2ZWxvcGVyLzhhZmQ5ZjJhLWQzNmEtYzdkMS1jZjgxLTRmZGExN2Q1ZWZlZCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjEzOC4xOTcuMTAzLjE2MSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.sJubnJ4kwv5wLfO6CWL3v7433MI8cgoQzjif2hx80m_tusVmCylMZUJfE6LmccCUu2iRpbLZB7bmf1Q4I7JQpg' }
        }, function (res) {
            // explicitly treat incoming data as utf8 (avoids issues with multi-byte chars)
            //res.setEncoding('utf8');

            // incrementally capture the incoming response body
            var body = '';
            res.on('data', function (d) {
                body += d;
            });

            // do whatever we want with the response once it's done
            res.on('end', function () {
                try {
                    var isets = 0;
                    var searched = JSON.parse(body);
                    console.log("body size: " + body.length);

                    if(searched.message) console.log(searched.message);
                    var local = !!searched.message;
                    if (local) {
                        //callBack(null,{});
                        //return;
                        searched = mock.clans;
                    } else {
                        //console.log(body);
                    }
                    
                    if(local && searchType == "Tag") searched = mock.clan;                

                    if(local && path.indexOf("player") > 0) searched = mock.player;

                    if(local && searchType == "custom") {
                       if( path.indexOf("season") > 0) searched = mock.legendSeasons;
                       else searched = mock.legendLeague;
                    }

                    if(local && searchType == 'league'){
                        searched = mock.players;
                    }

                    if (!searched.location)
                        searched.location = { id: 32000006, name: 'International', isCountry: false };

                    if (!searched.location.countryCode)
                        searched.location.countryCode = "UN";

                } catch (err) {
                    console.error('Unable to parse response as JSON', err);
                    return callBack(err);
                }

                callBack(null, searched);
            });
        }).on('error', function (err) {
            // handle errors with the request itself
            console.error('Error with the request:', err.message);
            cb(err);
        });
    }

}