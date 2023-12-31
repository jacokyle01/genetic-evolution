import {
	createEntity,
	createKinematicDataRaw,
	createPayloadInfo,
} from "./entity.js";

import { createPropellant } from "./propellant.js";

import { createPhysics } from "./physics.js";

import { createNutrient } from "./nutrient.js";

import { distance, magnitude, midpoint } from "./maths.js";

import { createEntityData, mergeGeneticInfo } from "./genetics.js";

export let entities = [];
export let propellants = [];
export let nutrients = [];

const STARTING_ENTITIES = 3;
const NUM_NUTRIENTS = 20;

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

	//check for nutrient collisions HERE

	entities.forEach((entity) => {
		nutrients = nutrients.filter((nutrient) => {
			let distanceApart = distance(
				entity.kinematicData.position.x,
				entity.kinematicData.position.y,
				nutrient.kinematicData.position.x,
				nutrient.kinematicData.position.y
			);

			if (isFoodCollision(distanceApart)) {
				entity.energy += nutrient.energy;
				return false;
			}

			return true;
		});
	});

	regulateNutrients();

	//assign targets
	entities.forEach((entity) => {
		if (entity.energy > entity.matingThreshold) {
			entity.targeting = "entity";
		} else {
			entity.targeting = "nutrient";
		}
	});

	//calculate targets
	const breeding = entities.filter((entity) => entity.targeting == "entity");

	entities.forEach((entity) => {
		if (entity.targeting == "nutrient" || breeding.length < 2) {
			//find and target nearest nutrient

			let closest = nutrients.reduce((closest, next) => {
				let distanceClosest = distance(
					closest.kinematicData.position.x,
					closest.kinematicData.position.y,
					entity.kinematicData.position.x,
					entity.kinematicData.position.y
				);
				let distanceNext = distance(
					next.kinematicData.position.x,
					next.kinematicData.position.y,
					entity.kinematicData.position.x,
					entity.kinematicData.position.y
				);
				return distanceClosest > distanceNext ? next : closest;
			});
			entity.target(closest);
		} else if (entity.targeting == "entity") {
			//find and target nearest potential mate
			const potentialMates = breeding.filter(
				(breedingEntity) => breedingEntity != entity
			);
			let closest = potentialMates.reduce((closest, next) => {
				let distanceClosest = distance(
					closest.kinematicData.position.x,
					closest.kinematicData.position.y,
					entity.kinematicData.position.x,
					entity.kinematicData.position.y
				);
				let distanceNext = distance(
					next.kinematicData.position.x,
					next.kinematicData.position.y,
					entity.kinematicData.position.x,
					entity.kinematicData.position.y
				);
				return distanceClosest > distanceNext ? next : closest;
			});
			entity.target(closest);
		}
	});

	//handle entity-on-entity collisions here.

	//console.log(breeding.length);

	while (breeding.length > 1) {
		const entity = breeding[0];

		for (let i = 1; i < breeding.length; i++) {
			//console.log(i);
			const next = breeding[i];

			let distanceApart = distance(
				entity.kinematicData.position.x,
				entity.kinematicData.position.y,
				next.kinematicData.position.x,
				next.kinematicData.position.y
			);

			if (isEntityCollision(distanceApart)) {
				console.log("collided");
				entity.targeting = null;
				next.targeting = null;

				entity.energy = 20;
				next.energy = 20;

				const child = createChild(entity, next);
				initializeEntity(child);

				breeding.splice(i, 1);
				break;
			}
		}

		breeding.shift();
	}

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

	entities.forEach((entity) => entity.move());
	propellants.forEach((propellant) => propellant.move());

	//affect friction here
	affectFriction();

	animate();
	// entities.forEach((entity) => {
	// 	console.log(entity.kinematicData.position.x + ", " + entity.kinematicData.position.y)
	//})
	//entities.forEach((entity) => console.log(entity));
}

export function createChild(entity1, entity2) {
	const geneticInfo = mergeGeneticInfo(
		entity1.geneticInfo,
		entity2.geneticInfo
	);
	const position = midpoint(
		entity1.kinematicData.position.x,
		entity1.kinematicData.position.y,
		entity2.kinematicData.position.x,
		entity2.kinematicData.position.y
	);

	const kinematicData = { position, velocity: { x: 0, y: 0 } };

	//console.log(kinematicData);

	let transfer1 = entity1.energy * (entity1.energyTransfer / 100)
	let transfer2 = entity2.energy * (entity2.energyTransfer / 100)

	entity1.energy -= transfer1;
	entity2.energy -= transfer2;

	const childData = createEntityData(kinematicData, 0, geneticInfo);
	console.log(childData);
	const child = createEntity(...childData);

	child.energy = transfer1 + transfer2;
	return child;
}

function affectFriction() {
	entities.forEach((entity) => {
		entity.kinematicData.velocity.x *= 0.9;
		entity.kinematicData.velocity.y *= 0.9;
	});

	propellants.forEach((entity) => {
		entity.kinematicData.velocity.x *= 0.9;
		entity.kinematicData.velocity.y *= 0.9;
	});
}

function isFoodCollision(distance) {
	return distance < NUTRIENT_RADIUS + ENTITY_RADIUS;
}

function isEntityCollision(distance) {
	return distance < ENTITY_RADIUS * 2;
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

	return createNutrient(createKinematicDataRaw(x, y, 0, 0), 1);
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
			y: fromPropellant.y / total,
		};

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
