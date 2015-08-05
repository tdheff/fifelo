var app = require('./app.js')

var mongodb = require("mongodb");
var monk = require("monk");

if ('development' == app.get('env')) {
    var database = monk("localhost:27017/fifelo");
} else {
    var database = monk("localhost:27017/fifelo");
}

var db = {users: database.get("users"), games: database.get("games")}

module.exports = db;
