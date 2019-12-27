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
        this._size = 10*this.mass;
        this._maxSpeed = 1/this.mass;
        this._maxSteer = 0.025/this.mass;

        this._shape = {
            CIRCLE : "circle",
            SQUARE : "square",
            TRIANGLE : "triangle",
            RECTANGLE : "rectangle"
        }
    }

    render(ctx, shape=this.shape.TRIANGLE, colour="white", fill=false)
    {
        (fill) ? ctx.fillStyle = colour : ctx.strokeStyle = colour;
        ctx.save();
        Tools.rotate(ctx, this, Math.atan2(this.heading.y,this.heading.x))
        if(shape===this.shape.CIRCLE)
        {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI);
            (fill) ? ctx.fill() : ctx.stroke();
        }
        else if(shape===this.shape.SQUARE)
        {
            (fill) ? ctx.fillRect(this.position.x, this.position.y, this.size, this.size) :
                    ctx.strokeRect(this.position.x, this.position.y, this.size, this.size);
        }
        else if(shape===this.shape.TRIANGLE)
        {
            ctx.beginPath();
            ctx.moveTo(this.position.x + 4*this.size, this.position.y + this.size/2);
            ctx.lineTo(this.position.x, this.position.y - this.size);
            ctx.lineTo(this.position.x, this.position.y + 2*this.size);

            ctx.closePath();
            (fill) ? ctx.fill() : ctx.stroke();
        }
        
        else if(shape===this.shape.RECTANGLE)
        {
            (fill) ? ctx.fillRect(this.position.x, this.position.y, 2*this.size, this.size) :
                ctx.strokeRect(this.position.x, this.position.y, 2*this.size, this.size);
        }

        ctx.restore();
    }

    update()
    {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(Vector.VecScale(this.velocity, 1/this.mass));
        this.acceleration.scale(0);
    }

    seek(target)
    {
        if(target.x != null && target.y != null)
        {
            let desired = Vector.VecSub(target, this.position),
                distance = desired.mag;
                desired.normalise();
            if(distance>100)
            {
                desired.scale(this.maxSpeed);
            }
            else
            {
                desired.scale(distance*0.02);
            }

            let steerForce = Vector.VecSub(desired, this.velocity);
            steerForce.limit(this.maxSteer);
            this.addForce(steerForce);
        }
    }

    addForce(f)
    {
        this.acceleration.add(f);
    }

    get heading()
    {
        return Vector.VecNormalised(this.velocity);
    }

    get maxSpeed()
    {
        return this._maxSpeed;
    }

    get maxSteer()
    {
        return this._maxSteer;
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