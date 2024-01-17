export default class MonsterPath{
    private beginning:{x:number, y:number}
    private end:{x:number, y:number}
    private velocityVector:{x:number, y:number}
    private pathFinishedFlag:boolean = false
    private timeCollition:number;


    // Velocity is pixels per frame.
    public constructor(height:number, width:number, velocity:number){
        this.beginning = {x: width, y: height/2}
        this.end = {x: 0, y: height/2}
        const distanceToCover = {x:(this.end.x - this.beginning.x), y: (this.end.y - this.beginning.y)};
        const maxNumberFrames = {x: Math.abs(distanceToCover.x/velocity), y: Math.abs(distanceToCover.y/velocity)}
        if(maxNumberFrames.x == 0){
            this.velocityVector = {x:0, y: distanceToCover.y/maxNumberFrames.y};
        } else if (maxNumberFrames.y == 0){
            this.velocityVector = {x:distanceToCover.x/maxNumberFrames.x, y: 0};
        } else {
            this.velocityVector = {x:distanceToCover.x/maxNumberFrames.x, y: distanceToCover.y/maxNumberFrames.y};
        }
        if(distanceToCover.x/this.velocityVector.x != 0){
            this.timeCollition = Math.round(Math.abs(distanceToCover.x/this.velocityVector.x));
        } else {
            this.timeCollition = Math.round(Math.abs(distanceToCover.y/this.velocityVector.y));
        }
    }

    public calculatePosition(time:number, checking:boolean):{x:number, y:number}{
        let position = {x:this.beginning.x + this.velocityVector.x * time, y:this.beginning.y + this.velocityVector.y * time};
        if(checking && this.timeCollition == time){
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