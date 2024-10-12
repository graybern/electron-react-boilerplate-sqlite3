const { ipcMain } = require('electron');
const Database = require('./database/database');

// Add a new user
ipcMain.handle('add-user', (event, user) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)'; // Remove 'age' since it's not in the table
    Database.run(sql, [user.name, user.email], function (err) {
      if (err) {
        console.error('Error adding user:', err);
        reject(err.message);
      } else {
        resolve({ id: this.lastID }); // Return the ID of the newly added user
      }
    });
  });
});

// Get all users
ipcMain.handle('get-users', (event) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users';
    Database.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error fetching users:', err);
        reject(err.message);
      } else {
        resolve(rows); // Return the array of users
      }
    });
  });
});

// Update a user
ipcMain.handle('update-user', (event, user) => {
  return new Promise((resolve, reject) => {
    const { id, name, email } = user;
    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    Database.run(sql, [name, email, id], function (err) {
      if (err) {
        console.error('Error updating user:', err);
        reject(err.message);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
});

// Delete a user
ipcMain.handle('delete-user', (event, id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    Database.run(sql, [id], function (err) {
      if (err) {
        console.error('Error deleting user:', err);
        reject(err.message);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
});
