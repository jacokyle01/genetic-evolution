const pixelsToMeters = 0.1;
//TODO separate gamePhysics module to handle explosions, collosions, etc...

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
			if (Math.abs(distance) < 1) {
				return 0;
			}
			let meters = distance * pixelsToMeters;
			let inverse = 1 / Math.pow(meters, 2);
			return energy * inverse;
		},
	};
}

//return: px/second
function velocityFromEnergyCalc() {
	return {
		velocityFromEnergy: function (energy, mass) {
			let temp = (2 * energy) / mass;
			return Math.sqrt(temp) / pixelsToMeters;
		},
	};
}

//////
