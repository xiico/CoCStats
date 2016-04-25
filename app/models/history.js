// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our clan model
var histSchema = mongoose.Schema({
    expLevel: Number,
    trophies: Number,
    attackWins: Number,
    defenseWins: Number,
    rank: Number,
    date: Date
});

// create the model for clans and expose it to our app
module.exports = mongoose.model('History', clanSchema);