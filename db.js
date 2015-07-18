var app = require('./app.js')

var Firebase = require("firebase");

if ('development' == app.get('env')) {
    var ref = new Firebase("https://fifelo.firebaseio.com/dev");
} else {
    var ref = new Firebase("https://fifelo.firebaseio.com/prod");
}

var db = {};
db.users = ref.child("users");
db.games = ref.child("games")

module.exports = db;