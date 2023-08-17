export function toRadians(angle) {
	return angle * (Math.PI / 180);
}

export function toDegrees(angle) {
	return (180 * angle) / Math.PI;
}

export function distance(x1, y1, x2, y2) {
	let temp = Math.pow(x2 - x1, 2);
	let temp2 = Math.pow(y2 - y1, 2);
	return Math.sqrt(temp + temp2);
}