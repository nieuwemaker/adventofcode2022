const fs = require('fs');

class Elf{
    constructor(name){
        this.name     = name;
        this.calories = new Array();
        this.total    = -1;
    }

    AddCalories(number){
        this.calories.push(number);
    }

    CalcTotalCalories(){
        if(this.total == -1){
            let total = 0;
            for(let calorie of this.calories){
                total += calorie;
            }
            this.total = total;
        }
        return this.total;
    }
}

class ElfManager{
    constructor(){
        this.elves = new Array();
    }

    CreateElvesFromString(input){
        let elfRows = input.split("\n\n");
        let counter = 1;
        for(let elfRow of elfRows){
            let calRows = elfRow.split("\n");
            if(calRows.length > 0){
                let elf = new Elf(`Elf ${counter}`);
                for(let calRow of calRows){
                    elf.AddCalories(Number(calRow));
                }
                elf.CalcTotalCalories();
                this.AddElf(elf);
                counter++;
            }
        }
    }

    AddElf(elf){
        this.elves.push(elf);
    }

    FindElfWithHighestCalories(){
        let highest = this.elves[0];
        for(let elf of this.elves){
            if(elf.total > highest.total){
                highest = elf;
            }
        }
        return highest;
    }

    FindTopThreeElvesWithHighestCalories(){
        this.elves.sort(
            function(a,b){
                return b.total - a.total;
            }
        );
        return {
            "top3Elves": [this.elves[0],this.elves[1],this.elves[2]],
            "totalCalories": this.elves[0].total + this.elves[1].total + this.elves[2].total
        };
    }
}

function main(){
    let input      = fs.readFileSync('input.txt', 'utf8');
    let elfManager = new ElfManager();
    elfManager.CreateElvesFromString(input);
    // Part 1: Find Elf with Highest Calories
    let elf = elfManager.FindElfWithHighestCalories();
    console.log(`Elf with Highest calories: ${elf.name} has ${elf.total} calories`);
    // Part 2: Find top 3 Elves with highest Calories
    let answer = elfManager.FindTopThreeElvesWithHighestCalories();
    console.log(`Total calorie of top 3 elves is: ${answer.totalCalories}`);
}

main();