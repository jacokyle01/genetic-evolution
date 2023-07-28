const button = document.querySelector('button');
const entities = [];

let tick = 0;
addEventListener(button, nextTick());

function nextTick() {
    tick++;
    entities.forEach(entity => entity.update());
}

function mover (data) {
    return {
        move: function() {
            switch (data.direction) {
                case "north":
                    data.y -= data.speed;
                    break;
                case "east":
                    data.x += data.speed;
                    break;
                case "south":
                    data.y -= data.speed;
                    break;
                case "west":
                    data.x -= data.speed;
                    break;
                default:
                    break;
            }
        }
    }
}

const createEntity = (kinematicData) => {
    const entity = {
        kinematicData
    }
    Object.assign(entity, mover(kinematicData));
    return entity;
}

const createKinematicData = (x, y, speed, direction) => {
    return {x, y, speed, direction};
}

const data = createKinematicData(0, 0, 10, "north");
const entity = createEntity(data);
entity.move();






