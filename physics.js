const pixelsToMeters = 0.1;

export const createPhysics = () => {
    return Object.assign({}, forceCalculator())
}

//force: joules, distance: pixels
function forceCalculator() {
    return { 
        calculateForce: function(force, distance) {
            let meters = distance * pixelsToMeters;
            let inverse = 1 / Math.pow(meters, 2);
            return force * inverse;
        }

    }
}


const physics = createPhysics();
console.log(physics.calculateForce(9, 30));