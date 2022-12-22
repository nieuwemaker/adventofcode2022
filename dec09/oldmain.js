const fs = require('fs');

let DIR  = ["L","R","U","D","LU","RU","LD","RD"];
let CHAR = {"HEAD":'H',"TAIL":'T',"NONE":'.'};

let MOVE = {"R-R":"R", "RU-U":"RU"};

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
        this.grid = new Array();
        this.head = null;
        this.tail = null;
    }

    AddRow(cols){
        let length = this.grid.push(new Array());
        let row = this.grid[length-1];
        let x = 0;
        for(let col of cols){
            let position = new Position(x,length-1);
            if(col == 'H'){ 
                this.head     = new Character(position,CHAR.HEAD);
                position.AddCharacter(this.head);
             }
            else if(col == 'T'){ 
                this.tail     = new Character(position,CHAR.TAIL);
                position.AddCharacter(this.tail);
             }
            row.push(position);
            x++;
        }
    }

    CreateNeighbours(){
        for(let y=0;y<this.grid.length;y++){
            for(let x=0;x<this.grid[y].length;x++){
                let pos = this.grid[y][x];
                if(x>0){ // left and left-up
                    pos.AddNeighbour("L",this.grid[y][x-1]);
                    if(y > 0){ pos.AddNeighbour("LU",this.grid[y-1][x-1]); }
                }
                if(x+1<this.grid[y].length){ // right and right-up
                    pos.AddNeighbour("R",this.grid[y][x+1]);
                    if(y > 0){ pos.AddNeighbour("RU",this.grid[y-1][x+1]); }
                }
                if(y>0){ // up
                    pos.AddNeighbour("U",this.grid[y-1][x]);
                }
                if(y+1<this.grid.length){ // down, down-left and down-right
                    pos.AddNeighbour("D",this.grid[y+1][x]);
                    if(x > 0){ pos.AddNeighbour("LD",this.grid[y+1][x-1]); }
                    if(x+1 <this.grid[y].length){ pos.AddNeighbour("RD",this.grid[y+1][x+1]); }
                }
                //console.log(`${pos.x}-${pos.y} has ${pos.neighbours.size} neighbours`);
            }
        }
    }

    CreateTailIfNeeded(){
        if(this.tail == null ){
            this.tail = new Character(this.head.position,CHAR.TAIL);
            this.head.position.AddCharacter(this.tail);
        }
    }

    MoveHead(dir, steps){
        for(let i=0;i<steps;i++){
            //console.log("-----");
            //console.log(this.print());
            this.head.move(dir);
            //console.log(this.print());
            this.MoveTail();
            
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
        for(let y=0;y<this.grid.length;y++){
            for(let x=0;x<this.grid[y].length;x++){
                if(this.grid[y][x].tailWasHere){ count++;}
            }
        }
        return count;
    }

    print(){
        let grid = "";
        for(let y=0;y<this.grid.length;y++){
            for(let x=0;x<this.grid[y].length;x++){
                grid += this.grid[y][x].print();
            }
            grid += "\n";
        }
        return grid;
    }
}

function main(){
    let gridInput = fs.readFileSync('test-ini-state.txt', 'utf8').split("\n");
    let steps     = fs.readFileSync('test-input.txt', 'utf8').split("\n");
    // Create the grid
    let grid = new Grid();
    for(let row of gridInput){
        grid.AddRow(row.split(""));
    }
    grid.CreateNeighbours();
    grid.CreateTailIfNeeded();
    // Run the steps
    for(let step of steps){
        let stp = step.split(" ");
        grid.MoveHead(stp[0],Number(stp[1]));
    }
    console.log(`Tail has had ${grid.CountTailPositions()} unique locations`);
}

main();