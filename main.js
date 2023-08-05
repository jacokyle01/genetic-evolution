import {
	createEntity,
	createKinematicData,
	createKinematicDataRaw,
} from "./entity.js";

import { createPropellant } from "./propellant.js";

import { createPhysics } from "./physics.js";

export const entities = [];
export let propellants = [];
const STARTING_ENTITIES = 3;
const canvas = document.querySelector("canvas");
const button = document.querySelector("button");
button.addEventListener("click", (e) => nextTick());
export const ctx = canvas.getContext("2d");
export let tick = 0;

export function nextTick() {
	tick++;
	entities.forEach((entity) => entity.move());
	propellants.forEach((propellant) => propellant.move());
	const exploding = propellants.filter((propellant) => {
		return propellant.explodesAt == tick;
	});
	exploding.forEach((propellant) => handleExplosion(propellant));
	propellants = propellants.filter((propellant) => {
		return propellant.explodesAt > tick;
	});
	animate();
}

function animate() {
	ctx.clearRect(0, 0, 400, 400);
	entities.forEach((entity) => entity.draw());
	propellants.forEach((propellant) => propellant.draw());

}

function handleExplosion(propellant) {
	entities.forEach((entity) => {
		const propellantVector = {
			x: entity.kinematicData.position.x - propellant.kinematicData.position.x,
			y: entity.kinematicData.position.y - propellant.kinematicData.position.y,
		};

		const physics = createPhysics();

		//calculate resultant energy
		propellantVector.x = physics.calculateEnergy(
			propellant.explosiveForce,
			propellantVector.x
		);
		propellantVector.y = physics.calculateEnergy(
			propellant.explosiveForce,
			propellantVector.y
		);
		//calculate resultant velocity components
		propellantVector.x = physics.velocityFromEnergy(
			propellantVector.x,
			entity.mass
		);
		propellantVector.y = physics.velocityFromEnergy(
			propellantVector.y,
			entity.mass
		);

		//add velocity to affected entity's velocity
		entity.kinematicData.velocity.x += propellantVector.x;
		entity.kinematicData.velocity.y += propellantVector.y;
	});
}

export function startSimulation() {
	for (let i = 0; i < STARTING_ENTITIES; i++) {
		//initializeEntity();
	}
}

export function initializeEntity(entity) {
	entities.push(entity);
}

export function initializePropellant(propellant) {
	propellants.push(propellant);
}

// /////////
const entity = createEntity(createKinematicDataRaw(30, 10, 10, 0), 10);
initializeEntity(entity);

const tnt = createPropellant(
	createKinematicDataRaw(180, 30, 0, 0),
	10,
	100,
	5
);
initializePropellant(tnt);
