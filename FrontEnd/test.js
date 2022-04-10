var gamesPlayed = 0;
var gamesWon = 0;
var numGuesses;
var streak = 0;
var maxStreak = 0;
var won = true;
var guessArray = [];

// User plays a game

gamesPlayed++;
guessArray[numGuesses - 1]++;
if (won == true) {
  gamesWon++;
  streak++;
}
if (streak >= maxStreak) {
  maxStreak = streak;
}

var winPercentage = gamesWon / gamesPlayed;

window.localStorage.setItem('played', gamesPlayed.toString());
window.localStorage.setItem('streak', streak.toString());
window.localStorage.setItem('max streak', maxStreak.toString());
window.localStorage.setItem('win %', winPercentage.toString());
window.localStorage.setItem('guess distribution', guessArray.toString());

window.localStorage.getItem('played');
window.localStorage.getItem('streak');
window.localStorage.getItem('max streak');
window.localStorage.getItem('win %');
window.localStorage.getItem('guess distribution');

console.log(window.localStorage.getItem('played'));
