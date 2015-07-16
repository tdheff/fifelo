var Database = require('nedb');

var db = {}
db.users = new Database({ filename: './db/users.db', autoload: true});
db.games = new Database({ filename: './db/games.db', autoload: true});

module.exports = db;