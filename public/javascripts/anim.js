const canvas = document.querySelector("#cv");
const ctx = canvas.getContext("2d");
const bounds = canvas.getBoundingClientRect();
const circles = [];
let clicked = false;
const random = (min, max, positives) => {
    var num = Math.floor(Math.random() * max) + min; // this will get a number between 1 and 99;
    if (!positives) {
        num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    }
    return num;
}
const Circle = function(x, y, w, r, g, b) {
    this.x = x; 
    this.y = y;
    this.r = w;
    this.vel = {
        x: Math.sin(this.r / Math.PI * 180) * 2,
        y: Math.cos(this.r / Math.PI * 180) * 2
    };
    this.ttl = 180;
    this.timeAlive = 0;

    this.color = {
        r: r,
        g: g,
        b: b,
        a: 0.50
    };

    this.displayColor = "rgba(" + this.color.r + "," + this.color.g + "," + this.color.b + "," + this.color.a + ")";

    this.show = () => {
        ctx.beginPath();
        ctx.fillStyle = this.displayColor;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fill();
    }

    this.update = () => {
        this.x += this.vel.x;
        this.y += this.vel.y;
        if (this.x < this.r || this.x > canvas.width - this.r) {
            this.vel.x *= -1;
        }
        if (this.y < this.r || this.y > canvas.height - this.r) {
            this.vel.y *= -1;
        }
        this.timeAlive += 0.5;
        this.updateColor();
        this.show();
    };

    this.updateColor = () => {
        this.color.r += 1;
        this.color.g += 1;
        this.color.b += 1;
        if (this.color.r >= 255) {
            this.color.r = 0;
        }
        if (this.color.g >= 255) {
            this.color.g = 0;
        }
        if (this.color.g >= 255) {
            this.color.g = 0;
        }
        this.displayColor = "rgba(" + this.color.r + "," + this.color.g + "," + this.color.b + "," + this.color.a + ")";
        
    }
}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const mouse = {
    x: null,
    y: null
};

const animateCircles = (circles) => {
    for (let i = circles.length - 1; i >= 0; i--) {
        let circle = circles[i];
        circle.update();
        if (circle.timeAlive >= circle.ttl) {
            circles.splice(i, 1);
        }
    }
}

const drawCircles = (ev) => {
    clicked = true;
}
canvas.onmousemove = function (ev) {
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    let currentElement = this;
    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while (currentElement = currentElement.offsetParent);
    mouse.x = event.pageX - totalOffsetX;
    mouse.y = event.pageY - totalOffsetY;
}
const update = (time) => {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    canvas.onmousedown = function () {
        clicked = true;
    }
    canvas.onmouseup = function () {
        clicked = false;
    }
    if (clicked) {
        document.body.style.cursor = "none";
        circles.push(new Circle(mouse.x, mouse.y, random(10, 50, true), random(0, 255, true), random(0, 255, true), random(0, 255, true)));
    } else {
        document.body.style.cursor = "default";
    }

    if (circles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animateCircles(circles);
    requestAnimationFrame(update);
}

update();
