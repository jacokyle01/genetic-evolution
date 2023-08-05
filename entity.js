import { ctx } from "./main.js";

export const createEntity = (kinematicData, mass) => {
	const entity = {
		kinematicData,
		mass,
	};
	Object.assign(
		entity,
		mover(kinematicData),
		directionChanger(kinematicData),
		drawer(kinematicData)
	);
	return entity;
};

export const createKinematicData = (position, velocity) => {
	return { position, velocity };
};

export const createKinematicDataRaw = (px, py, vx, vy) => {
	const position = {
		x: px,
		y: py,
	};
	const velocity = {
		x: vx,
		y: vy,
	};
	return createKinematicData(position, velocity);
};

export function mover(data) {
	return {
		move: function () {
			data.position.x += data.velocity.x;
			data.position.y += data.velocity.y;
		},
	};
}

export function directionChanger(data) {
	return {
		reorient: function (direction) {
			data.direction = direction;
		},
	};
}

function drawer(data) {
	return {
		draw: function () {
			ctx.beginPath();
			ctx.arc(data.position.x, data.position.y, 20, 0, 2 * Math.PI);
			ctx.fillStyle = "blue";
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.stroke();
		},
	};
}
//////////
