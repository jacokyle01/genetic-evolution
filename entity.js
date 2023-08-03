export const createEntity = (kinematicData, mass) => {
	const entity = {
		kinematicData,
		mass
	};
	Object.assign(entity, mover(kinematicData), directionChanger(kinematicData));
	return entity;
};

export const createKinematicData = (position, velocity) => {
	return {position, velocity};
};

export const createKinematicDataRaw = (px, py, vx, vy) => {
	const position = {
		x: px,
		y: py
	}
	const velocity = {
		x: vx,
		y: vy
	}
	return createKinematicData(position, velocity);
}

function mover(data) {
	return {
		move: function () {
			data.position.x += data.velocity.x;
			data.position.y += data.velocity.y;
		},
	};
}

function directionChanger(data) {
	return {
		reorient: function (direction) {
			data.direction = direction;
		},
	};
}
//////////