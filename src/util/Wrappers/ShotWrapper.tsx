import Shot from "../Shooting/Shot";

export default class ShotWrapper{
    private shots:Shot[] = []

    public constructor(){}

    public addShots(newShot:Shot[]):void{
        newShot.forEach((shot)=>{
            this.shots.push(shot)
        })
    }

    public addShot(newShot:Shot):void{
        this.shots.push(newShot)
    }

    public getShots():Shot[]{
        return this.shots;
    }

    public setShots(newShots:Shot[]):void{
        this.shots = newShots
    }
}