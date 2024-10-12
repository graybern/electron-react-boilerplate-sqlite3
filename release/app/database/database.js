const path = require('path');
const { app } = require('electron');
const sqlite3 = require('sqlite3').verbose();

// Determine the path to store the database
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'app.db');

// Initialize the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database: ' + err.message);
  } else {
    console.log('Connected to the database.');
    initializeTables(); // Call function to initialize tables after the database is opened
  }
});

// Function to initialize tables if they don't exist
function initializeTables() {
  const createUsersTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE
    );
  `;

  db.run(createUsersTableSQL, (err) => {
    if (err) {
      console.error('Error creating users table: ' + err.message);
    } else {
      console.log('Users table initialized successfully.');
    }
  });
}

// Close the database connection when the app quits
app.on('quit', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database: ' + err.message);
    } else {
      console.log('Database closed.');
    }
  });
});

module.exports = db;
