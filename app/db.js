// load up the clan model
var Clan = require('../app/models/clan');
// load up the User model
var User = require('../app/models/user');
// Search using the CoC api
var cocSearch = require('../app/cocSearch');
// load up the Player model
var Player = require('../app/models/player');

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
        searchClans: function (searchType, tag, options, callBack) {
            cocSearch.searchClans(searchType, tag, options, function (err, returnedClans) {
                if (err)
                    throw err;
                if (returnedClans.items || returnedClans.tag)
                    if(searchType == "Tag")
                        callBack(null,returnedClans);
                    else
                        callBack(null,[], returnedClans);
                else {
                    var searchedClans = [];
                    if (searchType == "Tag")
                        Clan.find({ tag: "#" + tag }, function (err, clans) {
                            if (err)
                                throw err;
                            callBack(null, clans);
                        });
                    else
                        Clan.find({ $or: [{ tag: "#" + tag }, { name: new RegExp(tag, "g") }] }, function (err, clans) {
                            if (err)
                                throw err;
                            callBack(null, [] ,{items:clans});
                        });
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
            cocSearch.searchPlayers(searchType, tag, options, function (err, returnedClans) {
                if (err)
                    throw err;
                if (returnedClans){
                    returnedClans.playerSearch = true;
                    callBack(null, returnedClans);
                }
                else {
                    var searchedClans = [];
                    if (searchType == "Tag")
                        Player.find({ tag: "#" + tag }, function (err, clans) {
                            if (err)
                                throw err;
                            callBack(null, clans);
                        });
                    else
                        Clan.find({ $or: [{ tag: "#" + tag }, { name: new RegExp(tag, "g") }] }, function (err, clans) {
                            if (err)
                                throw err;
                            callBack(null, [] ,{items:clans});
                        });
                }
            });
        }
    }

