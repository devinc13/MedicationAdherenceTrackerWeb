var schedule = require('node-schedule');
var dateFormat = require('dateformat');
const { Pool, Client } = require('pg');

var lastRun = null;

var hourlyAdherence = function() {
	var rule = new schedule.RecurrenceRule();

	// Every hour at the beginning of the hour
	rule.minute = 0;

	return schedule.scheduleJob(rule, updateAdherenceWrapper);
}

var updateAdherenceWrapper = function() {
	if (lastRun == null) {
		let currentDate = new Date();

		// We only want to run this on completed hours, so subtract an hour from the floor (hourly floor) of the current date (schedule rule should have it very close to the floor)
		currentDate.setMinutes(0);
		currentDate.setSeconds(0);
		currentDate.setMilliseconds(0);
		// This handles rolling back the day if needed
		currentDate.setHours(currentDate.getHours() - 1);
		lastRun = currentDate;
	}

	let end = new Date(lastRun);
	end.setHours(end.getHours() + 1);

	updateAdherence(lastRun, end);

	// Update lastRun for next iteration
	lastRun = new Date(end);
}

// Update adherence table between from and to datetimes
var updateAdherence = function(from, to) {
	const connectionString = process.env.DATABASE_URL;
	let pool = new Pool({
	  connectionString: connectionString,
	});

	let formattedStart = dateFormat(from, "yyyy-m-d HH:MM:ss");
	let formattedEnd = dateFormat(to, "yyyy-m-d HH:MM:ss");

	let formattedStartTime = dateFormat(from, "HH:MM:ss");
	let formattedEndTime = dateFormat(to, "HH:MM:ss");

	console.log("Updating adherence for " + formattedStart + " to " + formattedEnd + ".");

	// Get all dosages that had a window end time in the time period
	pool.query('SELECT dosages.id, dosages."windowStartTime", dosages."windowEndTime", medications.start, medications.repeating FROM dosages JOIN medications ON dosages.medicationid = medications.id WHERE dosages."windowEndTime" >= $1::time AND dosages."windowEndTime" < $2::time', [formattedStartTime, formattedEndTime])
	.then(res => {
		for (let dosage of res.rows) {
			// Only check weekly results when it is the appropriate day of the week (designated by the day of the week the medication was started on)
			if (dosage.repeating == 'weekly' && dosage.start.getDay() != from.getDay()) {
				continue;
			}
			
			// Check if there are any recorded dosages during the window for this dosage
			let formattedWindowStart = dateFormat(from, "yyyy-m-d ") + dosage.windowStartTime;
			let formattedWindowEnd = dateFormat(from, "yyyy-m-d ") + dosage.windowEndTime;
			pool.query('SELECT * FROM dosage_recordings WHERE dosageid = $1 AND "timestamp" >= $2::timestamp AND "timestamp" <= $3::timestamp', [dosage.id, formattedWindowStart, formattedWindowEnd])
			.then(res => {
				// Update adherence table. If we got a dosage_recording, there was adherence. If not, the patient didn't adhere.
				let recording = res.rows[0];
				let adhered = false;
				let timestamp = formattedWindowEnd;
				let dosageid = dosage.id;
				let notes = '';

				if (recording) {
					adhered = true;
					notes = recording.notes;
					timestamp = recording.timestamp;
				}

				pool.query('INSERT INTO dosage_adherences ("adhered", "timestamp", "notes", "dosageid") VALUES ($1, $2, $3, $4)', [adhered, timestamp, notes, dosageid])
				.then(res => {
					pool.end();
				});
			});
		}
	});

	
}


module.exports = {
  hourlyAdherence: hourlyAdherence,
  updateAdherence: updateAdherence,
};
