import IceShot from "../Shooting/IceShot";
import Monster from "../Monster/Monster";
import Shot from "../Shooting/Shot";
import Tower from "./Tower";

export default class IceTower extends Tower{


    public constructor(cost:number, cooldown:number){
        super("Ice Tower", {h:100,w:63}, cost, cooldown);
    }

    draw(ctx:CanvasRenderingContext2D, point:any) : void{
        const dimensions = this.getDimensions()
        const towerHeight = dimensions.height;
        const towerWidth = dimensions.width;  
        const borderColor = "blue"
        const towerColor = "white"

        ctx.fillStyle = borderColor
        ctx.fillRect(point.x - towerWidth/2-1, point.y - towerHeight/2-1, towerWidth+2, towerHeight+2)
                
        ctx.fillStyle = towerColor
        const peakMeasure = towerWidth/5;
        ctx.fillRect(point.x - towerWidth/2, point.y - towerHeight/2, peakMeasure, peakMeasure)
        ctx.fillRect(point.x - towerWidth/2 + peakMeasure*2, point.y - towerHeight/2, peakMeasure, peakMeasure)
        ctx.fillRect(point.x - towerWidth/2 + peakMeasure*4, point.y - towerHeight/2, peakMeasure, peakMeasure)
        ctx.fillRect(point.x - towerWidth/2, point.y - towerHeight/2 + peakMeasure, towerWidth, towerHeight - peakMeasure)
        
        ctx.fillStyle = borderColor
        const doorHeigth = 3/8*towerHeight
        const doorDimensions = 8/25*towerWidth
        const doorMargin = 17/25*towerWidth/2
        ctx.fillRect(point.x - towerWidth/2 + doorMargin, point.y - towerHeight/2 + towerHeight - doorHeigth, doorDimensions, doorHeigth)
    }
    
    generateShot(coordinates:{x:number,y:number}, target:Monster) : Shot{
        return new IceShot(coordinates, target);
    }
}


