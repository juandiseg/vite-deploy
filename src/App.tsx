import CircularProgress from '@mui/material/CircularProgress';    
import MonsterWrapper from './util/Wrappers/MonsterWrapper'
import ShotWrapper from './util/Wrappers/ShotWrapper'
import RegularTower from "./util/Towers/RegularTower"
import PlayedTower from './util/Towers/PlayedTower'
import { useEffect, useRef, useState } from 'react'
import FireTower from './util/Towers/FireTower'
import IceTower from './util/Towers/IceTower'
import Monster from './util/Monster/Monster'
import Tower from "./util/Towers/Tower"
import Shot from './util/Shooting/Shot'
import Canvas from "./util/Canvas"
import './App.css'


function App() {

  const height = 500
  const width = 700
  
  const bottomGrass:{x1:number, y1:number, x2:number, y2:number} = {x1:0, y1:height-205, x2:width, y2:height}
  const topGrass:{x1:number, y1:number, x2:number, y2:number} = {x1:0, y1:0, x2:width, y2:205}
  const grassColor:string = "green"

  const centerPath:{x1:number, y1:number, x2:number, y2:number} = {x1:0, y1:205, x2:width, y2:90}
  const pathColor:string = "brown"  
  
  // CANVAS
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)

  // TOWER PICKING
  const towers = [new RegularTower(50, 28), new FireTower(100, 50), new IceTower(200, 7)]
  const [pickedTower, setPickedTower] = useState<Tower>(towers[0])

  // TRACK GAME ONGOING
  const [gameStarted, setStart] = useState<boolean>(false)
  const [firstGameStart, setFirstGameStart] = useState<boolean>(true)

  const [isAlive, setIsAlive] = useState<boolean>(true)

  // GOLD
  const [gold, setGold] = useState<number>(100)
  
  // TOWERS & SHOOTING
  const [playedTowers, setPlayedTowers] = useState<PlayedTower[]>([])
  const [shots, setShot] = useState<ShotWrapper>(new ShotWrapper())
  
  // HP
  const [hpLimit, setHpLimit] = useState<number>(10)
  const [hp, setHp] = useState<number>(10)
  
  // MONSTER
  const [aliveMonsters, setAliveMonsters] = useState<MonsterWrapper>(new MonsterWrapper())
  const [monstersThisRound, setMonstersThisRound] = useState<number>(20)
  const [roundMonstersLeft, setRoundMonstersLeft] = useState<number>(20)
  const [framesUntilNextWave, setFrames] = useState<number>(100) // was 100
  const [monsterSpeed, setMonsterSpeed] = useState<number>(2)
  const [monsterTimer, setMonsterTimer] = useState<number>(0)
  const [wave, setWave] = useState<boolean>(false)
  const [mLimitCd, setMLimitCd] = useState<number>(100)

  // LEVELING UP
  const [level, setLevel] = useState<number>(1)
  const [levelUpProgress, setLevelUpProgress] = useState<number>(0)
  
  // FRAME RATE
  const [time, setTime] = useState(Date.now());

  let levelUpGoal:number = 30;
  

