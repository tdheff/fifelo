var db = require('../db')
var app = require('../app')

app.get('/users', function(req,res) {
  res.render('create_user');
});

app.post('/users', function(req, res) {
  var doc = {name: req.body.name, rating: 1500, games: 0}
  db.users.insert(doc);
  res.redirect('/');
});
