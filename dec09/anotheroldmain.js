const fs = require('fs');

let DIR  = ["L","R","U","D","LU","RU","LD","RD"];
let CHAR = {"HEAD":'H',"TAIL":'T',"NONE":'.'};

class Position{
    constructor(x,y){
        this.x           = x;
        this.y           = y;
        this.neighbours  = new Map();
        this.char        = new Map();
        this.tailWasHere = false;
    }

    AddNeighbour(dir,position){
        this.neighbours.set(dir,position);
    }

    GetNeighbour(dir){
        return this.neighbours.get(dir);
    }

    AddCharacter(char){
        this.char.set(char.type,char);
        if(char.type == CHAR.TAIL){
            this.tailWasHere = true;
        }
    }

    RemoveCharacter(char){
        this.char.delete(char.type);
    }

    HasCharacter(char){
        return this.char.has(char);
    }

    print(){
        if(this.char.has(CHAR.HEAD)){ return "H"; }
        if(this.char.has(CHAR.TAIL)){ return "T"; }
        if(this.tailWasHere)        { return "#"; }
        return ".";
    }

    equals(pos){
        return (this.x == pos.x && this.y == pos.y);
    }
}

class Character{
    constructor(position, type){
        this.position  = position;
        this.type      = type;
        this.touchHistory = new Array();
        this.moveHistory  = new Array();
    }

    LastMove(){
        return this.moveHistory[this.moveHistory.length-1];
    }

    LastTouch(){
        return this.touchHistory[this.touchHistory.length-1];
    }

    move(dir){
        let newPos = this.position.GetNeighbour(dir);
        if(newPos != undefined){
            this.position.RemoveCharacter(this);
            newPos.AddCharacter(this);
            this.position = newPos;
            this.moveHistory.push(dir);
        }
        return false;
    }

    IsTouching(char){
        if(this.position.equals(char.position)){ 
            this.touchHistory.push("x");
            return true; 
        }
        for(let [key,value] of this.position.neighbours){
            //console.log(`key: ${key} has head: ${value.HasCharacter(char.type)}`);
            if(value.HasCharacter(char.type)){ 
                this.touchHistory.push(key);
                return true; 
            }
        }
        return false;
    }
}

class Grid{
    constructor(){
        this.positions = new Array();
        let rootPos    = new Position(100,100);
        this.head      = new Character(rootPos,CHAR.HEAD);
        this.tail      = new Character(rootPos,CHAR.TAIL);
        rootPos.AddCharacter(this.head);
        rootPos.AddCharacter(this.tail);
        this.positions.push(rootPos);
    }

    getPositionAt(x,y){
        for(let position of this.positions){
            if(position.x == x && position.y == y){ return position; }
        }
        return null;
    }

    oppositeOf(dir){
        if(dir == "L"){ return "R"; }
        if(dir == "R"){ return "L"; }
        if(dir == "U"){ return "D"; }
        if(dir == "D"){ return "U"; }
        if(dir == "LU"){ return "RD"; }
        if(dir == "RU"){ return "LD"; }
        if(dir == "LD"){ return "RU"; }
        if(dir == "RD"){ return "LU"; }
    }

    createDir(dirA, dirB){
        if("LR".indexOf(dirA) >= 0){
            return dirA + dirB;
        }
        return dirB + dirA;
    }

    MoveHead(dir, steps){
        for(let i=0;i<steps;i++){
            // get my bearing
            let newX = this.head.position.x;
            let newY = this.head.position.y;
            if(dir.startsWith("L"))      { newX--; }
            else if(dir.startsWith("R")) { newX++; }
            if(dir.endsWith("U"))        { newY--; }
            else if(dir.endsWith("D"))   { newY++; }
            // check if I've ever been there
            let newPosition = this.getPositionAt(newX,newY);
            if(newPosition == null){
                newPosition = new Position(newX,newY);
                this.positions.push(newPosition);
            } 
            // Link the locations
            newPosition.AddNeighbour(this.oppositeOf(dir), this.head.position);
            this.head.position.AddNeighbour(dir,newPosition);
            if(i==0){ // exception of creating two neighbours when cutting a corner
                let last = this.head.LastMove();
                if(last != dir){
                    let lastPos = this.head.position.GetNeighbour(this.oppositeOf(last));
                    let aDir    = this.createDir(dir,last);
                    lastPos.AddNeighbour(aDir,newPosition);
                    newPosition.AddNeighbour(this.oppositeOf(aDir),lastPos);
                }
            }
            // move the pieces
            this.head.move(dir);
            this.MoveTail();
            console.log("-----");
            console.log(`Head at position x: ${this.head.position.x} y:${this.head.position.y}`);
            console.log(`Tail at position x: ${this.tail.position.x} y:${this.tail.position.y}`);
        }
    }

    MoveTail(){
        if(!this.tail.IsTouching(this.head)){
            this.tail.move(this.tail.LastTouch(),1);
            this.tail.IsTouching(this.head);
        }
    }

    CountTailPositions(){
        let count = 0;
        for(let pos of this.positions){
            if(pos.tailWasHere){ count++;}
        }
        return count;
    }
}

function main(){
    let steps     = fs.readFileSync('test-input.txt', 'utf8').split("\n");
   
    let grid = new Grid();
    // Run the steps
    for(let step of steps){
        let stp = step.split(" ");
        grid.MoveHead(stp[0],Number(stp[1]));
    }
    console.log(`Tail has had ${grid.CountTailPositions()} unique locations`);
}

main();