const fs = require('fs');

class Monkey{
    constructor(number,items,op,test,ifTrue,ifFalse, list){
        this.number    = number;
        this.items     = items;
        this.operation = op;
        this.test      = test;
        this.ifTrue    = ifTrue;
        this.ifFalse   = ifFalse;
        this.list      = list;
        this.inspections = 0;
    }

    print(){
        let itemString = "";
        for(let item of this.items){
            itemString += `${item} `;
        }
        console.log(`Monkey ${this.number}: ${itemString} [${this.items.length}]`);
    }

    inspectAll(){
        for(let item of this.items){
            let worry = Math.floor(this.ChangeWorryLevel(item));
            if(worry % this.test == 0){
                this.list[this.ifTrue].AddItem(worry);
            } else {
                this.list[this.ifFalse].AddItem(worry);
            }
            this.inspections++;
        }
        // reset the array
        this.items = new Array();
    }

    ChangeWorryLevel(item){
        let answer = item;
        let ops    = this.operation.split(" ");
        if(ops[1] == "old"){
            answer = item * item;
        } else if(ops[0] == "*"){
            answer = item * Number(ops[1]);
        } else if(ops[0] == "+"){
            answer = item + Number(ops[1]);
        }
        return answer % 9699690;
    }

    AddItem(item){
        this.items.push(item);
    }
}

let monkeys = new Array();

function monkeyBusiness(rounds){
    for(let i=0;i<rounds;i++){
        for(let monkey of monkeys){
            monkey.inspectAll();
        }
    }
    for(let monkey of monkeys){
        console.log(`Monkey ${monkey.number} did ${monkey.inspections} inspections`);
    }
}

function main(){
    
    monkeys.push(new Monkey(0,[98, 97, 98, 55, 56, 72],"* 13",11,4,7,monkeys));
    monkeys.push(new Monkey(1,[73, 99, 55, 54, 88, 50, 55],"+ 4",17,2,6,monkeys));
    monkeys.push(new Monkey(2,[67, 98],"* 11",5,6,5,monkeys));
    monkeys.push(new Monkey(3,[82, 91, 92, 53, 99],"+ 8",13,1,2,monkeys));
    monkeys.push(new Monkey(4,[52, 62, 94, 96, 52, 87, 53, 60],"* old",19,3,1,monkeys));
    monkeys.push(new Monkey(5,[94, 80, 84, 79],"+ 5",2,7,0,monkeys));
    monkeys.push(new Monkey(6,[89],"+ 1",3,0,5,monkeys));
    monkeys.push(new Monkey(7,[70, 59, 63],"+ 3",7,4,3,monkeys));
    monkeyBusiness(10000);
}

main();