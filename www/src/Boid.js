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
        this._maxSpeed = 0.5/this.mass;
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

    wander()
    {
        let wanderAngle = Math.round(Math.random() * 360);
        wanderAngle *= Math.PI/180;
        let newX = this.position.x + 200 * Math.cos(wanderAngle),
            newY = this.position.y + 200 * Math.sin(wanderAngle);
        let t = new Vector(newX, newY);

        this.seek(t);
    }

    stayWithinWalls(WIDTH, HEIGHT)
    {
        if(this.position.x < 4*this.size)
        {
            let targetVec = new Vector(this.maxSpeed, this.velocity.y),
                steer = Vector.VecSub(targetVec, this.velocity);
                steer.limit(this.maxSteer);
                this.addForce(steer);
        }
        if((WIDTH-this.position.x) < 4*this.size)
        {
            let targetVec = new Vector(-this.maxSpeed, this.velocity.y),
                steer = Vector.VecSub(targetVec, this.velocity);
                steer.limit(this.maxSteer);
                this.addForce(steer);
        }
        if(this.position.y < 8*this.size)
        {
            let targetVec = new Vector(this.velocity.x, this.maxSpeed),
                steer = Vector.VecSub(targetVec, this.velocity);
                steer.limit(this.maxSteer);
                this.addForce(steer);
        }
        if((HEIGHT-this.position.y) < 8*this.size)
        { 
            let targetVec = new Vector(this.velocity.x, -this.maxSpeed),
                steer = Vector.VecSub(targetVec, this.velocity);
                steer.limit(this.maxSteer);
                this.addForce(steer);  
        }
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
            return steerForce;
           // this.addForce(steerForce);
        }
    }
    
    flee(target)
    {
        if(target.x != null && target.y != null)
        {
            let desired = Vector.VecSub(target, this.position),
                distance = desired.mag;
                desired.normalise();
                desired.scale(-1);
            if(distance<100)
            {
                desired.scale(this.maxSpeed);
            }
            else
            {
                desired.scale(0);
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

    separate(boidArr)
    { 
        var count = 0,
            sumVec = new Vector(0,0);
        for(let i=0; i<boidArr.length; i++)
        {
            let dist = Vector.VecDist(this.position, boidArr[i].position);
            if(dist > 0 && dist < 6*this.size)
            {
                count++;
                let vecAway = Vector.VecSub(this.position, boidArr[i].position);
                vecAway.normalise();
                vecAway.scale(1/dist);
                sumVec.add(vecAway);
            }
        }

        if(count > 0)
        {
            sumVec.scale(1/count);
            sumVec.normalise();
            sumVec.scale(this.maxSpeed);

            var steerVec = Vector.VecSub(sumVec, this.velocity);
            steerVec.limit(this.maxSteer);
            return steerVec;
           // this.addForce(steerVec);
        }
    }

    cohesion(boidArr)
    {
        var avgPos = new Vector(0,0),
            count = 0;
        
        for(let i=0; i<boidArr.length; i++)
        {
            let dist = this.position.dist(boidArr[i].position);
            if(dist > 0 && dist < 20*this.size)
            {
                avgPos.add(boidArr[i].position);
                count++;
            }

            if(count>0)
            {
                avgPos.scale(1/count);
                return this.seek(avgPos);
            }
            else
            {
                return avgPos;
            }
        }
    }

    align(boidArr)
    {
        var sumVec = new Vector(0,0),
            count = 0;
        
        for(let i=0; i<boidArr.length; i++)
        {
            let dist = this.position.dist(boidArr[i].position);
            if(dist >0 && dist < 20*this.size)
            {
                sumVec.add(boidArr[i].velocity);
                count++;
            }
        }
        if(count > 0)
        {
            sumVec.scale(1/count);
            let steer = Vector.VecSub(sumVec, this.velocity);
            steer.limit(this.maxSteer);
            return steer;
        }
    }

    flock(boidArr, target=new Vector(null,null))
    {
        
        
        let separation = this.separate(boidArr),
            cohesion = this.cohesion(boidArr),
            alignment = this.align(boidArr),
            seeking = this.seek(target);
            
        if(separation != undefined)
        {
            separation.scale(1);
            this.addForce(separation);
        }
        
        if(seeking != undefined)
        {
            seeking.scale(0.5);
            this.addForce(seeking);
        }

        if(cohesion != undefined)
       {
            cohesion.scale(0.2);
            this.addForce(cohesion);
        }

        if(alignment != undefined)
       {
            alignment.scale(0.5);
            this.addForce(alignment);
        }
    }

    //Getters and Setters
    get predictedPos()
    {
        let pos = new Vector(this.position.x, this.position.y);
        let dir = this.heading;
        dir.scale(25);
        pos.add(dir);

        return pos;
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