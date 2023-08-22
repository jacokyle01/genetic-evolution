import { NUTRIENT_RADIUS, ctx } from "./main.js";

export const createNutrient = (kinematicData, energy) => {
    const nutrient = {kinematicData, energy};

    Object.assign(nutrient, drawer(kinematicData));
    return nutrient;
}


function drawer(data) {
    return {
        draw: function() {
            ctx.beginPath();
			ctx.arc(data.position.x, data.position.y, NUTRIENT_RADIUS, 0, 2 * Math.PI);
			ctx.fillStyle = "green";
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.stroke();
        }
    }
}