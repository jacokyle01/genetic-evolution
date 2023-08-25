import {
	createKinematicDataRaw,
	createPayloadInfo,
	createEntity,
} from "./entity.js";

function createRandomGenes() {
	let geneticInfo = [];
	for (let i = 0; i < 8; i++) {
		geneticInfo.push(Math.floor(Math.random() * 1000));
	}

	return geneticInfo;
}

function createEntityData(kinematicInfo, facing, geneticInfo) {
	let entityMass = (geneticInfo[0] % 990) + 10;
	let ejectionInterval = (geneticInfo[1] % 95) + 5;
	let ejectionVelocity = (geneticInfo[2] % 40) + 10;
	let payloadMass = (geneticInfo[3] % 990) + 10;
	let explodesIn = (geneticInfo[4] % 90) + 10;
	let explosiveForce = (geneticInfo[5] % 990) + 10;
    let matingThreshold = (geneticInfo[6] % 80) + 20;
    let energyTransfer = geneticInfo[7] % 90;


	return [
		kinematicInfo,
		entityMass,
		facing,
        matingThreshold,
        energyTransfer,
		createPayloadInfo(
			ejectionInterval,
			ejectionVelocity,
			[payloadMass, explosiveForce],
			explodesIn
		),
		geneticInfo
	];
}



const genes = createRandomGenes();
const entityData = createEntityData(
	createKinematicDataRaw(0, 0, 0, 0),
	180,
	genes
);

const entity = createEntity(...entityData);
console.log(entity);
