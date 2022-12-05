const fs = require('fs');

function printCrates(){
    for(let i=0;i<crates.length;i++){
        let draw = `${i+1}:`;
        for(let j=0;j<crates[i].length;j++){
            draw += ` ${crates[i][j]}`;
        }
        console.log(draw);
    }
}

function printAnswer(){
    let answer = "";
    for(let i=0;i<crates.length;i++){
        answer += crates[i][crates[i].length-1];
    }
    return answer;
}

let crates = [  ['N','R','G','P'],
                ['J','T','B','L','F','G','D','C'],
                ['M','S','V'],
                ['L','S','R','C','Z','P'],
                ['P','S','L','V','C','W','D','Q'],
                ['C','T','N','W','D','M','S'],
                ['H','D','G','W','P'],
                ['Z','L','P','H','S','C','M','V'],
                ['R','P','F','L','W','G','Z']
];

function shuffleCrates9000(number,from,to){
    for(let i=0;i<number;i++){
        crates[to-1].push(crates[from-1].pop());
    }
}

function shuffleCrates9001(number,from,to){
    let heap = new Array();
    for(let i=0;i<number;i++){
        heap.push(crates[from-1].pop());
    }
    for(let i=0;i<number;i++){
        crates[to-1].push(heap.pop());
    }
}

function main(){
    let rows = fs.readFileSync('input.txt', 'utf8').split("\n");
    for(let row of rows){
        let n = row.split(" ");
        // part 1
        //shuffleCrates9000( Number(n[1]),Number(n[3]),Number(n[5]) );
        // part 2
        shuffleCrates9001( Number(n[1]),Number(n[3]),Number(n[5]) );
    }
    console.log(`Top of crates is: ${printAnswer()}`);
}

main();