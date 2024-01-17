import Monster from "../Monster/Monster"

export default class ShotPath {
    private beginning:{x:number, y:number}
    private end!: { x: number, y: number }
    private velocityVector!:{ x: number; y: number}
    private pathFinishedFlag:boolean = false
    private timeCollition:number;

    private pointViable:boolean = true;

    // Velocity is pixels per frame.
    public constructor(position:{x:number, y:number}, goal:Monster, velocity:number){
        this.beginning = {x: position.x, y: position.y}
        let collitionPoint = false;
        const base = goal.getInitialTime();
        let i = 0;
        while (!collitionPoint){
            i++;
            this.end = goal.getPositionAtSurplusTime(base + i)
            const distanceToCover = {x:(this.end.x - this.beginning.x), y: (this.end.y - this.beginning.y)};
            const velocityNeeded = {x: distanceToCover.x/i, y: distanceToCover.y/i}
            if(Math.abs(velocityNeeded.x) + Math.abs(velocityNeeded.y) <= velocity){
                if(this.end.x <= 15){
                    this.pointViable = false;
                }
                this.velocityVector = velocityNeeded;
                collitionPoint = true;
            } 
        }
        this.timeCollition = i;
    }

    public isShotPathViable():boolean{
        return this.pointViable;
    }

    public calculatePosition(time:number):{x:number, y:number}{
        let position = {x:this.beginning.x + this.velocityVector.x * time, y:this.beginning.y + this.velocityVector.y * time};
        if(this.timeCollition == time){
            this.pathFinishedFlag = true;
        }
        return position; 
    }

    public calculateDisplayPosition(position:{x:number, y:number}, displaySize:{height:number, width: number}):{x:number, y:number}{
        return {x: position.x - (displaySize.width / 2), y: position.y - (displaySize.height / 2)};
    }

    public isPathFinished():boolean{
        return this.pathFinishedFlag;
    }
}