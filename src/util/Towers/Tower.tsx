import Monster from "../Monster/Monster";
import Shot from "../Shooting/Shot";

export default abstract class Tower{
    private cooldown:number;
    private name:string
    private cost:number
    private towerHeight;
    private towerWidth;

    public constructor(name:string, dimension:{h:number, w:number}, cost:number, cooldown:number){
        this.name = name;
        this.cost = cost;
        this.cooldown = cooldown;
        this.towerHeight = dimension.h;
        this.towerWidth = dimension.w;
    }
    
    abstract draw(ctx:CanvasRenderingContext2D, point:any) : void;

    abstract generateShot(coordinates:{x:number,y:number}, target:Monster) : Shot;

    // @Override
    public equals(tower: any){
        if(tower instanceof Tower){
            let temp = tower as Tower
            return (temp.getName() == this.getName() && temp.getCost() == this.getCost())
        }
        return false
    }

    public getCooldown():number{
        return this.cooldown;
    }

    public getName() : string{
        return this.name;
    }

    public getCost() : number{
        return this.cost;
    }

    public getDimensions() : {height:number,width:number}{
        return {height: this.towerHeight, width:this.towerWidth}
    }

}




  