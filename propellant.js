import { createEntity } from './entity.js';

export const createPropellant = (kinematicData, explosiveForce, explodesAt) => {
    return {
        ...createEntity(kinematicData),
        explosiveForce,
        explodesAt
    }
}