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

  database.run(`
    INSERT INTO accounts (id, checking_balance, savings_balance)
    SELECT 1, 0, 0
    WHERE NOT EXISTS(SELECT 1 FROM accounts WHERE id = 1)
  `, (err: Error | null) => {
    if (err) {
      console.error('Error to insert account', err);
    }
  });
});