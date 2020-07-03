let Img = {
    player: new Image(),
    enemy: new Image(),
    attackUpgrade: new Image(),
    defenceUpgrade: new Image(),
    magicUpgrade: new Image(),
    trap: new Image(),
    mapPart: new Image(),
    flower: new Image(),
    flower2: new Image(),
    grass: new Image(),
    rafflesia: new Image(),
    bush: new Image()
};
Img.player.src = "img/cat.png";
Img.enemy.src = "img/grayCat.png";
Img.attackUpgrade.src = "img/upgradeSword.png";
Img.defenceUpgrade.src = "img/upgradeShield.png";
Img.magicUpgrade.src = "img/upgradeMagic.png";
Img.trap.src = "img/trap.png";
Img.mapPart.src = "img/mapPart.png";
Img.rafflesia.src = "img/rafflesia.png";
Img.flower.src = "img/flower.png";
Img.grass.src = "img/grass.png";
Img.bush.src = "img/bush.png";
Img.flower2.src = "img/flower2.png";

class Actor {
    constructor(id, x = 5, y = HEIGHT/2, width = 5, height = 5) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(){
        ctx.save();
        let x = this.x - hero.x + WIDTH/2 - this.width/2;
        let y = this.y - hero.y + HEIGHT/2 - this.height/2;
        ctx.drawImage(this.img,0,0, this.img.width,this.img.height,x,y,this.width,this.height);
        ctx.restore();
    }

    rectangleCollision(rect2){
        if (this.x < rect2.x + rect2.width &&
            this.x + this.width > rect2.x &&
            this.y < rect2.y + rect2.height &&
            this.y + this.height > rect2.y) {
            return true;
        }
        return false;
    }

    distanceBetween(dot2){
        return Math.sqrt((this.x - dot2.x)**2 + (this.y - dot2.y)**2);
    }
}

class Entity extends Actor{
    constructor(id, x = 5, y = HEIGHT/2, speedX = 0, speedY = 0, width = 5, height = 5) {
        super(id, x, y, width, height);
        this.speedX = speedX;
        this.speedY = speedY;
    }

