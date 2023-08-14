import { createEntity, createKinematicDataRaw, createPayloadInfo } from "./entity.js";

import { createPropellant } from "./propellant.js";

import { createPhysics } from "./physics.js";

export let entities = [];
export let propellants = [];
const STARTING_ENTITIES = 3;
const canvas = document.querySelector("canvas");
const button = document.querySelector("button");
button.addEventListener("click", () => nextTick());
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

	//if nth tick, eject payload
	entities.forEach((entity) => {
		if (tick % entity.payloadInfo.ejectionInterval == 0) {
			const propellant = entity.getPayload();
			console.log(propellant);
			initializePropellant(propellant);
		}
	})

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

		let xIsPositive = propellantVector.x > 0;
		let yIsPositive = propellantVector.y > 0;

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

		if (xIsPositive) {
			entity.kinematicData.velocity.x += propellantVector.x;
		} else {
			entity.kinematicData.velocity.x -= propellantVector.x;
		}
		if (yIsPositive) {
			entity.kinematicData.velocity.y += propellantVector.y;
		} else {
			entity.kinematicData.velocity.y -= propellantVector.y;
		}
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

export function resetGame() {
	tick = 0;
	entities = [];
	propellants = [];
}

// /////////
// const entity2 = createEntity(createKinematicDataRaw(30, 30, 20, 0), 10);
// const tnt2 = createPropellant(createKinematicDataRaw(70, 70, 0, 0), 10, 100, 4);
// initializePropellant(tnt2);
// initializeEntity(entity2);
// const entity = createEntity(
// 	createKinematicDataRaw(90, 30, 0, 0),
// 	100, //mass
// 	0, //facing
//     createPayloadInfo(5, 10, [10, 50, 10])
// );
// console.log(entity);
// initializeEntity(entity);
// nextTick();
// nextTick();