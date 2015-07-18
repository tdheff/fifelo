var db = require('../db')
var app = require('../app')

app.get('/', function(req, res) {
  db.users.once("value", function(users) {
    db.games.once("value", function(games) {
      games = games.val() || [];
      users = users.val() || [];
      res.render('index', {users: users, games: games});
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});