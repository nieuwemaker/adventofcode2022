const fs = require('fs');

/*
function filterDoubleLetters(rucksack){
    for(let i=0;i<rucksack.length;i++){
        let char     = rucksack.charAt(i);
        let replacer = new RegExp(char, 'g');
        for(let j=i+1;j<rucksack.length;j++){
            if(char == rucksack.charAt(j)){
                rucksack = rucksack.substring(0,j) + rucksack.substring(j).replace(replacer,'');
                break;
            }
        }
    }
    return rucksack;
}
*/

function ratePriority(char){
    let rate = "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return rate.search(char);
}

function splitCompareAndPrioritise(rucksack){
    let halfLength = rucksack.length/2;
    let doubleItem = "";
    for(let i=0;i<halfLength;i++){
        if(rucksack.includes(rucksack.charAt(i),halfLength)){
            doubleItem = rucksack.charAt(i);
        }
    }
    return ratePriority(doubleItem);
}

function findBadgeAndPrioritise(rucksacks){
    let charIndex = new Map();
    for(let rucksack of rucksacks){
        rucksack = rucksack.replace(/(.)(?=.*\1)/g, "");
        for(let i=0;i<rucksack.length;i++){
            let char = rucksack.charAt(i);
            if(charIndex.has(char)){
                charIndex.set(char, charIndex.get(char)+1);
            } else {
                charIndex.set(char, 1);
            }
        }
    }
    for(let [key,value] of charIndex){
        if(value == 3){
            return ratePriority(key);
        }
    }
}

function main(){
    // Part 1
    let rows = fs.readFileSync('input.txt', 'utf8').split("\n");
    let sum  = 0;
    for(let row of rows){
        sum += splitCompareAndPrioritise(row);
    }
    console.log(`Sum of priorities of Part 1 is: ${sum}`);
    // Part 2
    sum = 0;
    for(let i=0;i<rows.length;i+=3){
        sum += findBadgeAndPrioritise([rows[i],rows[i+1],rows[i+2]]);
    }
    console.log(`Sum of priorities of Part 2 is: ${sum}`);
}

main();