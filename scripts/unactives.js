const canvDec = document.getElementById("canvas-decoration");
const WIDTHDEC = 500;
const HEIGHTDEC = 500;
canvDec.width = WIDTHDEC;
canvDec.height = HEIGHTDEC;
const ctxDec = canvDec.getContext("2d");
ctxDec.mozImageSmoothingEnabled = false;
ctxDec.msImageSmoothingEnabled = false;
ctxDec.imageSmoothingEnabled = false;

class unactiveItem extends Actor{
    static list = {};
    static types = ["rafflesia", "grass", "flower", "bush", "flower2"];
    constructor(type, x = hero.x + Math.random()*WIDTH-WIDTH/2, y = Math.random()*HEIGHT*2){
        super(Math.random(),x,y,16,16);
        this.type = type;
        this.img = Img[type];
        this.width = 56;
        this.height = 56;
        unactiveItem.list[this.id] = this;
    }
    draw(){
        ctxDec.clearRect(0, 0, WIDTHDEC, HEIGHTDEC);
        ctxDec.save();
        let x = this.x - hero.x + WIDTH/2 - this.width/2;
        let y = this.y - hero.y + HEIGHT/2 - this.height/2;
        ctxDec.drawImage(this.img,0,0, this.img.width,this.img.height,x,y,this.width,this.height);
        ctxDec.restore();
    }
    update(){
        this.draw();
        if (this.x < hero.x-WIDTH/2) {
            delete unactiveItem.list[this.id];
        }
    }
    static generate(point){
        for (let i = 0; i < Math.floor(Math.random()*5)+5; i++) {
            let number = Math.floor(Math.random()*unactiveItem.types.length);
            let type = unactiveItem.types[number];
            let x = Math.random()*WIDTH+point-WIDTH/2;
            new unactiveItem(type, x);
        }
    }
    static update(){
        let keys = Object.keys(unactiveItem.list);
        for (let key of keys) {
            let unactive = unactiveItem.list[key];
            unactive.update();
        }
    }
}

unactiveItem.update();