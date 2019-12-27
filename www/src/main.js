import Boid from './Boid.js';

const WIDTH = 500,
    HEIGHT = 500;

let canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

ctx.canvas.width = WIDTH;
ctx.canvas.height = HEIGHT;

let shapes = {
    CIRCLE : "circle",
    SQUARE : "square",
    TRIANGLE : "triangle"
}

let boid = new Boid(WIDTH/2, HEIGHT/2,3);
console.log((boid.heading.y/boid.heading.x)*180/Math.PI);

function render()
{
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    boid.render(ctx,shapes.SQUARE,"white",false);
}

function update()
{
    boid.update();
}

function main()
{
    render();
    update();

    window.requestAnimationFrame(main);
}

main();