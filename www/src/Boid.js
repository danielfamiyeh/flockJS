import Vector from './Vector.js';
import Tools from './Tools.js';

export default class Boid
{
    constructor(x, y, mass=1)
    {
        this._position = new Vector(x,y);
        this._acceleration = new Vector(0,0);
        this._velocity = new Vector(0,0);
        this._mass = mass;
        this._size = 5*this.mass;

        this._shape = {
            CIRCLE : "circle",
            SQUARE : "square",
            TRIANGLE : "triangle"
        }
    }

    render(ctx, shape=this.shape.CIRCLE, colour="white", fill=false)
    {
        (fill) ? ctx.fillStyle = colour : ctx.strokeStyle = colour;
        ctx.save();
        Tools.rotate(ctx, this, Math.atan2(this.velocity.y,this.velocity.x))
        if(shape===this.shape.CIRCLE)
        {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 5*this.mass, 0, 2*Math.PI);
            (fill) ? ctx.fill() : ctx.stroke();
        }
        if(shape===this.shape.SQUARE)
        {
            (fill) ? ctx.fillRect(this.position.x, this.position.y, 5*this.mass, 5*this.mass) :
                    ctx.strokeRect(this.position.x, this.position.y, 5*this.mass, 5*this.mass);
        }
        if(shape===this.shape.TRIANGLE)
        {
            ctx.beginPath();
            ctx.moveTo(this.position.x + 4*this.size, this.position.y + this.size/2);
            ctx.lineTo(this.position.x, this.position.y - this.size);
            ctx.lineTo(this.position.x, this.position.y + 2*this.size);

            ctx.closePath();
            (fill) ? ctx.fill() : ctx.stroke();
        }

        ctx.restore();
    }

    update()
    {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.scale(0);
    }

    get heading()
    {
        return Vector.VecNormalised(this.velocity);
    }

    get mass()
    {
        return this._mass;
    }

    get size()
    {
        return this._size;
    }

    get position()
    {
        return this._position;
    }

    get velocity()
    {
        return this._velocity;
    }

    get acceleration()
    {
        return this._acceleration;
    }

    get shape()
    {
        return this._shape;
    }
}