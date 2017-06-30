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

                    if(searched.message) console.log(searched.message);


                    var local = !!searched.message;

                    if(local) searched = srcd;

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

                    var player = {
                    "tag": "#JU280CR",
                    "name": "Edu",
                    "townHallLevel": 11,
                    "expLevel": 166,
                    "trophies": 5000,
                    "bestTrophies": 5878,
                    "warStars": 338,
                    "attackWins": 0,
                    "defenseWins": 0,
                    "builderHallLevel": 5,
                    "versusTrophies": 3086,
                    "bestVersusTrophies": 3243,
                    "versusBattleWins": 277,
                    "role": "coLeader",
                    "donations": 0,
                    "donationsReceived": 0,
                    "clan": {
                        "tag": "#YQLLJYY9",
                        "name": "A UNIVERSAL",
                        "clanLevel": 10,
                        "badgeUrls": {
                        "small": "https://api-assets.clashofclans.com/badges/70/TymPuiEl96Jte1Sbm0mMYtDz-LPKHtBI-0iuYaRrrZM.png",
                        "large": "https://api-assets.clashofclans.com/badges/512/TymPuiEl96Jte1Sbm0mMYtDz-LPKHtBI-0iuYaRrrZM.png",
                        "medium": "https://api-assets.clashofclans.com/badges/200/TymPuiEl96Jte1Sbm0mMYtDz-LPKHtBI-0iuYaRrrZM.png"
                        }
                    },
                    "league": {
                        "id": 29000021,
                        "name": "Titan League I",
                        "iconUrls": {
                        "small": "https://api-assets.clashofclans.com/leagues/72/qVCZmeYH0lS7Gaa6YoB7LrNly7bfw7fV_d4Vp2CU-gk.png",
                        "tiny": "https://api-assets.clashofclans.com/leagues/36/qVCZmeYH0lS7Gaa6YoB7LrNly7bfw7fV_d4Vp2CU-gk.png",
                        "medium": "https://api-assets.clashofclans.com/leagues/288/qVCZmeYH0lS7Gaa6YoB7LrNly7bfw7fV_d4Vp2CU-gk.png"
                        }
                    },
                    "legendStatistics": {
                        "legendTrophies": 3882,
                        "previousSeason": {
                        "id": "2017-06",
                        "rank": 3852,
                        "trophies": 5710
                        },
                        "bestSeason": {
                        "id": "2017-06",
                        "rank": 3852,
                        "trophies": 5710
                        },
                        "currentSeason": {
                        "rank": 10,
                        "trophies": 5000
                        }
                    },
                    "achievements": [
                        {
                        "name": "Bigger Coffers",
                        "stars": 3,
                        "value": 12,
                        "target": 10,
                        "info": "Upgrade a Gold Storage to level 10",
                        "completionInfo": "Highest Gold Storage level: 12",
                        "village": "home"
                        },
                        {
                        "name": "Get those Goblins!",
                        "stars": 2,
                        "value": 131,
                        "target": 150,
                        "info": "Win 150 stars on the Campaign Map",
                        "completionInfo": "Stars in Campaign Map: 131",
                        "village": "home"
                        },
                        {
                        "name": "Bigger & Better",
                        "stars": 3,
                        "value": 11,
                        "target": 8,
                        "info": "Upgrade Town Hall to level 8",
                        "completionInfo": "Current Town Hall level: 11",
                        "village": "home"
                        },
                        {
                        "name": "Nice and Tidy",
                        "stars": 3,
                        "value": 2436,
                        "target": 500,
                        "info": "Remove 500 obstacles (trees, rocks, bushes)",
                        "completionInfo": "Total obstacles removed: 2436",
                        "village": "home"
                        },
                        {
                        "name": "Release the Beasts",
                        "stars": 3,
                        "value": 1,
                        "target": 1,
                        "info": "Unlock Dragon in the Barracks",
                        "village": "home"
                        },
                        {
                        "name": "Gold Grab",
                        "stars": 3,
                        "value": 1084871817,
                        "target": 100000000,
                        "info": "Steal 100000000 gold",
                        "completionInfo": "Total Gold looted: 1084871817",
                        "village": "home"
                        },
                        {
                        "name": "Elixir Escapade",
                        "stars": 3,
                        "value": 1170437399,
                        "target": 100000000,
                        "info": "Steal 100000000 elixir",
                        "completionInfo": "Total Elixir looted: 1170437399",
                        "village": "home"
                        },
                        {
                        "name": "Sweet Victory!",
                        "stars": 3,
                        "value": 5878,
                        "target": 1250,
                        "info": "Achieve a total of 1250 trophies in Multiplayer battles",
                        "completionInfo": "Trophy record: 5878",
                        "village": "home"
                        },
                        {
                        "name": "Empire Builder",
                        "stars": 3,
                        "value": 7,
                        "target": 4,
                        "info": "Upgrade Clan Castle to level 4",
                        "completionInfo": "Current Clan Castle level: 7",
                        "village": "home"
                        },
                        {
                        "name": "Wall Buster",
                        "stars": 3,
                        "value": 77531,
                        "target": 2000,
                        "info": "Destroy 2000 Walls in Multiplayer battles",
                        "completionInfo": "Total walls destroyed: 77531",
                        "village": "home"
                        },
                        {
                        "name": "Humiliator",
                        "stars": 3,
                        "value": 5337,
                        "target": 2000,
                        "info": "Destroy 2000 Town Halls in Multiplayer battles",
                        "completionInfo": "Total Town Halls destroyed: 5337",
                        "village": "home"
                        },
                        {
                        "name": "Union Buster",
                        "stars": 3,
                        "value": 20076,
                        "target": 2500,
                        "info": "Destroy 2500 Builder's Huts in Multiplayer battles",
                        "completionInfo": "Total Builder's Huts destroyed: 20076",
                        "village": "home"
                        },
                        {
                        "name": "Conqueror",
                        "stars": 3,
                        "value": 6914,
                        "target": 5000,
                        "info": "Win 5000 Multiplayer battles",
                        "completionInfo": "Total multiplayer battles won: 6914",
                        "village": "home"
                        },
                        {
                        "name": "Unbreakable",
                        "stars": 2,
                        "value": 1860,
                        "target": 5000,
                        "info": "Successfully defend against 5000 attacks",
                        "completionInfo": "Total defenses won: 1860",
                        "village": "home"
                        },
                        {
                        "name": "Friend in Need",
                        "stars": 3,
                        "value": 182898,
                        "target": 25000,
                        "info": "Donate 25000 Clan Castle capacity worth of reinforcements",
                        "completionInfo": "Total capacity donated: 182898",
                        "village": "home"
                        },
                        {
                        "name": "Mortar Mauler",
                        "stars": 3,
                        "value": 18764,
                        "target": 5000,
                        "info": "Destroy 5000 Mortars in Multiplayer battles",
                        "completionInfo": "Total Mortars destroyed: 18764",
                        "village": "home"
                        },
                        {
                        "name": "Heroic Heist",
                        "stars": 3,
                        "value": 8512201,
                        "target": 1000000,
                        "info": "Steal 1000000 Dark Elixir",
                        "completionInfo": "Total Dark Elixir looted: 8512201",
                        "village": "home"
                        },
                        {
                        "name": "League All-Star",
                        "stars": 3,
                        "value": 22,
                        "target": 1,
                        "info": "Become a Champion!",
                        "village": "home"
                        },
                        {
                        "name": "X-Bow Exterminator",
                        "stars": 3,
                        "value": 8857,
                        "target": 2500,
                        "info": "Destroy 2500 X-Bows in Multiplayer battles",
                        "completionInfo": "Total X-Bows destroyed: 8857",
                        "village": "home"
                        },
                        {
                        "name": "Firefighter",
                        "stars": 2,
                        "value": 3512,
                        "target": 5000,
                        "info": "Destroy 5000 Inferno Towers in Multiplayer battles",
                        "completionInfo": "Total Inferno Towers destroyed: 3512",
                        "village": "home"
                        },
                        {
                        "name": "War Hero",
                        "stars": 2,
                        "value": 338,
                        "target": 1000,
                        "info": "Score 1000 stars for your clan in Clan War battles",
                        "completionInfo": "Total stars scored for clan in Clan War battles: 338",
                        "village": "home"
                        },
                        {
                        "name": "Treasurer",
                        "stars": 3,
                        "value": 217430414,
                        "target": 100000000,
                        "info": "Collect 100000000 gold from the Treasury",
                        "completionInfo": "Total gold collected in Clan War bonuses: 217430414",
                        "village": "home"
                        },
                        {
                        "name": "Anti-Artillery",
                        "stars": 2,
                        "value": 1076,
                        "target": 2000,
                        "info": "Destroy 2000 Eagle Artilleries in Multiplayer battles",
                        "completionInfo": "Total Eagle Artilleries destroyed: 1076",
                        "village": "home"
                        },
                        {
                        "name": "Sharing is caring",
                        "stars": 1,
                        "value": 1939,
                        "target": 2000,
                        "info": "Donate 2000 spell storage capacity worth of spells",
                        "completionInfo": "Total spell capacity donated: 1939",
                        "village": "home"
                        },
                        {
                        "name": "Keep your village safe",
                        "stars": 1,
                        "value": 1,
                        "target": 1,
                        "info": "Connect your account to a social network for safe keeping.",
                        "completionInfo": "Completed!",
                        "village": "home"
                        },
                        {
                        "name": "Master Engineering",
                        "stars": 2,
                        "value": 5,
                        "target": 8,
                        "info": "Upgrade Builder Hall to level 8",
                        "completionInfo": "Current Builder Hall level: 5",
                        "village": "builderBase"
                        },
                        {
                        "name": "Next Generation Model",
                        "stars": 2,
                        "value": 1,
                        "target": 1,
                        "info": "Unlock Cannon Cart in the Builder Barracks",
                        "village": "builderBase"
                        },
                        {
                        "name": "Un-Build It",
                        "stars": 2,
                        "value": 391,
                        "target": 2000,
                        "info": "Destroy 2000 Builder Halls in Versus battles",
                        "completionInfo": "Total Builder Halls destroyed: 391",
                        "village": "builderBase"
                        },
                        {
                        "name": "Champion Builder",
                        "stars": 3,
                        "value": 3243,
                        "target": 3000,
                        "info": "Achieve a total of 3000 trophies in Versus battles",
                        "completionInfo": "Versus Trophy record: 3243",
                        "village": "builderBase"
                        },
                        {
                        "name": "High Gear",
                        "stars": 1,
                        "value": 1,
                        "target": 2,
                        "info": "Gear Up 2 buildings using the Master Builder",
                        "completionInfo": "Total buildings geared up: 1",
                        "village": "builderBase"
                        },
                        {
                        "name": "Hidden Treasures",
                        "stars": 3,
                        "value": 1,
                        "target": 1,
                        "info": "Rebuild Battle Machine",
                        "village": "builderBase"
                        }
                    ],
                    "versusBattleWinCount": 277,
                    "troops": [
                        {
                        "name": "Barbarian",
                        "level": 6,
                        "maxLevel": 7,
                        "village": "home"
                        },
                        {
                        "name": "Archer",
                        "level": 7,
                        "maxLevel": 7,
                        "village": "home"
                        },
                        {
                        "name": "Goblin",
                        "level": 4,
                        "maxLevel": 7,
                        "village": "home"
                        },
                        {
                        "name": "Giant",
                        "level": 8,
                        "maxLevel": 8,
                        "village": "home"
                        },
                        {
                        "name": "Wall Breaker",
                        "level": 6,
                        "maxLevel": 6,
                        "village": "home"
                        },
                        {
                        "name": "Balloon",
                        "level": 7,
                        "maxLevel": 7,
                        "village": "home"
                        },
                        {
                        "name": "Wizard",
                        "level": 7,
                        "maxLevel": 7,
                        "village": "home"
                        },
                        {
                        "name": "Healer",
                        "level": 4,
                        "maxLevel": 4,
                        "village": "home"
                        },
                        {
                        "name": "Dragon",
                        "level": 6,
                        "maxLevel": 6,
                        "village": "home"
                        },
                        {
                        "name": "P.E.K.K.A",
                        "level": 5,
                        "maxLevel": 5,
                        "village": "home"
                        },
                        {
                        "name": "Minion",
                        "level": 7,
                        "maxLevel": 7,
                        "village": "home"
                        },
                        {
                        "name": "Hog Rider",
                        "level": 5,
                        "maxLevel": 7,
                        "village": "home"
                        },
                        {
                        "name": "Valkyrie",
                        "level": 5,
                        "maxLevel": 5,
                        "village": "home"
                        },
                        {
                        "name": "Golem",
                        "level": 6,
                        "maxLevel": 6,
                        "village": "home"
                        },
                        {
                        "name": "Witch",
                        "level": 3,
                        "maxLevel": 3,
                        "village": "home"
                        },
                        {
                        "name": "Lava Hound",
                        "level": 4,
                        "maxLevel": 4,
                        "village": "home"
                        },
                        {
                        "name": "Bowler",
                        "level": 3,
                        "maxLevel": 3,
                        "village": "home"
                        },
                        {
                        "name": "Baby Dragon",
                        "level": 1,
                        "maxLevel": 5,
                        "village": "home"
                        },
                        {
                        "name": "Miner",
                        "level": 4,
                        "maxLevel": 4,
                        "village": "home"
                        },
                        {
                        "name": "Raged Barbarian",
                        "level": 2,
                        "maxLevel": 16,
                        "village": "builderBase"
                        },
                        {
                        "name": "Sneaky Archer",
                        "level": 6,
                        "maxLevel": 16,
                        "village": "builderBase"
                        },
                        {
                        "name": "Beta Minion",
                        "level": 1,
                        "maxLevel": 16,
                        "village": "builderBase"
                        },
                        {
                        "name": "Boxer Giant",
                        "level": 10,
                        "maxLevel": 16,
                        "village": "builderBase"
                        },
                        {
                        "name": "Bomber",
                        "level": 1,
                        "maxLevel": 16,
                        "village": "builderBase"
                        },
                        {
                        "name": "Super P.E.K.K.A",
                        "level": 1,
                        "maxLevel": 16,
                        "village": "builderBase"
                        },
                        {
                        "name": "Cannon Cart",
                        "level": 10,
                        "maxLevel": 16,
                        "village": "builderBase"
                        },
                        {
                        "name": "Drop Ship",
                        "level": 1,
                        "maxLevel": 16,
                        "village": "builderBase"
                        },
                        {
                        "name": "Baby Dragon",
                        "level": 6,
                        "maxLevel": 16,
                        "village": "builderBase"
                        },
                        {
                        "name": "Night Witch",
                        "level": 1,
                        "maxLevel": 16,
                        "village": "builderBase"
                        }
                    ],
                    "heroes": [
                        {
                        "name": "Barbarian King",
                        "level": 45,
                        "maxLevel": 45,
                        "village": "home"
                        },
                        {
                        "name": "Archer Queen",
                        "level": 45,
                        "maxLevel": 45,
                        "village": "home"
                        },
                        {
                        "name": "Grand Warden",
                        "level": 20,
                        "maxLevel": 20,
                        "village": "home"
                        },
                        {
                        "name": "Battle Machine",
                        "level": 5,
                        "maxLevel": 30,
                        "village": "builderBase"
                        }
                    ],
                    "spells": [
                        {
                        "name": "Lightning Spell",
                        "level": 5,
                        "maxLevel": 7,
                        "village": "home"
                        },
                        {
                        "name": "Healing Spell",
                        "level": 6,
                        "maxLevel": 7,
                        "village": "home"
                        },
                        {
                        "name": "Rage Spell",
                        "level": 5,
                        "maxLevel": 5,
                        "village": "home"
                        },
                        {
                        "name": "Jump Spell",
                        "level": 2,
                        "maxLevel": 3,
                        "village": "home"
                        },
                        {
                        "name": "Freeze Spell",
                        "level": 5,
                        "maxLevel": 6,
                        "village": "home"
                        },
                        {
                        "name": "Poison Spell",
                        "level": 1,
                        "maxLevel": 5,
                        "village": "home"
                        },
                        {
                        "name": "Earthquake Spell",
                        "level": 4,
                        "maxLevel": 4,
                        "village": "home"
                        },
                        {
                        "name": "Haste Spell",
                        "level": 4,
                        "maxLevel": 4,
                        "village": "home"
                        },
                        {
                        "name": "Clone Spell",
                        "level": 4,
                        "maxLevel": 5,
                        "village": "home"
                        }
                    ]
                    };
                
                    var clan = {
                        "tag": "#8J9222L0",
                        "name": "gilgamesh",
                        "type": "open",
                        "description": "",
                        "badgeUrls": {
                            "small": "https://api-assets.clashofclans.com/badges/70/7GdWJFadwCtnTeCpqYeN0f7Ocz7_Hwe08uOxDMQd3UA.png",
                            "large": "https://api-assets.clashofclans.com/badges/512/7GdWJFadwCtnTeCpqYeN0f7Ocz7_Hwe08uOxDMQd3UA.png",
                            "medium": "https://api-assets.clashofclans.com/badges/200/7GdWJFadwCtnTeCpqYeN0f7Ocz7_Hwe08uOxDMQd3UA.png"
                        },
                        "clanLevel": 1,
                        "clanPoints": 1096,
                        "clanVersusPoints": 0,
                        "requiredTrophies": 0,
                        "warFrequency": "unknown",
                        "warWinStreak": 0,
                        "warWins": 0,
                        "warTies": 0,
                        "warLosses": 0,
                        "isWarLogPublic": true,
                        "members": 3,
                        "memberList": [
                            {
                            "tag": "#R008LCV9",
                            "name": "rico suave 2",
                            "role": "leader",
                            "expLevel": 23,
                            "league": {
                                "id": 29000000,
                                "name": "Unranked",
                                "iconUrls": {
                                "small": "https://api-assets.clashofclans.com/leagues/72/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png",
                                "tiny": "https://api-assets.clashofclans.com/leagues/36/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png"
                                }
                            },
                            "trophies": 831,
                            "versusTrophies": 0,
                            "clanRank": 1,
                            "previousClanRank": 1,
                            "donations": 0,
                            "donationsReceived": 0
                            },
                            {
                            "tag": "#LUYCY2UG",
                            "name": "hamad",
                            "role": "member",
                            "expLevel": 18,
                            "league": {
                                "id": 29000000,
                                "name": "Unranked",
                                "iconUrls": {
                                "small": "https://api-assets.clashofclans.com/leagues/72/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png",
                                "tiny": "https://api-assets.clashofclans.com/leagues/36/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png"
                                }
                            },
                            "trophies": 735,
                            "versusTrophies": 0,
                            "clanRank": 2,
                            "previousClanRank": 2,
                            "donations": 0,
                            "donationsReceived": 0
                            },
                            {
                            "tag": "#QPYY2YLJ",
                            "name": "Gabe Fiedler",
                            "role": "admin",
                            "expLevel": 16,
                            "league": {
                                "id": 29000000,
                                "name": "Unranked",
                                "iconUrls": {
                                "small": "https://api-assets.clashofclans.com/leagues/72/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png",
                                "tiny": "https://api-assets.clashofclans.com/leagues/36/e--YMyIexEQQhE4imLoJcwhYn6Uy8KqlgyY3_kFV6t4.png"
                                }
                            },
                            "trophies": 628,
                            "versusTrophies": 0,
                            "clanRank": 3,
                            "previousClanRank": 3,
                            "donations": 0,
                            "donationsReceived": 0
                            }
                        ]
                        };
                    
                    if(local && searchType == "Tag") searched = clan;
                

                    if(local && path.indexOf("player") > 0) searched = player;

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