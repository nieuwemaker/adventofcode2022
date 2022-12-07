const fs = require('fs');

class File{
    constructor(size, name){
        this.size = size;
        this.name = name;
    }
}

class Folder{
    constructor(parent, name){
        this.parent   = parent;
        this.name     = name;
        this.files    = new Array();
        this.children = new Array();
    }

    AddFile(file){
        this.files.push(file);
    }

    AddChild(child){
        this.children.push(child);
    }

    GetChild(name){
        for(let child of this.children){
            if(child.name == name){
                return child;
            }
        }
        return null;
    }

    CalculateFolderSize(){
        let size = 0;
        for(let file of this.files){
            size += file.size;
        }
        for(let child of this.children){
            size += child.CalculateFolderSize();
        }
        return size;
    }
}

let root    = new Folder(null,"/");
let folders = new Array();
let current = root;

function handleChangeDir(row){
    let cols = row.split(" ");
    if(cols[2] == "/"){
        current = root;
    } else if(cols[2] == ".."){
        current = current.parent;
    } else {
        let request = current.GetChild(cols[2]);
        if( request != null ){
            current = request;
        }
    }
}

function createDir(row){
    let cols   = row.split(" ");
    let folder = new Folder(current,cols[1]);
    current.AddChild(folder);
    folders.push(folder);
}

function createFile(row){
    let cols = row.split(" ");
    let file = new File(Number(cols[0]),cols[1]);
    current.AddFile(file);
}

function CalculateAllFoldersBelow(number){
    let total = 0;
    for(let folder of folders){
        let sum = folder.CalculateFolderSize();
        if( sum <= number ){
            total += sum;
        } 
    }
    console.log(`Total sum of filesizes below ${number} is: ${total}`);
}

function GetSmallestNeededFolder(){
    let smallestFolder = root;
    let smallestValue  = root.CalculateFolderSize();
    let minNeeded      = smallestValue - 40000000;
    console.log(`Needed space is: ${minNeeded}`);
    for(let folder of folders){
        let size = folder.CalculateFolderSize();
        if( size >= minNeeded && size < smallestValue ){
            smallestFolder = folder;
            smallestValue  = size;
        }
    }
    console.log(`Smallest possible folder is ${smallestFolder.name} with size ${smallestValue}`);
}

function main(){
    let rows = fs.readFileSync('input.txt', 'utf8').split("\n");
    for(let row of rows){
        if( row.startsWith("$ cd")){
            handleChangeDir(row);
        } else if( row.startsWith("dir")){
            createDir(row);
        } else if( row.startsWith("$ ls")){
            // do nothing
        } else {
            createFile(row);
        }
    }
    console.log(`Total filesize of root: ${root.CalculateFolderSize()}`);
    // Part 1: Everything smaller than 100.000
    CalculateAllFoldersBelow(100000);
    //root.printContent(0);
    GetSmallestNeededFolder();
}

main();