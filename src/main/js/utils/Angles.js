
const angleUnits = {
	ra: ['h', 'm', 's'],
	d: ['°', '\'', '"']
}

function formatAngle(angle, units) {
	const angleAbs = Math.abs(angle);
	const angleFractionInMinutes = (angleAbs - Math.floor(angleAbs)) * 60.0;
	const angleMinutes = Math.trunc(angleFractionInMinutes);
	const angleSeconds = (angleFractionInMinutes - angleMinutes) * 60.0;
	return "" + Math.trunc(angle) + units[0] + " " + ((angleMinutes < 10) ? "0" : "") + angleMinutes + units[1] + " " + ((angleSeconds < 10) ? "0" : "") + angleSeconds.toFixed(2) + units[2];
}

export function formatHourAngle(angle) {
	return formatAngle(angle / 15.0, angleUnits.ra);
}

export function formatDegrees(angle) {
	return formatAngle(angle, angleUnits.d);
}
