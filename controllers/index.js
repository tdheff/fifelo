var db = require('../db')
var app = require('../app')
var _ = require("underscore")

app.get('/', function(req, res) {
  db.users.once("value", function(users) {
    db.games.once("value", function(games) {
      games = games.val() || [];
      users = (_.sortBy(_.toArray(users.val()), 'rating')).reverse() || [];
      console.log(users)
      res.render('index', {users: users, games: games});
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});
