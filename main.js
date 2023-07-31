const button = document.querySelector("button");
const entities = [];

let tick = 0;
addEventListener(button, nextTick());

function nextTick() {
	tick++;
	entities.forEach((entity) => entity.update());
}

