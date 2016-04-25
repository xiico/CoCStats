// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our clan model
var clanSchema = mongoose.Schema({
    tag: String,
    history: [{
        expLevel: Number,
        trophies: Number,
        attackWins: Number,
        defenseWins: Number,
        rank: Number,
        date: Date
    }],
    active: Boolean
});

// create the model for clans and expose it to our app
module.exports = mongoose.model('Clan', clanSchema);