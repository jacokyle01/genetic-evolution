import { ctx, PROPELLANT_WIDTH } from "./main.js";

import {mover, directionChanger } from "./entity.js";

export const createPropellant = (
	kinematicData,
	mass,
	explosiveForce,
	explodesAt
) => {
	const tnt = {
		kinematicData,
		mass,
		explosiveForce,
		explodesAt,
	};
	Object.assign(tnt, mover(kinematicData), directionChanger(kinematicData), drawer(kinematicData));
	return tnt;
};

function drawer(data) {
	return {
		draw: function () {
            const x = data.position.x;
            const y = data.position.y;
            const width = PROPELLANT_WIDTH;

			ctx.fillStyle = "red";
			ctx.beginPath();
			ctx.fillRect(x - width/2, y - width/2, width, width);

			ctx.stroke();
		},
	};
}
