import { createEntity } from './entity.js';

export const createPropellant = (kinematicData, mass, explosiveForce, explodesAt) => {
    return {
        ...createEntity(kinematicData, mass),
        explosiveForce,
        explodesAt
    }
}