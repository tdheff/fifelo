var db = require('../db');
var app = require('../app');
var arpad = require('arpad');

var elo = new arpad();

/*db.games.insert({}).success( function (game) {
  elocalc(game);
});*/

/*db.games.remove({}).success( function (game) {
  recalculate();
});*/

app.post('/games', function(req, res) {
  var doc = req.body;
  if (doc.home === doc.away) {
    res.redirect('/');
  } else if (doc.home_score < 0 || doc.away_score < 0 || doc.home_score == doc.away_score) {
    res.redirect('/');
  } else {
    db.games.insert(doc).success(function (game) {
      elocalc(game, function () {
        res.redirect('/');
      });
    }).error(function (error) {
      res.status(500).send("Error!");
    })
  }
});

var elocalc = function (game, done) {
  var winner, loser;
  var winner_score, loser_score;
  var winner_rating, loser_rating;
  if (game.winner && game.loser) {
    winner = game.winner, loser = game.loser;
    winner_score = game.winner_score, loser_score = game.loser_score;
  } else {
    if (game.home_score > game.away_score) {
      winner = game.home, loser = game.away;
      winner_score = game.home_score, loser_score = game.away_score;
    } else {
      winner = game.away, loser = game.home;
      winner_score = game.away_score, loser_score = game.home_score;
    }
  }

  db.users.findById(winner, function(w_err, winner_user) {
    db.users.findById(loser, function(l_err, loser_user) {
      if (w_err || l_err) console.log("errrrr")

      var winner_new_rating = elo.newRatingIfWon(winner_user.rating, loser_user.rating);
      var loser_new_rating = elo.newRatingIfLost(loser_user.rating, winner_user.rating);

      db.users.updateById(winner, {$set: {rating: winner_new_rating, games: winner_user.games + 1, wins: winner_user.wins + 1}});
      db.users.updateById(loser, {$set: {rating: loser_new_rating, games: loser_user.games + 1, losses: loser_user.wins + 1}});

      new_game = {}
      new_game.date = new Date().getTime();

      new_game.winner = winner;
      new_game.winner_name = winner_user.name;
      new_game.winner_score = winner_score;
      new_game.winner_old_rating = winner_user.rating;
      new_game.winner_new_rating = winner_new_rating;
      new_game.winner_delta = winner_new_rating - winner_user.rating;

      new_game.loser = loser;
      new_game.loser_name = loser_user.name;
      new_game.loser_score = loser_score;
      new_game.loser_old_rating = loser_user.rating;
      new_game.loser_new_rating = loser_new_rating;
      new_game.loser_delta = loser_new_rating - loser_user.rating;

      db.games.updateById(game._id, {$set: new_game});

    });
  });

  if (done instanceof Function) { done(); }
};

// recalculate elos based on past games
var recalculate = function() {
  db.users.update({}, {rating: 1500, games: 0, wins: 0, losses: 0});

  // recalculate all the games
  db.games.find({}, function(err, games) {
    games.forEach(function(game) {
      elocalc(game);
    });
  });
}
