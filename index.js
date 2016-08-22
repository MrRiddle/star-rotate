const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

/*变量*/
const starNum = 3000;
var stars = [];
var cx = canvas.width / 2;
var cy = canvas.height / 2;
var range = Math.sqrt(canvas.width**2 + canvas.height**2);
var rotateXD = 1, rotateZD = 1;

/*自定义函数*/
function Star(){
    this.x = range * Math.random() + (canvas.width - range) / 2;
    this.y = range * Math.random() + (canvas.height - range) / 2;
    this.r = 0.5 + Math.random() / 1.2;
    this.z = range * Math.random();
    this.alpha = 0.2 + Math.random() * 0.8;
    this._alphaDirection = 1;
}

Star.prototype._getMaxAlpha = function(){
    return (0.2 + this.z / range * 0.8);
}

Star.prototype.draw = function(){
    context.beginPath();
    context.fillStyle=`rgba(255, 255, 255, ${this.alpha})`;
    context.arc(this.x, this.y, this.r, 0, Math.PI*2, true); 
    context.closePath();
    context.fill();
}

Star.prototype.flash = function(){
    if (this._alphaDirection > 0) {
        if (this.alpha < this._getMaxAlpha() ) {
            this.alpha += 0.005;
        } else {
            this._alphaDirection = -1;
        }
    } else {
        if (this.alpha > 0.2 ) {
            this.alpha -= 0.002;
        } else {
            this._alphaDirection = 1;
        }
    }
}

Star.prototype.rotateX = function(){
    const speed = 0.0005 * rotateXD;

    var dg =  Math.random() * 2 * speed + speed;

    var theta = Math.atan2((this.y-cy), (this.x-cx));
    var r = Math.sqrt((this.x-cx)**2 + (this.y-cy)**2);
    var x = r * Math.cos(theta + dg);
    var y = r * Math.sin(theta + dg);
    this.x = (x + cx);
    this.y = (y + cy);

}

Star.prototype.rotateZ = function(){
    const speed = 0.0005 * rotateZD;

    var dg =  Math.random() * 2 * speed + speed;
    var cz = range / 2;

    var theta = Math.atan2((this.z-cz), (this.x-cx));
    var r = Math.sqrt((this.x-cx)**2 + (this.z-cz)**2);
    var x = r * Math.cos(theta + dg);
    var z = r * Math.sin(theta + dg);
    this.x = (x + cx);
    this.z = (z + cz);

}

window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

function MouseWheelDealer(callback){
    this.direct = 1;//>0上
    this.callback = callback;
    this.sleep = false;
}
MouseWheelDealer.prototype.delay = 500;
MouseWheelDealer.prototype.wheelRoll = function(e){
    var wheelDelta = e.wheelDelta;
    if(wheelDelta*this.direct > 0){
        if(!this.sleep){
            this.callback(this.direct);
            this.sleep = true;
            setTimeout(() => {
                this.sleep = false;
            },this.delay);
        }
    }else{
        this.direct = -this.direct;
        this.callback(this.direct);
        this.sleep = true;
        setTimeout(() => {
            this.sleep = false;
        },this.delay);
    }
}

/*事件监听*/
// canvas.addEventListener('mousemove',e => {
//     var bbox = canvas.getBoundingClientRect(); 
//     cx = e.pageX - bbox.left *(canvas.width / bbox.width);
//     cy = e.pageY - bbox.top * (canvas.height / bbox.height);
// });

var mouseWheelDealer = new MouseWheelDealer(direct => {
    if(direct > 0){
        scrollUp();
    }else{
        scrollDown();
    }
});
canvas.addEventListener('mousewheel',e => {
    mouseWheelDealer.wheelRoll(e);
});

/*主函数*/
function init(){
    for(var i = 0; i < starNum; i++){
        stars.push(new Star());
    }
}

function render(){
    clear();
    stars.forEach(e => {
        e.rotateX();
        e.rotateZ();
        e.flash();
        e.draw();
    });
    requestAnimFrame(render);
}

function scrollUp(){
    rotateZD = 1;
}

function scrollDown(){
    rotateZD = -1;
}

function clear(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

init();
render();
requestAnimFrame(render);
