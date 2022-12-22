const fs = require('fs');

class Position{
    constructor(x,y){
        this.x           = x;
        this.y           = y;
        this.char        = new Map();
        this.tailWasHere = false;
    }

    AddCharacter(char){
        this.char.set(char.type,char);
        if(char.type == '9'){
            this.tailWasHere = true;
        }
    }

    RemoveCharacter(char){ this.char.delete(char.type); }

    HasCharacter(char){ return this.char.has(char); }

    equals(pos){ return (this.x == pos.x && this.y == pos.y);}
}

class Character{
    constructor(position, type){
        this.position  = position;
        this.type      = type;
    }

    moveTo(newPos){
        console.log(`${this.type} moves from x:${this.position.x} y:${this.position.y} to x:${newPos.x} y:${newPos.y}`);
        this.position.RemoveCharacter(this);
        newPos.AddCharacter(this);
        this.position = newPos;
    }

    IsTouching(char){
        if(Math.abs(char.position.x - this.position.x) > 1 || Math.abs(char.position.y - this.position.y) > 1){
            return false;
        }
        return true;
    }
}

class Grid{
    constructor(){
        this.positions = new Array();
        let rootPos    = new Position(100,100);
        this.chars     = new Array();
        this.head      = new Character(rootPos,'H');
        this.chars.push(this.head);
        rootPos.AddCharacter(this.head);
        for(let i=1;i<=9;i++){
            let tail = new Character(rootPos,i);
            this.chars.push(tail);
            rootPos.AddCharacter(tail);
        }
        this.positions.push(rootPos);
    }

    IsTouching(from,to){
        for(let y=from.position.y-1; y<from.position.y+2;y++){
            for(let x=from.position.x-1; x<from.position.x+2;x++){
                let pos = this.getPositionAt(x,y);
                if(pos != null && pos.HasCharacter(to.type)){
                    return true;
                }
            }
        }
        return false;
    }

    //Otherwise, if the head and tail aren't touching and aren't in the same row or column, the tail always moves one step diagonally to keep up:
    SameRowOrColumn(head,tail){
        return (head.position.x == tail.position.x || head.position.y == tail.position.y);
    }

    getPositionAt(x,y){
        for(let position of this.positions){
            if(position.x == x && position.y == y){ return position; }
        }
        return null;
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
            // move the head
            let oldPositions = new Array();
            oldPositions.push(this.head.position);
            this.moveTo(this.head,newX,newY);
            // move the 9 tails
            for(let i=1;i<this.chars.length;i++){
                oldPositions.push(this.chars[i].position);
                let diagonalJumpNeeded = !this.SameRowOrColumn(this.chars[i-1],this.chars[i]);
                //console.log(this.SameRowOrColumn(this.chars[i-1],this.chars[i]));
                let touching           = this.IsTouching(this.chars[i],this.chars[i-1]);
                if(!touching && (!diagonalJumpNeeded || i==1)){
                    this.chars[i].moveTo(oldPositions[i-1]);
                } else if(diagonalJumpNeeded && !touching){
                    // old pos x5 y5 new pos x6 y4
                    // old pos x4 y5 new pos 
                    let xDif = this.chars[i-1].position.x - oldPositions[i-1].x;
                    let yDif = this.chars[i-1].position.y - oldPositions[i-1].y;
                    console.log(`xdif: ${xDif} ydif: ${yDif}`);
                    this.moveTo(this.chars[i], this.chars[i].position.x + xDif, this.chars[i].position.y + yDif);
                    console.log("diagonal jump needed");
                }
            }
            
        }
    }

    moveTo(char,x,y){
        // check if I've ever been there
        let newPosition = this.getPositionAt(x,y);
        if(newPosition == null){
            newPosition = new Position(x,y);
            this.positions.push(newPosition);
        } 
        // move the char
        char.moveTo(newPosition);
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
    let steps = fs.readFileSync('test-input.txt', 'utf8').split("\n");
    let grid  = new Grid();
    // Run the steps
    for(let step of steps){
        let stp = step.split(" ");
        grid.MoveHead(stp[0],Number(stp[1]));
    }
    console.log(`Tail has had ${grid.CountTailPositions()} unique locations`);
}

main();