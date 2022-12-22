const fs = require('fs');

class Node{
    constructor(id){
        this.id = id;
    }
    getValue(){ return -1; }
}

class MathNode extends Node{
    constructor(id, operator){
        super(id);
        this.nodes    = new Array();
        this.operator = operator;
    }

    addNode(node){
        this.nodes.push(node);
    }

    getValue(){
        if(this.operator == "+"){
            return this.nodes[0].getValue() + this.nodes[1].getValue();
        } else if(this.operator == "-"){
            return this.nodes[0].getValue() - this.nodes[1].getValue();
        } else if(this.operator == "*"){
            return this.nodes[0].getValue() * this.nodes[1].getValue();
        } else if(this.operator == "/"){
            return this.nodes[0].getValue() / this.nodes[1].getValue();
        } else if(this.operator == "="){
            let left  = this.nodes[0].getValue();
            let right = this.nodes[1].getValue();
            return {"left": left, "right": right,"equals":(left == right)};
        }
    }
}

class NumberNode extends Node{
    constructor(id,value){
        super(id);
        this.value = value;
    }

    getValue(){
        return this.value;
    }
}

class HumanNode extends NumberNode{
    constructor(id, value){
        super(id, value);
    }

    setValue(value){
        this.value = value;
    }
}

let nodes = new Array();
let root  = null;
let human = null;

function getNode(id){
    for(let node of nodes){
        if(node.id == id){
            return node;
        }
    }
    return null;
}

function calculateNextNumber(firstInput, firstResult, secondInput, secondResult, shouldBe){
    let dif = secondResult - firstResult;
    let shouldBeDif = shouldBe - firstResult;
    let newNumber = (dif / (secondInput - firstInput)) * shouldBeDif;
    console.log(`dif of outcomes is: ${dif}`);
    console.log(`dif of outcomes should be: ${shouldBeDif}`);
    console.log(`human input should be: ${newNumber}`);
}

function smartHumanValue(){
    let humanValue = "9999999999999";
    let curDigit   = 0;
    for(let i=0;i<13;i++){
        let lower  = true;
        let curNum = 9;
        while(lower){
            let testNumber = humanValue.substring(0,curDigit) + curNum + humanValue.substring(curDigit + 1);
            human.value    = Number(testNumber);
            let answer     = root.getValue();
            lower          = answer.left < answer.right;
            if(answer.equals){
                console.log(`found answer ${human.value}`);
                return human.value;
            }
            curNum--;
        }
        humanValue = humanValue.substring(0,curDigit) + (curNum+2) + humanValue.substring(curDigit + 1);
        curDigit++;
    }
}

function main(){
    // Part 1
    let rows = fs.readFileSync('input.txt', 'utf8').split("\n");
    // add nodes to array
    for(let row of rows){
        let cols = row.split(" ");
        let node = null;
        if(cols[0] == "humn:"){
            node  = new HumanNode(cols[0],Number(cols[1]));
            human = node;
        } else if(cols.length == 2){
            node = new NumberNode(cols[0],Number(cols[1]));
        } else if( cols.length == 4 ){
            node = new MathNode(cols[0], cols[2]);
        } 
        nodes.push(node);
        if(node.id == "root:"){
            root = node;
            node.operator = "=";
        }
    }
    // connect nodes in Mathnodes
    for(let row of rows){
        let cols = row.split(" ");
        if( cols.length == 4 ){
            let node = getNode(cols[0]);
            node.addNode(getNode(cols[1]+":"));
            node.addNode(getNode(cols[3]+":"));
        } 
    }
    smartHumanValue();
}

main();