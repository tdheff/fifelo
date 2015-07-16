var db = require('../db')
var app = require('../app')

app.get('/', function(req, res) {
  db.users.find({}).sort({rating:1}).exec(function(err_user, users) {
    db.games.find({}, function(err_games, games) {
      if (err_user || err_games) {
        res.render('500', {message: err});
      }

      res.render('index', {users: users, games: games})
    });
  });
});