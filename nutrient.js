import { ctx } from "./main.js";

export const createNutrient = (kinematicData) => {
    const nutrient = {kinematicData};

    Object.assign(nutrient, drawer(kinematicData));
    return nutrient;
}


function drawer(data) {
    return {
        draw: function() {
            ctx.beginPath();
			ctx.arc(data.position.x, data.position.y, 10, 0, 2 * Math.PI);
			ctx.fillStyle = "green";
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.stroke();
        }
    }
}