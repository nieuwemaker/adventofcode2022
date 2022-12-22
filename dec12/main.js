const fs = require('fs');

const DIR = {"RIGHT":0,"DOWN":1,"LEFT":2,"UP":3};

class Square{
    constructor(x,y, v){
        this.x = x;
        this.y = y;
        this.v = v;
        this.neighbours = new Map();
    }

    AddNeighbour(direction,square){
        this.neighbours.set(direction,square);
    }

    Equals(square){
        return (this.x == square.x && this.y == square.y);
    }
}

let map     = new Array();
let pathMap = new Array();
let start   = null;
let end     = null;

function createMap(file,width,height){
    let rows = fs.readFileSync(file, 'utf8').split("\n");
    // create raw map
    for(let y=0;y<height;y++){
        map.push(new Array());
        for(let x=0;x<width;x++){
            let v = rows[y].charAt(x);
            let s = new Square(x,y,v);
            map[y].push(s);
            if(v =='S')      { start = s; }
            else if(v == 'E'){ end   = s; }
        }
    }
    // connect neighbours for easier navigation
    for(let y=0;y<height;y++){
        for(let x=0;x<width;x++){
            if(x>0)               { map[y][x].AddNeighbour(DIR.LEFT, map[y][x-1]); }
            if(x+1<map[y].length) { map[y][x].AddNeighbour(DIR.RIGHT,map[y][x+1]); }
            if(y>0)               { map[y][x].AddNeighbour(DIR.UP,   map[y-1][x]); }
            if(y+1<map.length)    { map[y][x].AddNeighbour(DIR.DOWN, map[y+1][x]); }
        }
    }
}

function createPathMap(){
    // create raw path map to start with
    for(let y=0;y<map.length;y++){
        pathMap.push(new Array());
        for(let x=0;x<map[y].length;x++){
            pathMap[y].push(99999);
        }
    }
    addtoPathMap(start, 0);
}

function addtoPathMap(to, distance){
    if(pathMap[to.y][to.x] > distance){
        pathMap[to.y][to.x] = distance;
        for( let [key,value] of to.neighbours){
            if(canTravel(to,value)){
                addtoPathMap(value,distance+1);
            }
        }
    }
}

function canTravel(from, to){
    if(from.v == 'S'){ return true; }
    if(from.v == 'z' && to.v == 'E'){ return true; }
    if(to.v == 'E'){ return false; } // to make sure you can only go from z to E
    if(to.v.charCodeAt(0) - 1 <= from.v.charCodeAt(0)){
        return true;
    } 
    return false;
}

function printPathMap(){
    for(let y=0;y<map.length;y++){
        let row = "";
        for(let x=0;x<map[y].length;x++){
            row += `\t${pathMap[y][x]}`;
        }
        console.log(row);
    }
}

function main(){
    //createMap('test_input.txt', 8,5);
    createMap('input.txt', 101,41);
    createPathMap();
    printPathMap();
    console.log(pathMap[end.y][end.x]);
}

main();