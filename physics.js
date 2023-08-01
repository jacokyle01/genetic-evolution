const pixelsToMeters = 0.1;

export const createPhysics = () => {
	return Object.assign(
        {}, 
        energyCalculator(), 
        velocityFromEnergyCalc()
        );
};

//energy: joules, distance: pixels
function energyCalculator() {
	return {
		calculateEnergy: function (energy, distance) {
			let meters = distance * pixelsToMeters;
			let inverse = 1 / Math.pow(meters, 2);
			return energy * inverse;
		},
	};
}

function velocityFromEnergyCalc() {
	return {
		velocityFromEnergy: function (energy, mass) {
			let temp = (2 * energy) / mass;
			return Math.sqrt(temp) / pixelsToMeters;
		},
	};
}

//////
