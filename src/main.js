import Boid from './Boid.js';
import Vector from './Vector.js';
import Path from './Path.js';

const WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

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
    target = new Vector(null, null),
    boidArr = [];

document.body.addEventListener("keydown", function(e){
    if(e.keyCode == 122)
    {
        WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

        canvas = document.getElementById("canvas"),
        
        ctx = canvas.getContext("2d");
        ctx.canvas.width = WIDTH;
        ctx.canvas.height = HEIGHT;
    }
});

canvas.addEventListener("mousedown", function(e){
   target = new Vector(e.clientX, e.clientY);
});

canvas.addEventListener("mouseup", function(e){
    target = new Vector(null, null);
 });

let p1 = new Path(new Vector(0,100), new Vector(WIDTH,400));

for(let i=0; i<550; i++)
{
    let mass = Math.random() * 0.2 + 0.15,
        x = Math.random() * WIDTH,
        y = Math.random() * HEIGHT;
    boidArr.push(new Boid(x,y,mass));
}

function render()
{
    if(count % 1 === 0) ctx.clearRect(0,0,WIDTH,HEIGHT);
  //  p1.render(ctx);
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
        if(dist>10*p1.radius)
        {
           // b.seek(norm);
        }
        b.flock(boidArr, target);
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