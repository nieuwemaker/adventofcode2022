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

let nodes = new Array();

function getNode(id){
    for(let node of nodes){
        if(node.id == id){
            return node;
        }
    }
    return null;
}

function main(){
    // Part 1
    let rows = fs.readFileSync('input.txt', 'utf8').split("\n");
    // add nodes to array
    for(let row of rows){
        let cols = row.split(" ");
        let node = null;
        if(cols.length == 2){
            node = new NumberNode(cols[0],Number(cols[1]));
        } else if( cols.length == 4 ){
            node = new MathNode(cols[0], cols[2]);
        } else {
            console.log(`Illigal row found: ${row}`);
        }
        nodes.push(node);
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
    // get root node and calclulate answer;
    let root = getNode("root:");
    console.log(root.getValue());
}

main();