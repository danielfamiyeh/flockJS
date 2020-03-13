import Vector from './Vector.js';

export default class Path
{
    constructor(start, end, radius=10)
    {
        this._start = start;
        this._end = end;
        this._radius = radius;
    }

    render(ctx)
    {
        ctx.beginPath();
        ctx.arc(this.start.x, this.start.y, this.radius, 0, 2*Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.end.x, this.end.y, this.radius, 0, 2*Math.PI);
        ctx.stroke();
    }
    

    // Getters and setters
    get radius()
    {
        return this._radius;
    }

    get start()
    {
        return this._start;
    }

    get end()
    {
        return this._end;
    }

    set start(val)
    {
        this._start = val;
    }

    set end(val)
    {
        this._end = val;
    }

    set radius(val)
    {
        this._radius = val;
    }
}