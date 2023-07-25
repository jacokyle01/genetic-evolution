class Entity {

    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.direction = null;
        this.speed = 0;

    }

    setVelocity(speed, direction) {
        this.speed = speed;
        this.direction = direction;
    }



    updatePosition() {
        switch (this.direction) {
            case null:
                break;
            case "north":
                this.posY -= this.speed;
                break;
            case "east":
                this.posX += this.speed;
                break;
            case "south":
                this.posY -= this.speed;
                break;
            case "west":
                this.posX -= this.speed;
                break;
        }
    }

    draw() {
        
    }
}



//////////////////////////////////////////////////////





const button = document.querySelector('button');
const entities = [];



let tick = 0;
addEventListener(button, nextTick());

function nextTick() {
    tick++;
    entities.forEach(entity => entity.updatePosition());
    entities.forEach(entity => entity.draw());
}

function addEntity(posX, posY) {
    const entity = new Entity(posX, posY);
    entities.push(entity);
}

addEntity(10, 10);
const myEntity = entities[0];
console.log(myEntity);
myEntity.setVelocity(10, "north");
console.log(myEntity);
myEntity.updatePosition();
console.log(myEntity);  





