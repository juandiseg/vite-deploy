import Monster from "../Monster/Monster";
import ShotPath from "./ShotPath";

export default abstract class Shot{

    private displayPosition:{x:number, y:number};
    private position:{x:number, y:number};
    private shotSize:{width:number, height:number};
    private shotHasLanded = false;
    private shotPath:ShotPath;
    private time:number = 0;
    private goal:Monster;

    private dmg:number;

    public constructor(position:{x:number, y:number}, goal:Monster, shotSize:{width:number,height:number}, velocity:number, dmg:number){
        this.shotPath = new ShotPath(position, goal, velocity);
        this.displayPosition = {x:position.x, y:position.y}
        this.position = position;
        this.shotSize = shotSize;
        this.goal = goal;
        this.dmg = dmg;
        if(this.shotPath.isShotPathViable()){
            this.goal.addHPTargeted(this.dmg);
        }
    }

    public abstract display(ctx:CanvasRenderingContext2D):void;

    public dealDamage():void{
        this.goal.receiveDamage(this.dmg);
    }

    public update():void{
        this.time++;
        this.position = this.shotPath.calculatePosition(this.time);
        this.displayPosition = this.shotPath.calculateDisplayPosition(this.position, this.shotSize);
        this.checkTargetHit();
        if(this.shotHasLanded){
            this.dealDamage();
        }
    }

    private checkTargetHit():void{
        const position = this.displayPosition
        const monsterArea = this.goal.getArea();
        const rangeShotX = {x1:position.x, x2:position.x + this.shotSize.width}
        const rangeShotY = {y1:position.y, y2:position.y + this.shotSize.height}

        const xRange = this.inXRange(monsterArea, rangeShotX);
        const yRange = this.inYRange(monsterArea, rangeShotY);
        this.shotHasLanded = xRange && yRange; 
    }

    private inXRange(monsterArea:{x1: number, y1: number, x2: number, y2: number}, rangeShotX:{x1:number, x2:number}):boolean{
        if(monsterArea.x1 + 5 <= rangeShotX.x1 && rangeShotX.x1 <= monsterArea.x2 - 5){
            // Shot's left X is inside the monster's area
            return true;
        }
        if(monsterArea.x1 + 5 <= rangeShotX.x2 && rangeShotX.x2 <= monsterArea.x2 - 5){
            // Shot's right X is inside the monster's area
            return true;
        }
        return false;
    }

    private inYRange(monsterArea:{x1: number, y1: number, x2: number, y2: number}, rangeShotY:{y1:number, y2:number}):boolean{
        if(monsterArea.y1 + 5 <= rangeShotY.y1 && rangeShotY.y1 <= monsterArea.y2 - 5){
            // Shot's upper Y is inside the monster's area
            return true;
        }
        if(monsterArea.y1 + 5 <= rangeShotY.y2 && rangeShotY.y2 <= monsterArea.y2 - 5){
            // Shot's down Y is inside the monster's area
            return true;
        }
        return false;
    }

    public hasLanded():boolean{
        return this.shotHasLanded;
    }

    public getShotPath():ShotPath{
        return this.shotPath;
    }

    public isShotOfScreen():boolean{
        const dPosition = this.displayPosition;
        return dPosition.x < 0 || dPosition.x>700 || dPosition.y < 0 || dPosition.y > 500
    }

    public targetIsDead():boolean{
        return this.goal.isDead();
    }

    public getDisplayPosition():{x:number,y:number}{
        return this.displayPosition;
    }

}