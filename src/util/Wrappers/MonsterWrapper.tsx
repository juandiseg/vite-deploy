import Monster from "../Monster/Monster";

export default class MonsterWrapper{
    private monsters:Monster[] = []

    public constructor(){}

    public addMonster(newMonster:Monster):void{
        this.monsters.push(newMonster)
    }

    public getMonsters():Monster[]{
        return this.monsters;
    }

    public setMonsters(newMonsters:Monster[]):void{
        this.monsters = newMonsters
    }


}