var db = require('../db')
var app = require('../app')
var _ = require("underscore")

app.get('/', function(req, res) {
  db.users.find({}, function(u_err, users) {
    db.games.find({}, function(g_err, games) {
      if (u_err || g_err) res.status(500).send("Error!")
      res.render('index', {users: users, games: games});
    });
  });
});
