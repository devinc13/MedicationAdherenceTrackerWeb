const { Pool, Client } = require('pg');
const pool = new Pool();

var getUser = function(email) {
  return pool.query('SELECT * FROM users WHERE email = $1', [email]).then(res => res.rows[0]);
}

var getMedications = function(id) {
  return pool.query('SELECT * FROM medications WHERE userid = $1', [id]).then(res => res.rows);
}

var getMedication = function(id) {
  return pool.query('SELECT * FROM medications WHERE id = $1', [id]).then(res => res.rows[0]);
}

var loginUser = function(email, password) {
  return pool.query('SELECT * FROM medications WHERE email = $1 AND password = $2', [email, password]).then(res => console.log(res));
}

module.exports = {
  getUser: getUser,
  getMedication: getMedication,
  getMedications: getMedications,
  loginUser: loginUser,
};
