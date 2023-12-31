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

export function magnitude(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

export function midpoint(x1, y1, x2, y2) {
	return {x: (x2 + x1) / 2, y: (y1 + y2) / 2}
}