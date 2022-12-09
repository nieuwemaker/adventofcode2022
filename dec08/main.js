const fs = require('fs');

let DIR = {"LEFT":0, "RIGHT":1,"UP":2,"DOWN":3};
let forest = new Array();

class Tree{
    constructor(size){
        this.size      = size;
        this.visible   = true;
        this.view      = [0,0,0,0]; //all 4 directions
        this.scenicScore = 0;
    }

    CalculateScenicScore(){
        this.scenicScore = this.view[DIR.LEFT] * this.view[DIR.RIGHT] * this.view[DIR.UP] * this.view[DIR.DOWN];
    }
}

function CheckAllTreesHidden(){
    for(let y=1;y<forest.length-1;y++){
        for(let x=1;x<forest[y].length-1;x++){
            forest[y][x].visible = CheckIfTreeIsHidden(x,y);
        }
    }
}

function findHighestScenicScore(){
    let highest = 0;
    for(let y=0;y<forest.length;y++){
        for(let x=0;x<forest[y].length;x++){
            if(forest[y][x].scenicScore > highest){
                highest = forest[y][x].scenicScore;
            }
        }
    }
    return highest;
}

function countVisibleTrees(){
    let count = 0;
    for(let y=0;y<forest.length;y++){
        for(let x=0;x<forest[y].length;x++){
            if(forest[y][x].visible){ count++; }
        }
    }
    return count;
}

function CheckIfTreeIsHidden(x,y){
    let visible = [true, true, true, true];
    for(let i=x-1;i>=0;i--){ // left
        if(forest[y][x].size <= forest[y][i].size){ 
            visible[DIR.LEFT]           = false; 
            forest[y][x].view[DIR.LEFT] = x-i;
            break; }
    }
    for(let i=x+1;i<forest[y].length;i++){ // right
        if(forest[y][x].size <= forest[y][i].size){ 
            visible[DIR.RIGHT]           = false; 
            forest[y][x].view[DIR.RIGHT] = i-x;
            break; }
    }
    for(let i=y-1;i>=0;i--){ // up
        if(forest[y][x].size <= forest[i][x].size){ 
            visible[DIR.UP]           = false; 
            forest[y][x].view[DIR.UP] = y-i;
            break; }
    }
    for(let i=y+1;i<forest.length;i++){ // down
        if(forest[y][x].size <= forest[i][x].size){ 
            visible[DIR.DOWN]           = false; 
            forest[y][x].view[DIR.DOWN] = i-y;
            break; }
    }
    if(visible[DIR.LEFT]) { forest[y][x].view[DIR.LEFT]  = x; }
    if(visible[DIR.RIGHT]){ forest[y][x].view[DIR.RIGHT] = forest.length - x - 1; }
    if(visible[DIR.UP])   { forest[y][x].view[DIR.UP]    = y; }
    if(visible[DIR.DOWN]) { forest[y][x].view[DIR.DOWN]  = forest.length - y - 1; }
    forest[y][x].CalculateScenicScore();
    return !(!visible[DIR.LEFT] && !visible[DIR.RIGHT] && !visible[DIR.UP] && !visible[DIR.DOWN]);
}

function main(){
    let rows = fs.readFileSync('input.txt', 'utf8').split("\n");
    for(let i=0;i<rows.length;i++){
        let trees = rows[i].split("");
        forest[i] = new Array();
        for(let tree of trees){
            forest[i].push(new Tree(tree));
        }
    }
    CheckAllTreesHidden();
    console.log(`There are ${countVisibleTrees()} trees visible`);
    console.log(`The highest scenic score in the forest is ${findHighestScenicScore()}`);
}

main();