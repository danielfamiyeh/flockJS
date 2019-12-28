export default class Vector
{

    //Static Methods
    static genVec()
    {
        let x = Math.random() * 2 - 1;
        let y = Math.random() * 2 - 1;
        let newVec = new Vector(x,y);
        newVec.normalise();
        return newVec;
    }

    static VecAdd(v1, v2)
    {
        return new Vector((v1.x+v2.x), (v1.y+v2.y));
    }

    static VecSub(v1, v2)
    {
        return new Vector((v1.x-v2.x), (v1.y-v2.y));
    }

    static VecScale(v, lambda)
    {
        return new Vector((v.x*lambda), (v.y*lambda));
    }

    static VecDot(v1, v2)
    {
        return ((v1.x*v2.x) + (v1.y*v2.y));
    }

    static VecDist(v1, v2)
    {
        return Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
    }

    static VecDist(v1, v2)
    {
        return Math.sqrt((v2.x-v1.x)**2 + (v2.y-v1.y)**2);
    }

    static VecNormalised(v)
    {
        return new Vector((v.x/v.mag), (v.y/v.mag));
    }

    static VecPolar2Cartesian(r,theta)
    {
        return new Vector(r*Math.cos(theta), r*Math.sin(theta));
    }

    static VecGetNormalPoint(a,b,p)
    {
        let ap = Vector.VecSub(p,a);
        let ab = Vector.VecSub(b,a);
        ab.normalise();
        ab.scale(Vector.VecDot(ap,ab));
        let normal = Vector.VecAdd(a,ab);
        return normal;
    }

    constructor(x,y)
    {
        this._x = x;
        this._y = y;
    }

    //Object methods
    normalise()
    {
        this.scale(1/this.mag);
    }

    dot(vec)
    {
        return ((this._x * vec.x) + (this._y * vec.y));
    }

    angleBetween(vec)
    {
        return Math.acos(Vector.VecNormalised(this).dot(Vector.VecNormalised(vec)));
    }

    dist(vec)
    {
        return Math.sqrt((vec.x - this._x)**2 + (vec.y - this._y)**2);
    }

    limit(val)
    {   
        if(this.mag > val)
        {
            this.normalise();
            this.scale(val);
        }
    }

    add(vec)
    {
        this.x += vec.x;
        this.y += vec.y;

    }

    sub(vec)
    {
        this.x -= vec.x;
        this.y -= vec.y;
    }

    scale(lambda)
    {
        this.x *= lambda;
        this.y *= lambda;
    }

    //Getters and Setters
    get x()
    {
        return this._x;
    }

    get y()
    {
        return this._y;
    }

    get mag()
    {
        return Math.sqrt(this._x**2 + this._y**2);
    }

    get angle()
    {
        return Math.atan2(this._y/this._x);
    }

    set x(val)
    {
        this._x = val;
    }

    set y(val)
    {
        this._y = val;
    }

    set mag(val)
    {
        this._mag = val;
    }
}