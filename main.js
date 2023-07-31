const button = document.querySelector("button");
const entities = [];

let tick = 0;
addEventListener(button, nextTick());

function nextTick() {
	tick++;
	entities.forEach((entity) => entity.update());
}

function mover(data) {
	return {
		move: function () {
			switch (data.direction) {
				case "north":
					data.y -= data.speed;
					break;
				case "east":
					data.x += data.speed;
					break;
				case "south":
					data.y += data.speed;
					break;
				case "west":
					data.x -= data.speed;
					break;
				default:
					break;
			}
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

export const createEntity = (kinematicData) => {
	const entity = {
		kinematicData,
	};
	Object.assign(entity, mover(kinematicData), directionChanger(kinematicData));
	return entity;
};

export const createKinematicData = (x, y, speed, direction) => {
	return { x, y, speed, direction };
};

//////////

const data = createKinematicData(10, 10, 10, "north");
const entity = createEntity(data);

entity.reorient("east");
entity.reorient("south");
entity.reorient("east");


console.log(entity.kinematicData);
entity.move();
console.log(entity.kinematicData);
