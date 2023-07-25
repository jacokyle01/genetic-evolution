//entites have the ability to move across the map
let nuts = 2;
class Entity {
    speed; 

    direction; //NESW
    posX;
    posY;

    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        
    }

    updatePosition() {
        switch (direction) {
            case "north":
                posY -= this.speed;
                break;
            case "east":
                posX += this.speed;
                break;
            case "south":
                posY -= this.speed;
                break;
            case "west":
                posX -= this.speed;
                break;
        }
    }

    draw() {
        
    }
}