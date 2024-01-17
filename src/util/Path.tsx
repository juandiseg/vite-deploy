export default abstract class Path{
    private beginning:{x:number, y:number}
    private velocityVector:{ x: number, y: number } = {x:1, y:1}
    private pathFinishedFlag:boolean = false
    private timeCollition:number = -1;


    // Velocity is pixels per frame.
    public constructor(beginning:{x:number,y:number}){
        this.beginning = beginning;
    }

    public getBeginning():{x:number,y:number}{
        return this.beginning;
    }

    public setVelocityVector(velVector:{x:number,y:number}){
        this.velocityVector = velVector;
    }
    public getVelocityVector():{ x: number, y: number }{
        return this.velocityVector;
    }

    public setTimeCollition(collitionT:number){
        this.timeCollition = collitionT;
    }

    public setPathFinishedFlag(flag:boolean){
        this.pathFinishedFlag = flag;
    }

    public getPathFinishedFlag():boolean{
        return this.pathFinishedFlag;
    }

    public getTimeCollition():number{
        return this.timeCollition;
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