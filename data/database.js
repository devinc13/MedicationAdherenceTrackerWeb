const { Pool, Client } = require('pg');
const dateFormat = require('dateformat');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

class User {}
class Medication {}
class Dosage {}
class Adherence {}

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
});

var getUserByEmail = function(email) {
  return pool.query('SELECT * FROM users WHERE email = $1', [email]).then(res => {

    var user = new User();
    for (let property in res.rows[0]) {
      user[property] = res.rows[0][property];
    }

    return user;
  });
}

var getUserById = function(id) {
  return pool.query('SELECT * FROM users WHERE id = $1', [id]).then(res => {

    var user = new User();
    for (let property in res.rows[0]) {
      user[property] = res.rows[0][property];
    }

    return user;
  });
}

var getMedications = function(id) {
  return pool.query('SELECT * FROM medications WHERE userid = $1', [id]).then(res => {
    var medications = [];
    let numRows = res.rows.length;
    for (let i = 0; i < numRows; i++) {
      var medication = new Medication();
      for (let property in res.rows[i]) {
        medication[property] = res.rows[i][property];
      }
      medications.push(medication);
    }

    return medications;
  });
}

var getMedication = function(id) {
  return pool.query('SELECT * FROM medications WHERE id = $1', [id]).then(res => {

    var medication = new Medication();
    for (let property in res.rows[0]) {
      medication[property] = res.rows[0][property];
    }

    return medication;
  });
}

var addMedication = function(userId, name, start, end, repeating, notes) {
  return pool.query('INSERT INTO medications ("start", "end", "repeating", "notes", "userid", "name") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [start, end, repeating, notes, userId, name]).then(res => {

    var medication = new Medication();
    for (let property in res.rows[0]) {
      medication[property] = res.rows[0][property];
    }

    return medication;
  });
}

var editMedication = function(id, name, start, end, repeating, notes) {
  return pool.query('UPDATE medications SET ("start", "end", "repeating", "notes", "name") = ($1, $2, $3, $4, $5) WHERE id = ($6) RETURNING *', [start, end, repeating, notes, name, id]).then(res => {

    var medication = new Medication();
    for (let property in res.rows[0]) {
      medication[property] = res.rows[0][property];
    }

    return medication;
  });
}

var deleteMedication = function(id) {
  return pool.query('DELETE FROM medications WHERE id = ($1)', [id]);
}

var getUserByMedicationId = function(id) {
  return pool.query('SELECT users.* FROM medications WHERE id = $1 JOIN users ON medications.userId = users.id', [id]).then(res => {

    var user = new User();
    for (let property in res.rows[0]) {
      user[property] = res.rows[0][property];
    }

    return user;
  });
}

// Gets dosage by dosage id
var getDosage = function(id) {
  return pool.query('SELECT * FROM dosages WHERE id = $1', [id]).then(res => {

    var dosage = new Dosage();
    for (let property in res.rows[0]) {
      dosage[property] = res.rows[0][property];
    }

    return dosage;
  });
}

// Gets dosages by medication id
var getDosages = function(id) {
  return pool.query('SELECT * FROM dosages WHERE medicationId = $1', [id]).then(res => {
    var dosages = [];
    let numRows = res.rows.length;
    for (let i = 0; i < numRows; i++) {
      var dosage = new Dosage();
      for (let property in res.rows[i]) {
        dosage[property] = res.rows[i][property];
      }
      dosages.push(dosage);
    }

    return dosages;
  });
}

var addDosage = function(medicationId, dosageAmount, windowStartTime, windowEndTime, notificationTime, route) {
  return pool.query('INSERT INTO dosages ("medicationid", "dosageAmount", "windowStartTime", "windowEndTime", "notificationTime", "route") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [medicationId, dosageAmount, windowStartTime, windowEndTime, notificationTime, route]).then(res => {

    var dosage = new Dosage();
    for (let property in res.rows[0]) {
      dosage[property] = res.rows[0][property];
    }

    return dosage;
  });
}

var editDosage = function(id, dosageAmount, windowStartTime, windowEndTime, notificationTime, route) {
  return pool.query('UPDATE dosages SET ("dosageAmount", "windowStartTime", "windowEndTime", "notificationTime", "route") = ($1, $2, $3, $4, $5) WHERE id = ($6) RETURNING *', [dosageAmount, windowStartTime, windowEndTime, notificationTime, route, id]).then(res => {

    var dosage = new Dosage();
    for (let property in res.rows[0]) {
      dosage[property] = res.rows[0][property];
    }

    return dosage;
  });
}

var deleteDosage = function(id) {
  return pool.query('DELETE FROM dosages WHERE id = ($1)', [id]);
}

var getAdherence = function(id) {
  var adherence = new Adherence();
  return pool.query('SELECT * FROM dosage_adherences WHERE id = $1', [id]).then(res => {

    var adherence = new Adherence();
    for (let property in res.rows[0]) {
      adherence[property] = res.rows[0][property];
    }

    return adherence;
  });
}

var getDosageAdherences = function(id, args) {
  let startString = args.startTimestamp;
  let endString = args.endTimestamp;
  let query = 'SELECT * FROM dosage_adherences WHERE dosageid = $1';
  if (startString) {
    let start = new Date(Date.parse(startString));
    query += ' AND timestamp >= \'' + dateFormat(start, "yyyy-mm-dd HH:MM:ss") + '\'';
  }

  if (endString) {
    let end = new Date(Date.parse(endString));
    query += ' AND timestamp < \'' + dateFormat(end, "yyyy-mm-dd HH:MM:ss") + '\'';
  }

  return pool.query(query, [id]).then(res => {
    var adherences = [];
    let numRows = res.rows.length;
    for (let i = 0; i < numRows; i++) {
      var adherence = new Adherence();
      for (let property in res.rows[i]) {
        adherence[property] = res.rows[i][property];
      }
      adherences.push(adherence);
    }

    return adherences;
  });
}

var addUser = function(firstName, lastName, email, password) {
  var salt = bcrypt.genSaltSync();
  var hash = bcrypt.hashSync(password, salt);

  return pool.query('INSERT INTO users ("first_name", "last_name", "email", "password_hash", "password_salt") VALUES ($1, $2, $3, $4, $5) RETURNING id', [firstName, lastName, email, hash, salt]).then(res => res.rows[0]);
}

var login = function(email, password) {
    return pool.query('SELECT * FROM users WHERE email = $1', [email]).then(res => {
      let user = new User();

      let response = res.rows;
      if (!response[0]) {
        // No user found, return blank user
        return user;
      } else {
        let storedHash = response[0].password_hash;
        let doesPasswordMatch = bcrypt.compareSync(password, storedHash);
        if (!doesPasswordMatch) {
          // Wrong password, return blank user
          return user;
        }
      }

      // If we get here, the user had a valid email with a matching password
      for (let property in res.rows[0]) {
        user[property] = res.rows[0][property];
      }

      // Create auth token for user
      let secret = process.env.JWT_SECRET;
      let token = jwt.sign({ id: user.id, email: user.email }, secret);
      user["token"] = token;

      return user;
    });
}

module.exports = {
  User: User,
  Medication: Medication,
  Dosage: Dosage,
  Adherence: Adherence,
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
  addUser: addUser,
  login: login,
};
