const fs = require('fs');

function detectStartOfSequenceIndex(buffer, length){
    for(let i=0;i<buffer.length - length;i++){
        if(HasUniqueCharacters(buffer.substring(i,i+length))){
            return i+4;
        }
    }
}

function HasUniqueCharacters(buffer){
    for(let i=0;i<buffer.length;i++){
        if(buffer.substring(i+1).indexOf(buffer.charAt(i)) > -1){ 
            return false; 
        }
    }
    return true;
}

function main(){
    let file  = fs.readFileSync('input.txt', 'utf8');
    let index = detectStartOfSequenceIndex(file,4);
    console.log(`Start of Marker is on index: ${index}`);
    index = detectStartOfSequenceIndex(file,14);
    console.log(`Start of Message is on index: ${index}`);
}

main();