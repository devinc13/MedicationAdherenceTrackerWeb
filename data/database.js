const { Pool, Client } = require('pg');
const pool = new Pool();

// Mock data - TODO: hook this up to DB
var medications = ['Medication 1', 'Medication 2'].map((name, i) => {
  var medication = {};
  medication.name = name;
  medication.start = 1506726000000;
  medication.end = 1516726000000;
  medication.repeating = "daily";
  medication.notes = "Take with food.";
  medication.id = `${i}`;
  return medication;
});

var getUser = function() {
  return pool.query('SELECT * FROM users WHERE id = $1', [1]).then(res => res.rows[0]);
}

// var getMedication = function() {
//   return null;
// }

module.exports = {
  // Export methods that your schema can use to interact with your database
//  getUser: (id) => id === user.id ? user : null,
  getUser: getUser,
  getMedication: (id) => medications.find(w => w.id === id),
  getMedications: () => medications,
};
