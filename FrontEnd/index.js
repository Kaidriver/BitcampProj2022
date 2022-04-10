axios.get('http://localhost:3000/getDailyInfo').then((res) => {
    var hasDone = localStorage.getItem('hasDone');
    var currStreak = localStorage.getItem('currStreak');
    var maxStreak = localStorage.getItem('maxStreak');
    var wins = localStorage.getItem('wins');
    var gamesPlayed = localStorage.getItem('gamesPlayed');
    var lastWord = localStorage.getItem('lastWord');


    var guessNum = 0;

    var questionType = res["data"]["category"];
    var clueArray = res["data"]["clues"];
    var answer = res["data"]["answer"];
    var choices = res["data"]["choices"];

    if (hasDone == null) {
      hasDone = 0;
      localStorage.setItem('hasDone', 0);
    }
    else {
      if (lastWord != answer) {
        hasDone = 0;
      }
    }

    if (currStreak == null) {
      currStreak = 0;
      localStorage.setItem('currStreak', 0);
    }
    else {
      currStreak = parseInt(currStreak)
    }
    if (maxStreak == null) {
      maxStreak = 0;
      localStorage.setItem('maxStreak', 0);
    }
    else {
      maxStreak = parseInt(maxStreak)
    }

    if (wins == null) {
      wins = 0;
      localStorage.setItem('wins', 0);
    }
    else {
      wins = parseInt(wins)
    }

    if (gamesPlayed == null) {
      gamesPlayed = 0;
      localStorage.setItem('gamesPlayed', 0);
    }
    else {
      gamesPlayed = parseInt(gamesPlayed)
    }

    if (lastWord == null) {
      lastword = "";
      localStorage.setItem(lastWord, '')
    }

    document.getElementById('stat').addEventListener('click', () => {
      console.log("CLICK")
      document.getElementById("played-stat").innerHTML  = gamesPlayed;
      document.getElementById("win-stat").innerHTML  = Math.round(wins / (gamesPlayed) * 100);
      document.getElementById("current-streak-stat").innerHTML  = currStreak;
      document.getElementById("max-streak-stat").innerHTML  = maxStreak;
    })

    if (hasDone == 1) {
      document.getElementById('guessField').disabled = true;
      document.getElementById('subButton').disabled = true;
      document.getElementById('questionType').innerHTML = "Come back tomorrow for the next puzzle!"
    }
    else {
      let options = ""
      for (let choice in choices) {
        options += "<option>" + choices[choice] + "</option>"
      }

      document.getElementById("answers").innerHTML = options;

      var qType = document.getElementById("questionType");
      qType.innerHTML = "Guess the " + questionType;

      var clue = document.getElementById("clue-0");
      clue.innerHTML = (guessNum + 1) + ".) " + clueArray[guessNum];

      function getGuess() {
        var nameField = document.getElementById('guessField').value;
        var result = document.getElementById('result');
        document.getElementById('guessField').value = ""

        if (nameField != answer) {
          guessNum++;
          document.getElementById('guessField').classList.add("shake-class");
          if (guessNum >= 3) {
            localStorage.setItem('hasDone', 1);
            localStorage.setItem('lastWord', answer);
            if (currStreak > maxStreak) {
              localStorage.setItem('maxStreak', currStreak);
              maxStreak = currStreak;
            }
            localStorage.setItem('currStreak', 0);
            localStorage.setItem('gamesPlayed', gamesPlayed + 1);

            document.querySelector('.popup-header').innerHTML = "You Lose!"
            document.getElementById("played").innerHTML  = gamesPlayed + 1;
            document.getElementById("win").innerHTML  = Math.round(wins / (gamesPlayed + 1) * 100);
            document.getElementById("current-streak").innerHTML  = 0;
            document.getElementById("max-streak").innerHTML  = maxStreak;
            $('#exampleModal').modal()
          }
          else {
            clue = document.getElementById("clue-" + guessNum);

            if (clueArray[guessNum].includes(".png")) {
              clue.innerHTML = "<img src = 'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/spell/" + clueArray[guessNum] + "'>"
            }
            else {
              clue.innerHTML = (guessNum + 1) + ".) " + clueArray[guessNum];
            }
          }
        } else {
          localStorage.setItem('hasDone', 1);
          localStorage.setItem('lastWord', answer);
          if (currStreak + 1 > maxStreak) {
            localStorage.setItem('maxStreak', currStreak + 1);
            maxStreak = currStreak + 1;
          }
          localStorage.setItem('currStreak', currStreak + 1);
          localStorage.setItem('gamesPlayed', gamesPlayed + 1);
          localStorage.setItem('wins', wins + 1);

          document.getElementById("played").innerHTML  = gamesPlayed + 1;
          document.getElementById("win").innerHTML  = Math.round((wins + 1) / (gamesPlayed + 1) * 100);
          document.getElementById("current-streak").innerHTML  = currStreak + 1;
          document.getElementById("max-streak").innerHTML  = maxStreak;
          $('#exampleModal').modal()
        }
      }

      function callback() {
          document.getElementById('guessField').classList.remove('shake-class'); // or modify div.className
      }

      document.getElementById('guessField').addEventListener("webkitAnimationEnd", callback, false);

      var enterInput = document.getElementById("guessField");
      enterInput.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          getGuess()
        }
      });

      var subButton = document.getElementById('subButton');
      subButton.addEventListener('click', getGuess, false);
    }
  }).catch((err) => console.log(err))
