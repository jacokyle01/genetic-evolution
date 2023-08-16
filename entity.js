import { ctx, tick } from "./main.js";
import { createPropellant } from "./propellant.js";
import { toRadians } from "./maths.js";

export const createEntity = (kinematicData, mass, facing, payloadInfo) => {
	const entity = {
		kinematicData,
		mass,
		facing,
		payloadInfo,
	};
	Object.assign(
		entity,
		mover(kinematicData),
		directionChanger(kinematicData),
		drawer(kinematicData),
		payloadGetter(kinematicData, payloadInfo)
	);
	return entity;
};

export const createKinematicData = (position, velocity) => {
	return { position, velocity };
};

export const createPayloadInfo = (
	ejectionInterval,
	ejectionVelocity,
	payloadData,
	explodesIn
) => {
	return { ejectionInterval, ejectionVelocity, payloadData, explodesIn };
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

function payloadGetter(kData, pInfo) {
	return {
		getPayload: function () {
			console.log(pInfo);
			let ejectingAt = toRadians(this.facing + 180);
			ejectingAt = ejectingAt.toFixed(3);
			let xVel = pInfo.ejectionVelocity * Math.cos(ejectingAt);
			let yVel =
				-1 * pInfo.ejectionVelocity * Math.sin(ejectingAt);
			const propellant = createPropellant(
				createKinematicDataRaw(
					kData.position.x,
					kData.position.y,
					xVel,
					yVel
				),
				...pInfo.payloadData,
				pInfo.explodesIn + tick

			);

			return propellant;
		},
	};
}
//////////