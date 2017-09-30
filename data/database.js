// Model types
class User {}
class Medication {}

// Mock data - TODO: hook this up to DB
var user = new User();
user.id = '1';
user.name = 'Anonymous';
var medications = ['Medication 1', 'Medication 2'].map((name, i) => {
  var medication = new Medication();
  medication.name = name;
  medication.start = 1506726000000;
  medication.end = 1516726000000;
  medication.repeating = "daily";
  medication.notes = "Take with food.";
  medication.id = `${i}`;
  return medication;
});

module.exports = {
  // Export methods that your schema can use to interact with your database
//  getUser: (id) => id === user.id ? user : null,
  getUser: () => user,
  getMedication: (id) => medications.find(w => w.id === id),
  getMedications: () => medications,
  User,
  Medication,
};
