import Boid from './Boid.js';
import Vector from './Vector.js';

const WIDTH = 500,
    HEIGHT = 500;

let canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

ctx.canvas.width = WIDTH;
ctx.canvas.height = HEIGHT;

let shapes = {
    CIRCLE : "circle",
    SQUARE : "square",
    TRIANGLE : "triangle",
    RECTANGLE : "rectangle"
}

let shapeArr = [shapes.CIRCLE, shapes.SQUARE, shapes.TRIANGLE, shapes.RECTANGLE];

let target = new Vector(null, null);
document.addEventListener("click", function(e){
    target = new Vector(e.clientX, e.clientY);
});

let boid = new Boid(WIDTH/2, HEIGHT/2,0.7);
console.log((boid.heading.y/boid.heading.x)*180/Math.PI);

function render()
{
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    boid.render(ctx,shapes.TRIANGLE,"white",false);
}

function update()
{
    boid.seek(target);
    boid.update();
}

function main()
{
    render();
    update();

    window.requestAnimationFrame(main);
}

main();