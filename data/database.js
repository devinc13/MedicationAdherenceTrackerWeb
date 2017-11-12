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
  return pool.query('INSERT INTO medications ("start", "end", "repeating", "notes", "userid", "name") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [start, end, repeating, notes, userId, name]).then(res => res.rows[0]);
}

var editMedication = function(id, name, start, end, repeating, notes) {
  return pool.query('UPDATE medications SET ("start", "end", "repeating", "notes", "name") = ($1, $2, $3, $4, $5) WHERE id = ($6) RETURNING *', [start, end, repeating, notes, name, id]).then(res => res.rows[0]);
}

var deleteMedication = function(id) {
  return pool.query('DELETE FROM medications WHERE id = ($1)', [id]);
}

var getUserByMedicationId = function(id) {
  return pool.query('SELECT users.* FROM medications WHERE id = $1 JOIN users ON medications.userId = users.id', [id]).then(res => res.rows[0]);
}

// Gets dosage by dosage id
var getDosage = function(id) {
  return pool.query('SELECT * FROM dosages WHERE id = $1', [id]).then(res => res.rows[0]);
}

// Gets dosages by medication id
var getDosages = function(id) {
  return pool.query('SELECT * FROM dosages WHERE medicationId = $1', [id]).then(res => res.rows);
}

var addDosage = function(medicationId, dosageAmount, windowStartTime, windowEndTime, notificationTime, route) {
  return pool.query('INSERT INTO dosages ("medicationid", "dosageAmount", "windowStartTime", "windowEndTime", "notificationTime", "route") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [medicationId, dosageAmount, windowStartTime, windowEndTime, notificationTime, route]).then(res => res.rows[0]);
}

var editDosage = function(id, dosageAmount, windowStartTime, windowEndTime, notificationTime, route) {
  return pool.query('UPDATE dosages SET ("dosageAmount", "windowStartTime", "windowEndTime", "notificationTime", "route") = ($1, $2, $3, $4, $5) WHERE id = ($6) RETURNING *', [dosageAmount, windowStartTime, windowEndTime, notificationTime, route, id]).then(res => res.rows[0]);
}

var deleteDosage = function(id) {
  return pool.query('DELETE FROM dosages WHERE id = ($1)', [id]);
}

var getAdherence = function(id) {
  return pool.query('SELECT * FROM dosage_adherences WHERE id = $1', [id]).then(res => res.rows[0]);
}

var getDosageAdherences = function(id, args) {
  console.log(args);
  return pool.query('SELECT * FROM dosage_adherences WHERE dosageid = $1', [id]).then(res => res.rows);
}

module.exports = {
  getUserByEmail: getUserByEmail,
  getUserById: getUserById,
  getMedication: getMedication,
  getMedications: getMedications,
  addMedication: addMedication,
  editMedication: editMedication,
  deleteMedication: deleteMedication,
  getUserByMedicationId: getUserByMedicationId,
  getDosage: getDosage,
  getDosages: getDosages,
  addDosage: addDosage,
  editDosage: editDosage,
  deleteDosage: deleteDosage,
  getAdherence: getAdherence,
  getDosageAdherences: getDosageAdherences,
};
