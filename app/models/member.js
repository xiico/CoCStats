// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema(/*{
    tag: String,
    name: String,
    role: String,
    expLevel: Number,
    league: {
        id: Number,
        name: String
    },
    trophies: Number,
    clanRank: Number,
    previousClanRank: Number,
    donations: Number,
    donationsReceived: Number
}*/
{
  "tag": String,
  "name": String,
  "townHallLevel": Number,
  "expLevel": Number,
  "league": {
    "id": Number,
    "name": String
  },
  "trophies": Number,
  "bestTrophies": Number,
  "warStars": Number,
  "attackWins": Number,
  "defenseWins": Number,
  "builderHallLevel": Number,
  "versusTrophies": Number,
  "bestVersusTrophies": Number,
  "versusBattleWins": Number,
  "role": String,
  "donations": Number,
  "donationsReceived": Number,
  "clan": {
    "tag": String,
    "name": String,
    "clanLevel": Number,
    "badgeUrls": {
      "small": String,
      "large": String,
      "medium": String
    }
  },
  "legendStatistics": {
    "legendTrophies": Number,
    "previousSeason": {
      "id": String,
      "rank": Number,
      "trophies": Number
    },
    "bestSeason": {
      "id": String,
      "rank": Number,
      "trophies": Number
    },
    "currentSeason": {
      "rank": Number,
      "trophies": Number
    }
  },
  "achievements": [
    {
      "name": String,
      "stars": Number,
      "value": Number,
      "target": Number,
      "info": String,
      "completionInfo": String,
      "village": String
    }
  ],
  "versusBattleWinCount": Number,
  "troops": [
    {
      "name": String,
      "level": Number,
      "maxLevel": Number,
      "village": String
    }
  ],
  "heroes": [
    {
      "name": String,
      "level": Number,
      "maxLevel": Number,
      "village": String
    }
  ],
  "spells": [
    {
      "name": String,
      "level": Number,
      "maxLevel": Number,
      "village": String
    }
  ]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Member', userSchema);