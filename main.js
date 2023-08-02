import {
	createEntity,
	createKinematicData,
	createKinematicDataRaw,
} from "./entity.js";

import { createPropellant } from "./propellant.js";

export const entities = [];
const propellants = [];
const STARTING_ENTITIES = 3;
let tick = 0;

export function nextTick() {
	tick++;
	entities.forEach((entity) => entity.move());
}

export function startSimulation() {
	for (let i = 0; i < STARTING_ENTITIES; i++) {
		//initializeEntity();
	}
}

export function initializeEntity(entity) {
	entities.push(entity);
}

/////////

const tnt = createPropellant(createKinematicDataRaw(10, 10, 1, 1), 50, 25)
console.log(tnt);
