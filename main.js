import {
	createEntity,
	createKinematicDataRaw,
	createPayloadInfo,
} from "./entity.js";

import { createPropellant } from "./propellant.js";

import { createPhysics } from "./physics.js";

import { createNutrient } from "./nutrient.js";

import { distance, magnitude } from "./maths.js";

export let entities = [];
export let propellants = [];
export let nutrients = [];

const STARTING_ENTITIES = 3;
const NUM_NUTRIENTS = 10;

const canvas = document.querySelector("canvas");
export const ENTITY_RADIUS = 20;
export const NUTRIENT_RADIUS = 10;
export const PROPELLANT_WIDTH = 30;

const button = document.querySelector("button");
button.addEventListener("click", () => nextTick());
export const ctx = canvas.getContext("2d");
export let tick = 0;

window.addEventListener("load", () => {
	console.log("page is fully loaded");
	canvas.width = 1000;
	canvas.height = 400;
	nextTick();
});

export function nextTick() {
	tick++;
	regulateNutrients();

	//have each entity target the nearest nutrient
	entities.forEach((entity) => {
		let closest = nutrients.reduce((closest, next) => {
			let distanceClosest = distance(
				closest.kinematicData.position.x,
				closest.kinematicData.position.y,
				entity.kinematicData.position.x,
				entity.kinematicData.position.y
				)
			let distanceNext = distance(
				next.kinematicData.position.x,
				next.kinematicData.position.y,
				entity.kinematicData.position.x,
				entity.kinematicData.position.y
			)
			return distanceClosest > distanceNext ? next : closest;
		})
		entity.target(closest);
	});

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
			initializePropellant(propellant);
		}
	});

	animate();
}

function regulateNutrients() {
	while (nutrients.length < NUM_NUTRIENTS) {
		const nutrient = generateNutrient();
		initializeNutrient(nutrient);
	}
}

function generateNutrient() {
	let x = Math.floor(Math.random() * canvas.width);
	let y = Math.floor(Math.random() * canvas.height);

	return createNutrient(createKinematicDataRaw(x, y, 0, 0));
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	entities.forEach((entity) => entity.draw());
	propellants.forEach((propellant) => propellant.draw());
	nutrients.forEach((nutrient) => nutrient.draw());
}

//TODO refactor using array, functional paradigm
function handleExplosion(propellant) {
	entities.forEach((entity) => {
		const fromPropellant = {
			x: entity.kinematicData.position.x - propellant.kinematicData.position.x,
			y: entity.kinematicData.position.y - propellant.kinematicData.position.y,
		};

		const physics = createPhysics();
		let distance = magnitude(fromPropellant.x, fromPropellant.y);
		let energy = physics.calculateEnergy(propellant.explosiveForce, distance);
		let speed = physics.velocityFromEnergy(energy, entity.mass);

		let total = Math.abs(fromPropellant.x) + Math.abs(fromPropellant.y);
		const velocityFractions = {
			x: fromPropellant.x / total,
			y: fromPropellant.y / total
		}

		entity.kinematicData.velocity.x += velocityFractions.x * speed;
		entity.kinematicData.velocity.y += velocityFractions.y * speed;
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

export function initializeNutrient(nutrient) {
	nutrients.push(nutrient);
}

export function resetGame() {
	tick = 0;
	entities = [];
	propellants = [];
}

setInterval(nextTick, 25);
