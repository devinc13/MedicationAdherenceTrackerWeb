const { Pool, Client } = require('pg');
const pool = new Pool();

var getUserByEmail = function(email) {
  return pool.query('SELECT * FROM users WHERE email = $1', [email]).then(res => res.rows[0]);
}

var getUserById = function(id) {
  return pool.query('SELECT * FROM users WHERE id = $1', [id]).then(res => res.rows[0]);
}

var getMedications = function(id) {
  return pool.query('SELECT * FROM medications WHERE userid = $1', [id]).then(res => res.rows);
}

var getMedication = function(id) {
  return pool.query('SELECT * FROM medications WHERE id = $1', [id]).then(res => res.rows[0]);
}

var addMedication = function(userId, name, start, end, repeating, notes) {
  return pool.query('INSERT INTO medications ("start", "end", "repeating", "notes", "userid", "name") VALUES ($1, $2, $3, $4, $5, $6)', [start, end, repeating, notes, userId, name]);
}

module.exports = {
  getUserByEmail: getUserByEmail,
  getUserById: getUserById,
  getMedication: getMedication,
  getMedications: getMedications,
  addMedication: addMedication,
};
