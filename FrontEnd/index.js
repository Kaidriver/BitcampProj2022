
var guessNum = 0;
var questionType = "Champion";
var clueArray = ["When The Champion dies, his body quickly becomes unstable and overly shiny, just to blow up a moment later, much like a nuclear-powered machine.", "Passive: Mana Surge", "the Magus Ascendant"];
var answer = "Xerath";

var qType = document.getElementById("questionType");
qType.innerHTML = "Guess the " + questionType;

var clue = document.getElementById("clue-0");
clue.innerHTML = (guessNum + 1) + ".) " + clueArray[guessNum];

function getGuess() {
  var nameField = document.getElementById('guessField').value;
  var result = document.getElementById('result');
  console.log(nameField);
  if (nameField != answer) {
    guessNum++;
    clue = document.getElementById("clue-" + guessNum);
    clue.innerHTML = (guessNum + 1) + ".) " + clueArray[guessNum];
  } else {
    alert("You Won! :)");
  }
}

var subButton = document.getElementById('subButton');
subButton.addEventListener('click', getGuess, false);
