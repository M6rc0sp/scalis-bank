const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./bank.sqlite');

module.exports = db;