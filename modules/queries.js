//mongo ds129023.mlab.com:29023/statsclash -u dbuser -p SenhaDBUser! 

db.clans.aggregate([
    {
        $unwind: "$membersList"
    },
    {
        $project: {
            name: "$memberList.name",
            tag: "$memberList.tag",
            trophies: "$memberList.trophies",
            clan: {
                tag: "$tag",
                name: "$name"
            }
        }
    }
])
db.clans.aggregate([
    {
        "$unwind": "$memberList"
    },
    { "$sort": {"memberList.trophies":-1}},
    {
        "$project": {
            "name": "$memberList.name",
            "tag": "$memberList.tag",
            "expLevel": "$memberList.expLevel",
            "trophies": "$memberList.trophies",
            "clan": {
                "tag": "$tag",
                "name": "$name",
                badgeUrls: {
                    small: "$badgeUrls.small"
                },
            },
            league: "$memberList.league",
            location: "$location",
            clanRank: "$memberList.clanRank",
            versusTrophies: "$memberList.versusTrophies"
        }
    }
]).pretty()


db.players.aggregate([
        {
            $lookup: {
                from: "clans",
                localField: "clan.tag",
                foreignField: "tag",
                as: "player_clan"
            }
        },
        {
            $lookup: {
                from: "playerhistories",
                localField: "tag",
                foreignField: "tag",
                as: "player_history"
            }
        },
        { "$sort": { "trophies": -1 } },
        {
            $project:{
                tag : "$tag",
                name: "$name",
                location: "$player_clan.location",
                clan: "$clan",
                league: "$league",
                expLevel: "$expLevel",
                trophies: "$trophies",
                versusTrophies: "$versusTrophies",
                history:{ $size: "$player_history" },
            }
        },
        /*{ "$match": {clan : null }},*/
    ]).pretty()


db.playerhistories.aggregate([
    { "$match": { tag: "#8UPR9CGV" }},
    { "$unwind": "$history" },
    {
        "$group": {
            "_id": {
                "player": "$tag",
                /*"clanName": "$history.clan.name",*/
                "clanTag": "$history.clan.tag",
                /*"date": "$history.date"*/
            },
            /*"date" : { $first: "$history.date" }*/
        }
    },
    /*{ "$sort": {"player": 1}},
    {
        $project:{
            _id: 0,
            player: "$_id.player",
            tag : "$_id.clanTag",*/
            /*name: "$_id.clanName",
            "date" : { $dateToString: { format: "%Y-%m-%d", date: "$date" } }*/
        /*}
    },*/
    /*{
        "$group": {
            "_id": {
                "player": "$player"
            },
            "count" : { $sum: 1 }
        }
    },
    { "$sort": {"count": -1}},*/
]).pretty()


db.playerhistories.aggregate([
    { "$match": { tag: "#8UPR9CGV" }},
    { "$unwind": "$history" },
]).pretty()