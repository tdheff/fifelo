var app = require('./app.js')

var mongodb = require("mongodb");
var monk = require("monk");

if ('development' == app.get('env')) {
    var database = monk("localhost:27017/fifelo");
} else {
    var database = monk("heroku_3q3813qs:arbbr66ac07f5hj9kn5uioc19o@ds031183.mongolab.com:31183/heroku_3q3813qs");
}

var db = {users: database.get("users"), games: database.get("games")}

module.exports = db;
