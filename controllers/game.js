var db = require('../db');
var app = require('../app');
var arpad = require('arpad');

var elo = new arpad();

app.post('/games', function(req, res) {
  var doc = req.body;
  doc.date = new Date();
  if (doc.home === doc.away) {
    res.redirect('/');
  } else if (doc.home_score <= 0 || doc.away_score <= 0 || doc.home_score == doc.away_score) {
    res.redirect('/');
  } else {
    db.games.insert(doc);
    elocalc(doc, function() {
      res.redirect('/');
    });
  }
});

var elocalc = function (game, done) {
  var winner, loser;
  var winner_rating, loser_rating;
  if (game.home_score > game.away_score) {
    winner = game.home, loser = game.away;
  } else {
    winner = game.away, loser = game.home;
  }

  db.users.findOne({_id: winner}, function(err, winner_user) {
    if(err) { return; };
    db.users.findOne({_id: loser}, function(err, loser_user) {
      if(err) {return; };

      var winner_new_rating = elo.newRatingIfWon(winner_user.rating, loser_user.rating);
      var loser_new_rating = elo.newRatingIfLost(loser_user.rating, winner_user.rating);

      db.users.update({ _id: winner }, { $set: { rating: winner_new_rating }, $inc: { games: 1 } }, function() {
        db.users.update({ _id: loser }, { $set: { rating: loser_new_rating }, $inc: { games: 1 } }, function() {
          done();
        });  
      });
    });
  });
};
