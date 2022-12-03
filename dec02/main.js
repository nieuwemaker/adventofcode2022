const fs = require('fs');

function getMatchPoints(round){
    const lost = new RegExp('^(A Z|B X|C Y)');
    const win  = new RegExp('^(A Y|B Z|C X)');
    if(lost.test(round))    { return 0; } 
    else if(win.test(round)){ return 6; }
    return 3;
}

function getHandPoints(round){
    let hand = round.charAt(2);
    if(hand == "X")     { return 1; }
    else if(hand == "Y"){ return 2; }
    else if(hand == "Z"){ return 3; }
    return 99999;
}

function chooseHand(round){
    let elfHas = round.charAt(0);
    let loose  = {"A":"Z","B":"X","C":"Y"};
    let draw   = {"A":"X","B":"Y","C":"Z"};
    let win    = {"A":"Y","B":"Z","C":"X"};
    let hand   = round.charAt(2);
    if(hand == "X")     { return loose[elfHas];} 
    else if(hand == "Y"){ return draw[elfHas]; } 
    else                { return win[elfHas];  }
}

function calculateScore(round){
    return getHandPoints(round) + getMatchPoints(round);
}

function main(){
    let guide = fs.readFileSync('guide.txt', 'utf8');
    let rounds = guide.split("\n");
    // Part 1: calculate total score
    let totalScore = 0;
    for(let round of rounds){
        if(round.length > 0){
            let score = calculateScore(round);
            totalScore += score;
        }
    }
    console.log(`Total score part 1: ${totalScore}`);
    // Part 2: new instructions to follow
    totalScore = 0;
    for(let round of rounds){
        if(round.length > 0){
            let reactWith = chooseHand(round);
            let newRound  = `${round.charAt(0)} ${reactWith}`;
            let score     = calculateScore(newRound);
            totalScore += score;
            //console.log(`Hand was ${round} became ${newRound} with score ${score}`);
        }
    }
    console.log(`Total score part 2: ${totalScore}`);
}

main();