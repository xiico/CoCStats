var https = require('https');

var ctr = [];
var clansToReturn = function (err, clan) {
    if (err)
        throw err;
    ctr[ctr.length] = clan;
};

module.exports = {
    searchClans: function (searchType, tag, options, callBack) {
        var path = '/v1/clans';
        switch (searchType) {
            case 'Name':
                if (tag != "")
                    path += '?limit=40&name=' + encodeURIComponent(tag);
                else
                    path += '?limit=40';

                path += options
                break;
            case 'Rank':
                path = '/v1/locations/' + tag + '/rankings/clans?limit=40';
                break;
            default:
                path += '/' + '%23' + tag.replace('#', '')
                break;
        }

        console.log(path);

        https.get({
            host: 'api.clashofclans.com',
            path: path,//80U9PL8P 
            headers: { 'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImY5NDBlOTYxLWQ2MTMtNGI3Ni05MDBhLTlhNTI2NGNlYzZhNyIsImlhdCI6MTQ2NjQ2NTM4Miwic3ViIjoiZGV2ZWxvcGVyLzhhZmQ5ZjJhLWQzNmEtYzdkMS1jZjgxLTRmZGExN2Q1ZWZlZCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjQ1LjU1LjIyMS4yMjUiXSwidHlwZSI6ImNsaWVudCJ9XX0.4SWOJT3Qac_XTB2Y2ay9dgQ7f8L6j5C59nzwXGQPqyJ1Mkxs4V2xzVqXPacp10ywvDmrOid9tb_2q-bsW_czLA' }
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
                    var srcd = {
                        "items": [
                            {
                                "tag": "#8J9222L0",
                                "name": "gilgamesh",
                                "type": "open",
                                "badgeUrls": {
                                    "small": "https://api-assets.clashofclans.com/badges/70/7GdWJFadwCtnTeCpqYeN0f7Ocz7_Hwe08uOxDMQd3UA.png",
                                    "large": "https://api-assets.clashofclans.com/badges/512/7GdWJFadwCtnTeCpqYeN0f7Ocz7_Hwe08uOxDMQd3UA.png",
                                    "medium": "https://api-assets.clashofclans.com/badges/200/7GdWJFadwCtnTeCpqYeN0f7Ocz7_Hwe08uOxDMQd3UA.png"
                                },
                                "clanLevel": 1,
                                "clanPoints": 99999,
                                "requiredTrophies": 0,
                                "warFrequency": "unknown",
                                "warWinStreak": 0,
                                "warWins": 0,
                                "warTies": 0,
                                "warLosses": 0,
                                "isWarLogPublic": false,
                                "members": 3
                            },
                            {
                                "tag": "#8J9222L0",
                                "name": "gilgamesh",
                                "type": "open",
                                "badgeUrls": {
                                    "small": "https://api-assets.clashofclans.com/badges/70/7GdWJFadwCtnTeCpqYeN0f7Ocz7_Hwe08uOxDMQd3UA.png",
                                    "large": "https://api-assets.clashofclans.com/badges/512/7GdWJFadwCtnTeCpqYeN0f7Ocz7_Hwe08uOxDMQd3UA.png",
                                    "medium": "https://api-assets.clashofclans.com/badges/200/7GdWJFadwCtnTeCpqYeN0f7Ocz7_Hwe08uOxDMQd3UA.png"
                                },
                                "clanLevel": 12,
                                "clanPoints": 92453,
                                "requiredTrophies": 0,
                                "warFrequency": "unknown",
                                "warWinStreak": 0,
                                "warWins": 0,
                                "warTies": 0,
                                "warLosses": 0,
                                "isWarLogPublic": true,
                                "members": 3
                            },
                            {
                                "tag": "#8J9222L0",
                                "name": "gilgamesh",
                                "type": "open",
                                "badgeUrls": {
                                    "small": "https://api-assets.clashofclans.com/badges/70/7GdWJFadwCtnTeCpqYeN0f7Ocz7_Hwe08uOxDMQd3UA.png",
                                    "large": "https://api-assets.clashofclans.com/badges/512/7GdWJFadwCtnTeCpqYeN0f7Ocz7_Hwe08uOxDMQd3UA.png",
                                    "medium": "https://api-assets.clashofclans.com/badges/200/7GdWJFadwCtnTeCpqYeN0f7Ocz7_Hwe08uOxDMQd3UA.png"
                                },
                                "clanLevel": 5,
                                "clanPoints": 92453,
                                "requiredTrophies": 0,
                                "warFrequency": "unknown",
                                "warWinStreak": 0,
                                "warWins": 0,
                                "warTies": 0,
                                "warLosses": 0,
                                "isWarLogPublic": true,
                                "members": 3
                            }
                        ],
                        "paging": {
                            "cursors": {}
                        }
                    };

                    var rank = {
                        "items": [
                            {
                                "tag": "#9QCJGJPY",
                                "name": "FACÇÃO CENTRAL",
                                "location": {
                                    "id": 32000038,
                                    "name": "Brazil",
                                    "isCountry": true,
                                    "countryCode": "BR"
                                },
                                "badgeUrls": {
                                    "small": "https://api-assets.clashofclans.com/badges/70/bnpxhie2DxVcO9MvHejM9z4Gq8EkTYKPUZ-7P1Fe7Ws.png",
                                    "large": "https://api-assets.clashofclans.com/badges/512/bnpxhie2DxVcO9MvHejM9z4Gq8EkTYKPUZ-7P1Fe7Ws.png",
                                    "medium": "https://api-assets.clashofclans.com/badges/200/bnpxhie2DxVcO9MvHejM9z4Gq8EkTYKPUZ-7P1Fe7Ws.png"
                                },
                                "clanLevel": 9,
                                "members": 49,
                                "clanPoints": 49850,
                                "rank": 1,
                                "previousRank": 6
                            },
                            {
                                "tag": "#8PCL0Y9J",
                                "name": "BRASIL TEAM",
                                "location": {
                                    "id": 32000038,
                                    "name": "Brazil",
                                    "isCountry": true,
                                    "countryCode": "BR"
                                },
                                "badgeUrls": {
                                    "small": "https://api-assets.clashofclans.com/badges/70/l7PnLiAsZG8WNPKBiGdSmzmzQGHMj8hsd2_AUoQ3vtc.png",
                                    "large": "https://api-assets.clashofclans.com/badges/512/l7PnLiAsZG8WNPKBiGdSmzmzQGHMj8hsd2_AUoQ3vtc.png",
                                    "medium": "https://api-assets.clashofclans.com/badges/200/l7PnLiAsZG8WNPKBiGdSmzmzQGHMj8hsd2_AUoQ3vtc.png"
                                },
                                "clanLevel": 8,
                                "members": 46,
                                "clanPoints": 49596,
                                "rank": 2,
                                "previousRank": 2
                            }
                        ],
                        "paging": {
                            "cursors": {
                                "after": "eyJwb3MiOjJ9"
                            }
                        }
                    };

                    if (!searched.location)
                        searched.location = { id: 32000006, name: 'International', isCountry: false };

                    if (!searched.location.countryCode)
                        searched.location.countryCode = "UN";

                } catch (err) {
                    console.error('Unable to parse response as JSON', err);
                    return cb(err);
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