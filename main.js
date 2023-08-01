import {
	createEntity,
	createKinematicData,
	createKinematicDataRaw,
} from "./entity.js";

const entities = [];
const STARTING_ENTITIES = 3;
let tick = 0;

function nextTick() {
	tick++;
	entities.forEach((entity) => entity.move());
}

export function startSimulation() {
	for (let i = 0; i < STARTING_ENTITIES; i++) {
		initializeEntity();
	}
}

function initializeEntity() {
	const data = createKinematicData(0, 0, 10, "east");
	const entity = createEntity(data);
	entities.push(entity);
}

/////////
const data = createKinematicDataRaw(10, 10, 1, 1);
console.log(data);

const entity = createEntity(data);
console.log(entity);
entity.move();
console.log(entity);