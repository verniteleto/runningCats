const canvas = document.getElementById("canvas");
const WIDTH = 500;
const HEIGHT = 500;
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");
ctx.mozImageSmoothingEnabled = false;	//better graphics for pixel art
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
let frames = 0;

document.onkeydown = function(event){
    hero.updatePressedKeys(event, true);
}

document.onkeyup = function(event) {
    hero.updatePressedKeys(event, false);
}

let hero = new Hero(1);
let generatedX = WIDTH/2;
unactiveItem.generate(generatedX);
generatedX += WIDTH/2;
Enemy.generate();
setInterval(() => {
    frames++;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    let y = HEIGHT/2 - hero.y - 500;
    let img = Img.mapPart;
    ctx.drawImage(img,0,0,img.width,img.height,0,y,img.width*2,img.height*2);
    if (hero.x >= generatedX - WIDTH/2) {
        unactiveItem.generate(generatedX+WIDTH/2);
        generatedX += WIDTH/2;
    }
    hero.update();
    Enemy.update();
    WayItem.update();
}, 40);