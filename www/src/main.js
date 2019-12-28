import Boid from './Boid.js';
import Vector from './Vector.js';
import Path from './Path.js';

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

let shapeArr = [shapes.CIRCLE, shapes.SQUARE, shapes.TRIANGLE, shapes.RECTANGLE],
    count = 0,
    boidArr = [];

document.addEventListener("click", function(e){
    boidArr.push(new Boid(e.clientX, e.clientY,0.3));
});

let p1 = new Path(new Vector(0,100), new Vector(WIDTH,400));

function render()
{
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    p1.render(ctx);
    boidArr.forEach(b => b.render(ctx));
}

function update()
{
    boidArr.forEach(b => {
        if(count % 100 === 0)
        {
            b.wander();
        }

        let norm = Vector.VecGetNormalPoint(p1.start, p1.end,b.predictedPos),
            dist = Vector.VecDist(b.predictedPos, norm);
        if(dist>5*p1.radius)
        {
            b.seek(norm);
        }
        b.stayWithinWalls(WIDTH,HEIGHT);
        b.update();
    });

    count++;
}

function main()
{
    render();
    update();

    window.requestAnimationFrame(main);
}

main();