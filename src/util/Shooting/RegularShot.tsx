import Monster from "../Monster/Monster";
import Shot from "./Shot";

export default class RegularShot extends Shot{
    
    private size = {width:5, height:5};

    public constructor(position:{x:number, y:number}, goal:Monster){
        super(position, goal, {width:5, height:5}, 8, 20) //
    }

    public display(ctx:CanvasRenderingContext2D){
        const displayPosition = this.getDisplayPosition();
        const mainColor = "black"
        const secondaryColor = "orange"
        ctx.fillStyle = mainColor
        ctx.fillRect(displayPosition.x-2, displayPosition.y-2, this.size.width+4, this.size.height+4)
        ctx.fillStyle = secondaryColor
        ctx.fillRect(displayPosition.x-1, displayPosition.y-1, this.size.width+2, this.size.height+2)
        ctx.fillStyle = mainColor
        ctx.fillRect(displayPosition.x+1, displayPosition.y+1, this.size.width-1, this.size.height-1)
    }
}