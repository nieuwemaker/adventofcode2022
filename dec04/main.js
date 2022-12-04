const fs = require('fs');

class Pairs{
    constructor(pairs){
        console.log(`First: ${pairs[0]} second: ${pairs[1]}`);
        let fir     = pairs[0].split("-");
        this.first  = {"min":Number(fir[0]),"max":Number(fir[1])};
        let sec     = pairs[1].split("-");
        this.second = {"min":Number(sec[0]),"max":Number(sec[1])};
    }

    fullyContains(){
        return ((this.first.min >= this.second.min && this.first.max <= this.second.max) ||
                (this.second.min >= this.first.min && this.second.max <= this.first.max) );
    }

    overlaps(){
        return (this.first.max >= this.second.min && this.first.min <= this.second.max);
    }
}

function main(){
    let rows = fs.readFileSync('input.txt', 'utf8').split("\n");
    // Part 1: How many pairs fully contain the other pair
    let containCounter = 0;
    let overlapCounter = 0;
    for(let row of rows){
        let pair = new Pairs(row.split(","));
        if(pair.fullyContains()){
            containCounter++;
        }
        if(pair.overlaps()){
            overlapCounter++;
        }
    }
    console.log(`${containCounter} pairs need serious reconsideration`);
    console.log(`${overlapCounter} pairs overlap`);
}

main();