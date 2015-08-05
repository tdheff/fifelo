var db = require('../db')
var app = require('../app')

app.get('/users', function(req,res) {
  res.render('create_user');
});

app.post('/users', function(req, res) {
  var doc = {name: req.body.name, rating: 1500, games: 0, wins: 0, losses: 0}
  db.users.insert(doc, function (err, doc) {
    if (err) res.status(500).send("Error!");
  });
  res.redirect('/');
});
