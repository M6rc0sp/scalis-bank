const database = require('./db');

database.serialize(() => {
  database.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY,
      checking_balance REAL NOT NULL,
      savings_balance REAL NOT NULL
    )
  `, (err: Error | null) => {
    if (err) {
      console.error('Error to create table', err);
    }
  });
});