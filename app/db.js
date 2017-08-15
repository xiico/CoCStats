// load up the clan model
var Clan = require('../app/models/clan');
// load up the User model
var User = require('../app/models/user');
// Search using the CoC api
var cocSearch = require('../app/cocSearch');
// load up the Player model
var Player = require('../app/models/player');
//load up the clanHistory
var clanHistory = require('../app/models/clanHistory');
//load up the playerHistory
var playerHistory = require('../app/models/playerHistory');
// load up the Rank model
var Rank = require('../app/models/rank');


function saveClan(searched, callBack, callBackSearch) {
    Clan.findOneAndUpdate({ tag: searched.tag }, searched, { upsert: true, new: true, setDefaultsOnInsert: true }, function (err, clan) {
        if (err)
            throw err;
        if (callBack) {
            Clan.find({ tag: callBackSearch }, function (err, clans) {
                if (err)
                    throw err;
                callBack(clans);
            });
        }
    });
}

function getFirstMonday(date) {
    date.setDate(1);

    // Get the first Monday in the month
    while (date.getDay() !== 1) {
        date.setDate(date.getDate() + 1);
    }
    return date;
}

function getClanHistoryStartDate(){
    var date = new Date();
    if(getFirstMonday(date).getDate() >= date.getDate) 
        return getFirstMonday(date);
    else {
        date.setMonth(date.getMonth() - 1);
        return getFirstMonday(date);
    }        
}