/*                                            *
*             METHODS START HERE              *
*                                             */


  // Is executed once, during the FIRST LOAD.
  useEffect(() => {
    const canvas = canvasRef.current; 
    const ctx = canvas.getContext("2d"); 
    ctxRef.current = ctx;
    drawBackground(ctx)
  },[])


  // GENERAL GAME LOOP. Invoked when there are changes to game or time.
  useEffect(() => {
    if(gameStarted && isAlive){
      const ctx = canvasRef.current.getContext('2d');
      if(wave == false && aliveMonsters.getMonsters().length == 0){
        if(framesUntilNextWave-1 <= 20){
          setWave(true)
          setMonstersThisRound(Math.round(monstersThisRound * 1.25))
          setRoundMonstersLeft(monstersThisRound)
        } else {
          setFrames(framesUntilNextWave-1)
        }
      }
      if(wave || aliveMonsters.getMonsters().length > 0){
        drawNextFrame(ctx)
        setPlayedTowers(playedTowers)
      }
      setTimeout(() => {
        setTime(Date.now());
      },1000/50)
    }
  }, [time, gameStarted]);


  // MAIN EVENT HANDLING

  function drawNextFrame(ctx:CanvasRenderingContext2D){
    clearBoard(ctx)
    removeUnnecessary();
    drawBackground(ctx);
    drawTowersAndReduceCd(ctx);
    createMonstersInWave();
    drawMonstersReduceHP(ctx);
    tryToShoot();
    drawShoots(ctx);
    checkRoundEnded();
  }

  function clearBoard(ctx:CanvasRenderingContext2D){
    ctx.clearRect(0,0, width, height);
  }

  function removeUnnecessary():void{
    let numDead = 0;
    const reducedMonsters = aliveMonsters.getMonsters().filter((monster)=>{
      if(monster.isDead()){
        numDead = numDead + 1
        return false;
      } else if(monster.isPathFinished()){
        return false;
      }
      return true;
    })
    setGold(gold+numDead*5);
    if(levelUpProgress+numDead >= levelUpGoal){
      levelUp();
      levelUpGoal = levelUpGoal*1.15
    } else {
      setLevelUpProgress(levelUpProgress + numDead)
    }
    aliveMonsters.setMonsters(reducedMonsters);
    setAliveMonsters(aliveMonsters);
  }

  function levelUp():void{
    setLevel(level + 1)
    setLevelUpProgress(0)
    setHpLimit(hpLimit+5)
  }
  
  function drawBackground(ctx:CanvasRenderingContext2D){
    const topG = topGrass;    
    ctx.fillStyle = grassColor
    ctx.fillRect(topG.x1, topG.y1, topG.x2, topG.y2);
    
    const bottomG = bottomGrass;
    ctx.fillStyle = grassColor
    ctx.fillRect(bottomG.x1, bottomG.y1, bottomG.x2, bottomG.y2);

    const path = centerPath
    ctx.fillStyle = "black"
    ctx.fillRect(path.x1, path.y1-2, path.x2, path.y2+4);
    
    ctx.fillStyle = pathColor
    ctx.fillRect(path.x1, path.y1, path.x2, path.y2);
  }

  function drawTowersAndReduceCd(ctx:CanvasRenderingContext2D){
    playedTowers.forEach(tower => {
      tower.draw(ctx)
      tower.reduceCooldown()
    });
  }

  function createMonstersInWave(){
    if(wave && roundMonstersLeft > 0){
      if(monsterTimer != 0){
        setMonsterTimer(monsterTimer-1)
      } else {
        aliveMonsters.addMonster(new Monster(hp, height, width, monsterSpeed));
        setAliveMonsters(aliveMonsters);
        setRoundMonstersLeft(roundMonstersLeft - 1);
        setMonsterTimer(Math.round(Math.random()*mLimitCd))
      }
    }
  }

  function drawMonstersReduceHP(ctx:CanvasRenderingContext2D){ 
    const newMonsters = aliveMonsters.getMonsters().filter((monster) =>{
      if(monster.update()){
        monster.display(ctx);
        return true;
      } else {
        setHp(hp-1)
        if(hp<1){
          setStart(false);
          setIsAlive(false);
        }
        return false;
      }
    })
    aliveMonsters.setMonsters(newMonsters)
    setAliveMonsters(aliveMonsters)
    if(roundMonstersLeft <= 0){
        setWave(false)
    }
  }

  function tryToShoot(){
    const newShots:Shot[] = []
    if(playedTowers.length != 0 || aliveMonsters.getMonsters().length != 0){
      aliveMonsters.getMonsters().forEach((monster)=>{
          playedTowers.forEach((tower)=>{
            if(tower.isMonsterInRage(monster) && tower.isNotInCooldown()){
              if(monster.hasTargetedHPLeft()){
                let tempShot = tower.createShot(monster);
                if(tempShot.getShotPath().isShotPathViable()){
                  tower.resetCooldown();
                  newShots.push(tempShot)
                }
              }
            }
        })
      })
    }
    shots.addShots(newShots)
  }
  
  function drawShoots(ctx:CanvasRenderingContext2D) : void{
    const newShots = shots.getShots().filter((shot)=>{
      shot.update()
      shot.display(ctx)
      return !(shot.isShotOfScreen() || shot.hasLanded() || shot.targetIsDead())
    })
    shots.setShots(newShots);
    setShot(shots);
  }

  function checkRoundEnded():void{
    aliveMonsters.getMonsters().filter((monster)=>{
      if(monster.isDead() || monster.isPathFinished()){
        return false;
      }
      return true;
    })
    if(aliveMonsters.getMonsters().length == 0 && roundMonstersLeft <= 0){
      setFrames(50*2.5+22);
      setMLimitCd(Math.round(mLimitCd*0.7))
    }
  }

  // BUTTON CLICKING HANDLING

  function selectedTower(index:number){
    if(pickedTower?.equals(towers[index])){
    } else {
      setPickedTower(towers[index])
    }
  }

  function selectRegularTower(){
    selectedTower(0)
  }

  function selectFireTower(){
    selectedTower(1)  
  }

  function selectIceTower(){
    selectedTower(2)
  }

  function healUp(){
    if (gold >= 50 && hp != hpLimit){
      setHp(hp+1);
      setGold(gold-50);
    }
  } 

  function limitUp(){
    if (gold >= 25){
      setHpLimit(hpLimit+1);
      setGold(gold-25);
    }
  } 

  function slowDownMonsters(){
    if (gold >= 400){
      setMonsterSpeed(monsterSpeed*0.9)
      setGold(gold-400);
    }
  } 

    // HANDLING CLICKING ON CANVAS

  const clickListener = (e) => {
    const coordinates = computePointInCanvas(e.clientX, e.clientY)
    if( coordinates != null &&
      !coordinatesInPath(coordinates.y) &&
      !coordinatesOutOfBounds(coordinates) &&
      gold >= pickedTower.getCost()
    ){
      const ctx = canvasRef.current.getContext('2d');
      let temp:PlayedTower = new PlayedTower(pickedTower, coordinates)
      setGold(gold-pickedTower.getCost())
      setPlayedTowers([...playedTowers, temp])
      if(!wave){
        temp.draw(ctx)
      }
    }
  }

  function computePointInCanvas(asbX:number, absY:number){
    if(canvasRef.current){
      const boundingRect:DOMRect = canvasRef.current.getBoundingClientRect();
      let relativeCoord = { x: asbX-boundingRect.left, y: absY-boundingRect.top}
      if(relativeCoord.x < 0 || relativeCoord.x > width || relativeCoord.y<0 || relativeCoord.y > height){
        return null;
      }
      return relativeCoord
    }
    return null;
  }
    
  function coordinatesInPath(y:number):boolean{
    const tDimension = pickedTower.getDimensions();
    const heightCovered = {y1:205, y2:295}
    if(heightCovered.y1 <= y - tDimension.height/2 && y <= heightCovered.y2 - tDimension.height/2){
      return true;
    } else if (heightCovered.y1 <= y + tDimension.height/2 && y <= heightCovered.y2 + tDimension.height/2){
      return true;
    }
    return false;
  }
    
  function coordinatesOutOfBounds(coordinates:{x:number, y:number}):boolean{
    const tDimension = pickedTower.getDimensions();    
    const xLimits = {x1: coordinates.x - tDimension.width/2, x2: coordinates.x + tDimension.width/2}
    const yLimits = {y1: coordinates.y - tDimension.height/2, y2: coordinates.y + tDimension.height/2}
    return (yLimits.y1 <= 0 || 500 <= yLimits.y2 || xLimits.x1 <= 0 || 700 <= xLimits.x2)
  }

  const startButtonFunction = () =>{
    if(!gameStarted && firstGameStart){
      return (<><br></br><div className="startButton">
        <button className='optButtom' onClick={() => {setStart(true); setFirstGameStart(false)}}>START GAME</button>
      </div></>);
    } else {
      return (<></>);
    }
  }

  return (<>
  <div className='majorDiv'>
    <h1 className='header'>
      The game {gameStarted ? ("is STARTED") : isAlive ? ("is NOT STARTED") : ("IS OVER")}.
    </h1>
    <div className="row">
      <div className="column">
      <p className='paragraph1'><strong>{Math.round(framesUntilNextWave/50)}</strong> seconds until next wave</p>  
      <p className='paragraph1'><strong>HP</strong> : {hp+1} ({hpLimit+1})</p>
      <p className='paragraph1'>Chosen : <strong>{pickedTower.getName()}</strong> | {pickedTower.getCost()} Gold</p>
      </div>
      <div className="column">
        <p className='paragraph1'><strong>Gold</strong> : {gold}</p>
        <p className='paragraph1'><strong>Level</strong> : {level} ({Math.round(levelUpProgress/levelUpGoal*100)}%)</p>
        <p className='paragraph1'><strong>{roundMonstersLeft}</strong> Monsters left this round </p>
      </div>
    </div>
    {startButtonFunction()}
    <div className='canvas'>
    {Canvas(clickListener, canvasRef, width, height)}
    </div>
    <table className='test'>
      <tr>
        <td><button className='optButtom' onClick={selectRegularTower}>REGULAR TOWER</button></td>
        <td><button className="optButtom" onClick={selectFireTower}>FIRE TOWER</button></td>
        <td><button className="optButtom" onClick={selectIceTower}>ICE TOWER</button></td>
      </tr>
    </table>
    <table className='test'>
      <tr>
      <td><button className="optButtom" onClick={healUp}>Heal 1HP |<strong>50g</strong></button></td>
        <td><button className="optButtom" onClick={limitUp}>Increment limit HP +1 |<strong>25g</strong></button></td>
        <td><button className="optButtom" onClick={slowDownMonsters}>Reduce monster speed |<strong>400g</strong></button></td>
      </tr>
    </table>
  </div>
    </>
    )
}

export default App