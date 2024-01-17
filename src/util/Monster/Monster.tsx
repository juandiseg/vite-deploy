import MonsterPath from "./MonsterPath";

const ORIGINAL_HP:number = 50; 
export default class Monster{

    private displayPosition:{ x: number; y: number; }
    private monsterSize = {height:30, width: 30}
    private position:{x:number, y:number}
    private hp:number = ORIGINAL_HP;
    private targetedHp:number = 0;
    private beenKilled = false
    private livesCount:number
    private path:MonsterPath
    private time:number = 0;
    private speed:number;

    public constructor(livesCount:number, height:number, width:number, pixelsPerFrame:number){
        const directionFactor = Math.round(Math.random()) * 2 - 1
        const positionFactor = Math.round(Math.random()*30)
        const randomFactor = positionFactor*directionFactor*2
        
        this.path = new MonsterPath(height+randomFactor, width, pixelsPerFrame);
        this.displayPosition = {x:width, y:(height+randomFactor)/2}
        this.position = {x:width, y:(height+randomFactor)/2}
        this.livesCount = livesCount;
        this.speed = pixelsPerFrame;
    }

    public display(ctx:CanvasRenderingContext2D){

        let topLeftX = this.displayPosition.x
        let topLeftY = this.displayPosition.y 

        ctx.fillStyle = "black"
        //0
        ctx.fillRect(topLeftX+14, topLeftY, 5, 1)
        topLeftY++; //1
        ctx.fillRect(topLeftX+12, topLeftY, 9, 1)
        topLeftY++; //2
        ctx.fillRect(topLeftX+11, topLeftY, 11, 1)
        topLeftY++; //3
        ctx.fillRect(topLeftX+10, topLeftY, 13, 1)

        topLeftY++; //4
        ctx.fillRect(topLeftX+9, topLeftY, 15, 1)
        topLeftY++; //5
        ctx.fillRect(topLeftX+9, topLeftY, 15, 1)
        topLeftY++; //6
        ctx.fillRect(topLeftX+9, topLeftY, 15, 1)
        topLeftY++; //7
        ctx.fillRect(topLeftX+9, topLeftY, 15, 1)
        topLeftY++; //8
        ctx.fillRect(topLeftX+9, topLeftY, 15, 1)
        topLeftY++; //9
        ctx.fillRect(topLeftX+9, topLeftY, 15, 1)

        topLeftY++; //10
        ctx.fillRect(topLeftX+8, topLeftY, 17, 1)
        topLeftY++; //11
        ctx.fillRect(topLeftX+7, topLeftY, 19, 1)
        topLeftY++; //12
        ctx.fillRect(topLeftX+6, topLeftY, 21, 1)
        topLeftY++; //13
        ctx.fillRect(topLeftX+5, topLeftY, 23, 1)
        topLeftY++; //14
        ctx.fillRect(topLeftX+5, topLeftY, 23, 1)
        
        topLeftY++; //15
        ctx.fillRect(topLeftX+4, topLeftY, 25, 1)
        topLeftY++; //16
        ctx.fillRect(topLeftX+4, topLeftY, 25, 1)
        topLeftY++; //17
        ctx.fillRect(topLeftX+4, topLeftY, 25, 1)
        topLeftY++; //18
        ctx.fillRect(topLeftX+4, topLeftY, 25, 1)
        topLeftY++; //19
        ctx.fillRect(topLeftX+4, topLeftY, 25, 1)
        topLeftY++; //20
        ctx.fillRect(topLeftX+4, topLeftY, 25, 1)

        topLeftY++; //21
        ctx.fillRect(topLeftX+4, topLeftY, 4, 1)
        ctx.fillRect(topLeftX+9, topLeftY, 15, 1)
        ctx.fillRect(topLeftX+24, topLeftY, 4, 1)

        topLeftY++; //22
        ctx.fillRect(topLeftX+5, topLeftY, 3, 1)
        ctx.fillRect(topLeftX+9, topLeftY, 15, 1)
        ctx.fillRect(topLeftX+25, topLeftY, 3, 1)

        topLeftY++; //23
        ctx.fillRect(topLeftX+9, topLeftY, 15, 1)

        topLeftY++; //24
        ctx.fillRect(topLeftX+9, topLeftY, 6, 1)
        ctx.fillRect(topLeftX+19, topLeftY, 6, 1)
        topLeftY++; //25
        ctx.fillRect(topLeftX+9, topLeftY, 6, 1)
        ctx.fillRect(topLeftX+19, topLeftY, 6, 1)
        topLeftY++; //26
        ctx.fillRect(topLeftX+10, topLeftY, 4, 1)
        ctx.fillRect(topLeftX+20, topLeftY, 4, 1)
    }

    public getArea():{x1:number, y1:number, x2:number, y2:number}{
        return {x1: this.displayPosition.x, y1: this.displayPosition.y, x2: this.displayPosition.x+this.monsterSize.width, y2: this.displayPosition.y+this.monsterSize.height}
    }

    public receiveDamage(damage:number):void{
        this.hp = this.hp - damage;
        if(this.hp <= 0){
            this.beenKilled = true;
        }
    }

    public addHPTargeted(damage:number):void{
        this.targetedHp = this.targetedHp + damage;
    }

    public hasTargetedHPLeft():boolean{
        return this.targetedHp < ORIGINAL_HP;
    }

    public isDead():boolean{
        return this.beenKilled;
    }

    public update():boolean{
        this.time++;
        // moving in a straight lines vertically to the left.
        this.position = this.path.calculatePosition(this.time, true);
        // The display position is the position for the top-left corner so when used to print to the canvas the monster's center would be in position
        this.displayPosition = this.path.calculateDisplayPosition(this.position, this.monsterSize)
        if(this.path.isPathFinished()){
            this.decreaseHP()
            return false;
        }
        return true;
    }

    public getPositionAtSurplusTime(i:number):{x:number,y:number}{
        return this.path.calculatePosition(i, false);
    }

    public getInitialTime():number{
        return this.time;
    }

    public decreaseHP():void{
        this.livesCount = this.livesCount - 1;
    }

    public getCoordinates():{x:number, y:number}{
        return this.position;
    }

    public isPathFinished():boolean{
        return this.path.isPathFinished();
    }

    public getSpeed():number{
        return this.speed
    }
}