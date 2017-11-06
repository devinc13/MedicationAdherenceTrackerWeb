const scheduledJobs = require('./scheduledJobs');
var startString = '';
var endString = '';

process.argv.forEach(function (val, index, array) {
	if (index == 2) {
		startString = val;
	} else if (index == 3) {
		endString = val;
	}
});

var startDate = new Date(startString);
var endDate = new Date(endString);

console.log("Manually updating adherence hourly between " + startDate + " and " + endDate);

while (startDate < endDate) {
	let oldStartDate = new Date(startDate.getTime());
	startDate.setHours(startDate.getHours() + 1);
	scheduledJobs.updateAdherence(oldStartDate, startDate);
}

console.log("Manual update of adherence done.");
