var db = require('../db');
var app = require('../app');
var arpad = require('arpad');

var elo = new arpad();

app.post('/games', function(req, res) {
  var doc = req.body;
  if (doc.home === doc.away) {
    res.redirect('/');
  } else if (doc.home_score <= 0 || doc.away_score <= 0 || doc.home_score == doc.away_score) {
    res.redirect('/');
  } else {
    elocalc(doc, function(new_doc) {
      res.redirect('/');
      db.games.insert(new_doc);
    });
  }
});

var elocalc = function (game, done) {
  var winner, loser;
  var winner_score, loser_score;
  var winner_rating, loser_rating;
  if (game.home_score > game.away_score) {
    winner = game.home, loser = game.away;
    winner_score = game.home_score, loser_score = game.away_score;
  } else {
    winner = game.away, loser = game.home;
    winner_score = game.away_score, loser_score = game.home_score;
  }

  db.users.findOne({_id: winner}, function(err, winner_user) {
    if(err) { return; };
    db.users.findOne({_id: loser}, function(err, loser_user) {
      if(err) {return; };

      var winner_new_rating = elo.newRatingIfWon(winner_user.rating, loser_user.rating);
      var loser_new_rating = elo.newRatingIfLost(loser_user.rating, winner_user.rating);

      db.users.update({ _id: winner }, { $set: { rating: winner_new_rating }, $inc: { games: 1 } }, function() {
        db.users.update({ _id: loser }, { $set: { rating: loser_new_rating }, $inc: { games: 1 } }, function() {
          
          new_game = {}
          new_game.date = new Date();

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
          
          done(new_game);
        });  
      });
    });
  });
};
