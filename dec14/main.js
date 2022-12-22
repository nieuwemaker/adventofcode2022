const fs = require('fs');

function determineCaveDimensions(rows){
    let minX = 500;
    let maxX = 500;
    let minY = 0;
    let maxY = 0;
    for(let row of rows){
        let pairs = row.split(" -> ");
        for(let pair of pairs){
            let coord = pair.split(",");
            if(Number(coord[0]) < minX){ minX = Number(coord[0]); }
            if(Number(coord[0]) > maxX){ maxX = Number(coord[0])+1; }
            if(Number(coord[1]) < minY){ minY = Number(coord[1]); }
            if(Number(coord[1]) > maxY){ maxY = Number(coord[1])+1; }
        }
    }
    return {"minX":minX,"minY":minY,"maxX":maxX,"maxY":maxY};
}

let cave = new Array();
let offX = 0;
let offY = 0;

function createCave(dims){
    cave       = new Array();
    let width  = dims.maxX - dims.minX;
    let height = dims.maxY - dims.minY;
    offX = dims.minX;
    offY = dims.minY;
    for(let y=0;y<height;y++){
        cave.push(new Array());
        for(let x=0;x<width;x++){
            cave[y].push(".");
        }
    }
}

function poplulateCaveWithRock(rows){
    for(let row of rows){
        let pairs = row.split(" -> ");
        for(let i=1;i<pairs.length;i++){
            drawRock(createPair(pairs[i-1]),createPair(pairs[i]));
        }
    }
}

function drawRock(from, to){
    let vertical = (from.y != to.y);
    if(vertical){
        let distance = Math.abs(to.y - from.y);
        let step     = (to.y > from.y)?1:-1;
        for(let i=0;i<=distance;i++){
            let y = from.y + (i*step) - offY;
            cave[y][from.x-offX] = "#";
        }
    } else {
        let distance = Math.abs(to.x - from.x);
        let step     = (to.x > from.x)?1:-1;
        for(let i=0;i<=distance;i++){
            let x = from.x + (i*step) - offX;
            cave[from.y-offY][x] = "#";
        }
    }
}

function createPair(pair){
    let coord = pair.split(",");
    return {"x":Number(coord[0]),"y":Number(coord[1])};
}

function printCave(){
    for(let y=0;y<cave.length;y++){
        let row = "";
        for(let x=0;x<cave[y].length;x++){
            row += cave[y][x];
        }
        console.log(row);
    }
}

function dropSand(){
    let movable = true;
    let x = 500-offX;
    let y = 0;
    if(cave[y][x] != '.'){ return false; } // no sand can fall anymore
    while(movable){
        movable = false;
        // check if in boundary or it falls off and then it is done
        if(x < 0 || x >= cave[y].length || y < 0 || y+1 >= cave.length){ return false; }
        if( cave[y+1][x] == '.'){ // try one step down
            y++; 
            movable = true;
        } else if( x-1 < 0){ //drops off in void
            return false;
        } else if( x-1 >= 0 && cave[y+1][x-1] == '.'){ // try left
            y++;
            x--;
            movable = true;
        } else if( x >= cave[y].length){ //drops off in void
            return false;
        } else if( x+1 < cave[y].length && cave[y+1][x+1] == '.'){ // try right
            y++;
            x++;
            movable = true;
        } else { // stuck so place here
            cave[y][x] = 'o';
            return true;
        }
    }
    return false;
}

function dropSandUntilNotPossible(){
    let counter = 0;
    while(dropSand()){
        counter++;
    }
    console.log(`Succesfully dropped ${counter} sand`);
}

function main(){
    //let rows = fs.readFileSync('test_input.txt', 'utf8').split("\n");
    let rows = fs.readFileSync('input.txt', 'utf8').split("\n");
    let dims = determineCaveDimensions(rows);
    // create cave array
    createCave(dims);
    poplulateCaveWithRock(rows);
    dropSandUntilNotPossible();
    printCave();
}

main();