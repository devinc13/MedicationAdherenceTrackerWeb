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

var delayFactor = 1;
while (startDate < endDate) {
	let oldStartDate = new Date(startDate.getTime());
	startDate.setHours(startDate.getHours() + 1);
	// Add delay to avoid connection limit on heroku
	setTimeout(function(from) {
		let to = new Date(from.getTime());
		to.setHours(to.getHours() + 1);
		scheduledJobs.updateAdherence(from, to);
	}, 2000 * delayFactor, oldStartDate);
	delayFactor = delayFactor + 1;
}

console.log("Manual update of adherence done.");
