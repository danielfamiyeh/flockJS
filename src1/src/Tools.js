export default class Tools
{
    static rotate(ctx, shape, angle)
    {
        ctx.translate(shape.position.x, shape.position.y);
        ctx.rotate(angle);
        ctx.translate(-shape.position.x, -shape.position.y);
    }
}