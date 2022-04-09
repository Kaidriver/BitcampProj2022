console.log("HELLO")

function getUserName() {
var nameField = document.getElementById('guessField').value;
var result = document.getElementById('result');
console.log(nameField);
}

var subButton = document.getElementById('subButton');
subButton.addEventListener('click', getUserName, false);
