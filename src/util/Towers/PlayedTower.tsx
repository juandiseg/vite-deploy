import Monster from "../Monster/Monster";
import Shot from "../Shooting/Shot";
import Tower from "./Tower";

export default class PlayedTower{

    private coordinates:{x:number, y:number}
    private currentCooldown:number = 0;
    private cooldown:number;
    private tower:Tower

    public constructor(tower:Tower, coordinates:{x:number, y:number}){
        this.tower = tower;
        this.cooldown = tower.getCooldown();
        this.coordinates = coordinates;
    }

    public isMonsterInRage(monster:Monster) : boolean{
        const towerRange = {x:300,y:300};
        const monsterX = monster.getCoordinates().x;
        const monsterY = monster.getCoordinates().y;
        let towerX = this.coordinates.x;
        let towerY = this.coordinates.y;
        const xRange = {x1: towerX-towerRange.x, x2:towerX+towerRange.x}
        const yRange = {y1: towerY-towerRange.y, y2:towerY+towerRange.y}
        return (xRange.x1 <= monsterX && xRange.x2 >= monsterX && yRange.y1 <= monsterY && yRange.y2 >= monsterY)
    }
    
    public createShot(target:Monster) : Shot{
        return this.tower.generateShot(this.coordinates, target);
    }

    public reduceCooldown():void{
        if(this.currentCooldown != 0){
            this.currentCooldown--;
        }
    }

    public resetCooldown():void{
        this.currentCooldown = this.cooldown;
    }

    public isNotInCooldown() : boolean{
        return this.currentCooldown == 0;
    } 

    public draw(ctx:CanvasRenderingContext2D) : void{
        this.tower.draw(ctx, {x:this.coordinates.x, y:this.coordinates.y});
    }
}
