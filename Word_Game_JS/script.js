//Initialisations
var alphabets = Array.apply(undefined, Array(26)).map(function (x, y) {
  return String.fromCharCode(y + 97);
});
var keyboard = document.getElementById("keyboard");
var inputField = document.getElementById("usr");
var givenWord = document.getElementById("givenWord");
var startBtn = document.getElementById("startBtn");
var pauseBtn = document.getElementById("pauseBtn");
var submitBtn = document.getElementById("submitBtn");
var skipBtn = document.getElementById("skipBtn");
var stpBtn = document.getElementById("stpBtn");
var topName = document.getElementById("topName");
var topScore = document.getElementById("topScore");

//Bit of jQuery for fancy intro
$("#mainGame").hide();

$("#letsPlay").click(function () {
  $("#introDiv").hide();
  $("#mainGame").show();
});

function introDisplay() {
  topName.innerHTML = (
    JSON.parse(localStorage.getItem("highScore")) || { playerName: "" }
  ).playerName;
  topScore.innerHTML = (
    JSON.parse(localStorage.getItem("highScore")) || { playerScore: "" }
  ).playerScore;
  $("#mainGame").hide();
  $("#introDiv").show();
}

introDisplay();
//Only JS
//Variables
var score = 50;
var sec = 120;
var wrongWords = [];
var correctWords = [];

function newWord() {
  givenWord.innerHTML = data.stuff[randomiseMe(0, 1000)].word.toLowerCase();
}

function generator() {
  shuffle(alphabets);
  newWord();
}

function newKeyboard() {
  keyboard.innerHTML = "";
  for (var i = 0; i < 26; i++) {
    var buttons = document.createElement("button");
    buttons.innerHTML = alphabets[i];
    buttons.className = "btn btn-primary";
    buttons.type = "button";
    buttons.id = alphabets[i];
    buttons.addEventListener("click", doButtonPress);
    keyboard.appendChild(buttons);
  }
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function doButtonPress() {
  inputField.value += this.id;
}

function randomiseMe(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startPlaying() {
  generator();
  newKeyboard();
  clock = setInterval("countDown()", 1000);
}

function countDown() {
  if (!(sec == 0)) {
    sec--;
    document.getElementById("seconds").innerHTML = sec;
  } else {
    stopPlay();
  }
}

function checkWord() {
  if (givenWord.innerHTML == inputField.value.trim()) {
    sec += Math.round(givenWord.innerHTML.length / 2);
    score += Math.round(givenWord.innerHTML.length / 2);
    correctWords.push(givenWord.innerHTML);
    newWord();
    generator();
    newKeyboard();
  } else {
    wrongWords.push(givenWord.innerHTML);
    newWord();
  }
  inputField.value = "";
}

function backSpc() {
  inputField.value = inputField.value.slice(0, -1);
}

function skipWord() {
  newWord();
}

function resumePlay() {
  clock = setInterval("countDown()", 1000);
}

function pausePlay() {
  if (pauseBtn.innerHTML == "Pause") {
    clearInterval(clock);
    pauseBtn.innerHTML = "Resume";
  } else if (pauseBtn.innerHTML == "Resume") {
    pauseBtn.innerHTML = "Pause";
    resumePlay();
  }
}

function compare(currentScore) {
  var newName = prompt("Enter your name");
  var newPlayerStat = [];
  var highScore = JSON.parse(localStorage.getItem("highScore"));
  stats = {
    playerName: newName,
    wordsCorrect: correctWords,
    wordsWrong: wrongWords,
  };
  if (JSON.parse(localStorage.getItem(newName)) == null) {
    newPlayerStat.push(stats);
    localStorage.setItem(newName, JSON.stringify(newPlayerStat));
  } else {
    var oldPlayerStat = JSON.parse(localStorage.getItem(newName));
    oldPlayerStat.push(stats);
    localStorage.setItem(newName, JSON.stringify(oldPlayerStat));
  }
  if (!highScore || currentScore > highScore.playerScore) {
    var player = {
      playerName: newName,
      playerScore: currentScore,
    };
    localStorage.setItem("highScore", JSON.stringify(player));
  }
}

function stopPlay() {
  clearInterval(clock);
  inputField.value = "";
  compare(score);
  alert(score);
  if (wrongWords) alert("Wrong words : " + wrongWords);
  score = 25;
  sec = 25;
  introDisplay();
}