module.exports =
    {
        updateClans: function (clansToFind, callBack) {
            this.searchUserClans(clansToFind, function (err, clansFound) {
                if (err)
                    throw err;
                var updated = 0;
                var clansFromDb = [];
                for (var index = 0; index < clansFound.length; index++) {
                    var searchedClan = clansFound[index];
                    if (searchedClan.tag)
                        Clan.findOneAndUpdate({ tag: searchedClan.tag }, searchedClan, { upsert: true, new: true, setDefaultsOnInsert: true }, function (err, clan) {
                            if (err)
                                throw err;
                            if (++updated == clansFound.length) {
                                callBack(null, clansFound);
                            }
                        });
                    else
                        Clan.find({ tag: clansToFind[updated] }, function (err, clans) {
                            if (err)
                                throw err;
                            if (clans.length > 0) {
                                clansFromDb[clansFromDb.length] = clans[0];
                                if (++updated == clans.length) {
                                    callBack(null, clansFromDb);
                                }
                            } else callBack(null, clansFound);
                        });


                }
            });
        },
        updatePlayer: function(playerToUpdate){
            Player.findOneAndUpdate({ tag: playerToUpdate.tag }, playerToUpdate, { upsert: true, new: true, setDefaultsOnInsert: true }, function (err, player) {
                if (err)
                    return;
            });
        },
        updateRank: function(location){
            Rank.findOneAndUpdate({ location: location }, {date: new Date()}, { upsert: true, new: true, setDefaultsOnInsert: true }, function (err, rank) {
                if (err)
                    return;
            });
        },
        searchClans: function (searchType, tag, options, callBack) {
            cocSearch.searchClans(searchType, tag, options, function (err, returnedClans) {
                if (err)
                    throw err;
                if (returnedClans.items || returnedClans.tag)
                    if(searchType == "Tag" || searchType == "rank")
                        callBack(null,returnedClans);
                    else
                        callBack(null,[], returnedClans);
                else {
                    var searchedClans = [];
                    if (searchType == "Tag")
                        Clan.find({ tag: "#" + tag }, function (err, clans) {
                            if (err)
                                throw err;
                            callBack(null, clans[0]);
                        });
                    else {
                        var search = {};
                        if(searchType == "rank") {
                            search = { "location.id": tag };
                        } else {
                            search = {"tag": "#" + tag};
                        }
                        Clan.find({ $or: [search, { name: new RegExp(tag, "g") }] }, function (err, clans) {
                            if (err)
                                throw err;
                            callBack(null, {items:clans});
                        });
                    }
                }
            });
        },
        searchUserClans: function (clans, callBack) {
            var inserted = 0;
            var searchedClans = [];
            var index = 0;
            for (var i = 0; i < clans.length; i++) {
                cocSearch.searchClans('Tag', clans[i], null, function (err, returnedClans) {
                    if (err) {
                        callBack(err);
                        return;
                    }
                    searchedClans[searchedClans.length] = returnedClans;
                    if (++inserted == clans.length)
                        callBack(null, searchedClans);
                });
            }
        },
        searchPlayers: function (searchType, tag, options, callBack) {
            cocSearch.searchPlayers(searchType, tag, options, function (err, returnedPlayers) {
                if (err)
                    throw err;
                if (returnedPlayers){
                    returnedPlayers.playerSearch = true;
                    callBack(null, returnedPlayers);
                }
                else {                    
                    if (searchType == "Tag")
                        Player.find({ tag: "#" + tag }, function (err, players) {
                            if (err)
                                throw err;
                            callBack(null, players);
                        });
                }
            });
        },
        getClanHistory : function(tag, callBack){
            clanHistory.aggregate([
                { "$match": { tag: "#" + tag }},
                // Unwind the array to denormalize
                { "$unwind": "$history" },

                { "$match": { "history.date": { $gte: getClanHistoryStartDate() } } },

                // Group back to array form
                {
                    "$group": {
                        "_id": "$_id",
                        "history": { "$push": "$history" }
                    }
                }
            ], function (err, response) {
                if (err)
                    throw err;
                if (response.length > 0)
                    callBack(null, response[0].history);
            });

            // clanHistory.find({ tag: "#" + tag }, {"history":{$slice:28}}, function (err, response) {
            //         if (err)
            //             throw err;
            //         if(response.length > 0)
            //             callBack(null, response[0].history);
            //     });
        },
        getPlayerHistory : function(tag, type, callBack){
            playerHistory.aggregate([
                { "$match": { tag: "#" + tag }},
                // Unwind the array to denormalize
                { "$unwind": "$history" },

                { "$match": { "history.date": { $gte: getClanHistoryStartDate() } } },

                // Group back to array form
                {
                    "$group": {
                        "_id": "$_id",
                        "history": { "$push": {data: "$history." + type,
                                                   "date": "$history.date"} }
                    }
                }
            ], function (err, response) {
                if (err)
                    throw err;
                if (response.length > 0)
                    callBack(null, response[0].history);
            });

            // clanHistory.find({ tag: "#" + tag }, {"history":{$slice:28}}, function (err, response) {
            //         if (err)
            //             throw err;
            //         if(response.length > 0)
            //             callBack(null, response[0].history);
            //     });
        },
        getRank: function(params, callBack){
            var date = new Date();
            var latest = params.latest;
            if(latest) {
                date.setUTCDate(date.getUTCDate() - 7);
            } else {
                date.setUTCDate(date.getUTCDate() - 1);
            }

            //date.setUTCDate(date.getUTCDate() - 7);

            // date.setUTCHours(0);         
            // date.setUTCMinutes(0);
            // date.setUTCSeconds(0);
            // date.setUTCMilliseconds(0);
            var locationSearch = {};
            if (params.location) locationSearch.location = parseInt(params.location);
            else locationSearch.type = "global"
            Rank.aggregate([
                { "$unwind": "$entries" },
                { "$unwind": "$entries.items" },
                
                { "$match": { $and: [locationSearch, {"entries.date": { $gte: date } }] } },
                //{ "$match": {"location":32000006} },
                //{ "$match": { "entries.items.clanPoints": { $gte: 59000 } } },
                { "$sort": {"entries.items.clanPoints":-1}},

                //{ "$group": {"_id": "$_id", "entries": { "$push": "$entries" }}},
                { "$group": { "_id": {"_id": "$_id", "date": "$entries.date", "entries":"$entries"} } },
                { "$sort": {"_id.date":1,"_id.entries.items.clanPoints":-1}},
                //{ "$group": { "_id" : { "_id":"$_id._id", "date": "$_id.entries.date"}, "items": { "$push": "$_id.entries.items" }} },
                {
                    "$group": {
                        "_id": { "date": "$_id.entries.date" },
                        "items": { "$push": {"name": "$_id.entries.items.name",
                                             "tag": "$_id.entries.items.tag",
                                             "clanPoints": "$_id.entries.items.clanPoints"} },
                        "top" : { $first: "$_id.entries.items.clanPoints" }
                    }
                },
                { "$sort": {"_id.date": latest ? -1 : 1 }},
                { "$project": {
                    "_id": 0,
                    "date": "$_id.date",
                    "items": { "$slice": ["$items", latest ? 200 : 10] },
                    "top": "$top"
                }},

                /*{ "$project": {
                    "_id": 0,
                    "date": "$_id.date",
                    "tag": "$_id.entries.items.tag",
                    "val": "$_id.entries.items.clanPoints"//{ "$slice": ["$items",20] }
                }},*/

                {"$limit": latest ? 1 : 200}
            ], function (err, response) {
                if (err)
                    throw err;
                if (response.length > 0)
                    callBack(null, response);
                else callBack(null, []);
            });
        },
        getPlayerRank: function (params, callBack) {
            var locationSearch = {};
            if (params.location) locationSearch.location = parseInt(params.location);
            Player.aggregate([
                { "$match": { $and: [locationSearch] } },
                {
                    $lookup: {
                        from: "clans",
                        localField: "clan.tag",
                        foreignField: "tag",
                        as: "player_clan"
                    }
                },
                { "$sort": { "trophies": -1 } },
                {
                    $project:{
                        tag : "$tag",
                        name: "$name",
                        location: "$player_clan.location.id",
                        clan: "$clan",
                        expLevel: "$expLevel",
                        trophies: "$trophies",
                        attackWins: "$attackWins",
                        defenseWins: "$defenseWins"
                    }
                },
                { "$limit": 200 }
            ], function (err, response) {
                if (err)
                    throw err;
                if (response.length > 0)
                    callBack(null, {items: response});
                else callBack(null, []);
            });
        },
        getPlayerClans: function (tag, callBack) {
            playerHistory.aggregate([
                { "$match": { tag: "#" + tag } },
                // Unwind the array to denormalize
                { "$unwind": "$history" },
                {
                    "$group": {
                        "_id": {
                            "clanName": "$history.clan.name",
                            "clanTag": "$history.clan.tag"
                        },
                        "date" : { $first: "$history.date" }
                    }
                },
                {
                    $project:{
                        tag : "$_id.clanTag",
                        name: "$_id.clanName",
                        "date" : { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
                    }
                }
            ], function (err, response) {
                if (err)
                    throw err;
                if (response.length > 0)
                    callBack(null, response);
            });
        },
        getLeague: function (searchType, tag, options, callBack) {
            cocSearch.search("/v1/leagues/" + tag, "custom", null, null, function (err, league) {
                if (err) {
                    console.error(err);
                    callBack(err, null);
                    return;
                }

                cocSearch.search("/v1/leagues/" + league.id + "/seasons", "custom", null, null, function (err, response) {
                    if (err) {
                        console.error(err);
                        callBack(err, null);
                        return;
                    }
                    cocSearch.search("", "league", response.items[response.items.length - 1].id, options, function (err, returnedPlayers) {
                        if (err)
                            throw err;
                        if (returnedPlayers) {
                            returnedPlayers.playerSearch = true;
                            returnedPlayers.league = league;
                            callBack(null, returnedPlayers);
                        }
                        else {
                            if (searchType == "Tag")
                                Player.find({ tag: "#" + tag }, function (err, players) {
                                    if (err)
                                        throw err;
                                    callBack(null, players);
                                });
                        }
                    });
                });
            });
        },
    }