    move(){
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

class Racer extends Entity {
    static list = {};
    constructor(id, y){
        super(id, 5, y, 5, 0, 72, 72);
        this.score = 0;
        this.defence = 0;
        this.attack = 0;
        this.magic = 0;
        this.maxSpeed = 5;
        Racer.list[id] = this;
    }

    move(){
        this.updateSpeed();
        super.move();
    }

    draw(){
        ctx.save();
        let x = this.x - hero.x + WIDTH/2 - this.width/2;
        let y = this.y - hero.y + HEIGHT/2 - this.height/2;
        let mult = 0;
        if (this.speedX <= 0) {
            mult = 1;
        } else if (this.speedX > 0){
            mult = 0;
        }
        if (this.speedY < 0 && this.speedX == 0) {
            mult = 2;
        } else if (this.speedY > 0 && this.speedX == 0) {
            mult = 3;
        }
        ctx.drawImage(this.img,0,this.img.height/4*mult, this.img.width,this.img.height/4,x,y,this.width,this.height);
        ctx.restore();
    }
}

class Hero extends Racer{
    constructor(id){
        super(id, HEIGHT/2);
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.img = Img.player;
    }

    updatePressedKeys(event, bool){
        let key = event.keyCode;
        if (key === 87) {
            this.pressingUp = bool;
        } else if (key === 83) {
            this.pressingDown = bool;
        }
        if (key === 68){
            this.pressingRight = bool;
        } else if (key === 65) {
            this.pressingLeft = bool;
        }
    }

    updateSpeed(){
        if (this.pressingLeft) {
            this.speedX = 0;
        } else if (this.pressingRight) {
            this.speedX = this.maxSpeed;
        }

        if (this.pressingUp) {
            this.speedY = -1 * this.maxSpeed;
        } else if (this.pressingDown) {
            this.speedY = this.maxSpeed;
        } else {
            this.speedY = 0;
        }
    }

    update(){
        hero.move();
        hero.draw();
        if (hero.speedX !== 0 || hero.speedY !== 0) {
            unactiveItem.update();
        }
    }
}

class Enemy extends Racer {
    static list = {};
    constructor(id, y) {
        super(id, y);
        this.img = Img.enemy;
        this.target = {
            x: this.x + 500,
            y: this.y
        }
        Enemy.list[id] = this;
    }

    updateSpeed(){
        let nearestUpgrade = Upgrade.findNearest(this);
        if (nearestUpgrade && nearestUpgrade.x >= this.x) {
            this.target.x = nearestUpgrade.x;
            this.target.y = nearestUpgrade.y;
        }
        
        if (this.target.x +3 > this.x && this.target.x - 3 < this.x && this.target.y + 3 > this.x && this.target.y - 3 <this.x) {
            this.target.x = this.x + 500;
            this.target.y = 500 + Math.random()*500;
        }

        if (this.target.x +3 > this.x && this.target.x - 3 < this.x) {
            this.speedX = 0;
        } else {
            this.speedX = this.maxSpeed;
        }

        if (this.target.y + 3 > this.y && this.target.y - 3 < this.y) {
            this.speedY = 0;
        } else if (this.target.y < this.y) {
            this.speedY = -1 * this.maxSpeed;
        } else if (this.target.y > this.y) {
            this.speedY = this.maxSpeed;
        }
    }

    update(){
        this.draw();
        this.move();
    }

    static generate(){
        for (let i=0; i<5; i++) {
            let y = Math.random()*HEIGHT*2;
            let id = Math.random();
            new Enemy(id, y);
        }
    }

    static update(){
        let enemies =  Object.values(Enemy.list);
        for (let enemy of enemies) {
            enemy.update();
        }
    }
}

class WayItem extends Actor{
    static list = {};

    constructor(){
        let id = Math.random();
        let width = 48;
        let height = 48;
        let x = Math.random()*WIDTH+hero.x;
        let y = Math.random()*HEIGHT;
        super(id, x, y, width, height);
        this.timeLeft = 120;
        this.toDelete = false;
        WayItem.list[this.id] = this;
    }

    update(){
        this.timeLeft -= 1;
        this.draw();
        let racers = Object.values(Racer.list);
        for (let entity of racers) {
            if (!this.toDelete) {
                let collided = this.rectangleCollision(entity);
                if (collided) {
                    this.onCollided(entity);
                }
            }
        };
        if (this.timeLeft <= 0) {
            this.toDelete = true;
        }
        if (this.toDelete) {
            delete WayItem.list[this.id];
        }
    }

    static update(){
        WayItem.generate();
        let items = Object.values(WayItem.list);
        for (let item of items) {
            item.update();
        }
    }

    static generate(){
        if (frames % 75 === 0) {
            if (Math.random() < 0.5){
                new Upgrade();
            } else {
                new Trap();
            }
        }
    }
}

class Upgrade extends WayItem{
    static list = {};
    constructor(){
        super();
        let random = Math.floor(Math.random()*3);
        if (random === 0) {
            this.type = "magic";
            this.img = Img.attackUpgrade;
        } else if (random === 1) {
            this.type = "defence";
            this.img = Img.defenceUpgrade;
        } else {
            this.type = "attack";
            this.img = Img.attackUpgrade;
        }
        Upgrade.list[this.id] = this;
    }

    onCollided(player){
        if (this.type === "magic") {
            player.magic++;
        } else if (this.type === "defence") {
            player.defence++;
        } else if (this.type === "attack") {
            player.attack++;
        }
        this.toDelete = true;
    }

    static findNearest(entity){
        let nearestDistance = 9999999;
        let nearest;
        let upgrades = Object.values(Upgrade.list);
        for (let upgrade of upgrades) {
            let dis = upgrade.distanceBetween(entity);
            if (dis < nearestDistance) {
                nearestDistance = dis;
                nearest = upgrade;
            }
        };
        if (nearestDistance <= 300) {
            return nearest;
        }
    }
}

class Trap extends WayItem{
    constructor(){
        super();
        this.img = Img.trap;
    }

    onCollided(player){
        player.score -= 20;
        this.toDelete = true;
    }
}