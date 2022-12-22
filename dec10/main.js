const fs = require('fs');

let crt = new Array();

function programExecutor(rows){
    let x = 1;
    let c = 0; // cycles
    let s = 0; // strength
    for(let row of rows){
        if(row == "noop"){
            c++; // do nothing for 1 cycle
            if(checkSignalStrength(c)){ s += (x*c);}
        } else {
            let cols = row.split(" ");
            if(cols[0] == "addx"){
                c++; // do nothing for 1 cycle
                if(checkSignalStrength(c)){ s += (x*c);}
                c++;
                if(checkSignalStrength(c)){ s += (x*c);}
                x += Number(cols[1]); // after second cycle
            }
        }
    }
    return s;
}

function checkSignalStrength(c){
    if((c-20) % 40 == 0){ 
        return true; 
    }
    return false;
}

function drawCRT(rows){
    let x = 1;
    let c = 0; // cycles
    for(let row of rows){
        if(row == "noop"){
            drawPixel(x,c);
            c++; 
        } else {
            let cols = row.split(" ");
            if(cols[0] == "addx"){
                drawPixel(x,c);
                c++; // do nothing for 1 cycle
                drawPixel(x,c);
                c++;
                x += Number(cols[1]); // after second cycle
            }
        }
    }
}

function drawPixel(x,c){
    let l = c%40;
    if( l >= x-1 && l <= x+1 ){
        crt[c] = "#";
    }
}

function printCRTOutput(){
    console.log("-----------------------");
    for(let y=0;y<6;y++){
        let row = "";
        for(let x=0;x<40;x++){
            let i = (40*y) + x;
            row += crt[i];
        }
        console.log(row);
    }
}

function main(){
    let rows = fs.readFileSync('input.txt', 'utf8').split("\n");
    console.log(`Part 1 strength is: ${programExecutor(rows)}`);
    for(let i=0;i<240;i++){
        crt.push(".");
    }
    drawCRT(rows);
    printCRTOutput();
}

main();