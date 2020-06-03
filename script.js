const gameContainer = document.getElementById("game");
const button = document.querySelector('#reset');
const bsButton = document.querySelector('#reset-bs');
let prevCard = {};
let match = false;
let wait = false;
let score = 0;
let bestScore = 99999999;

if (localStorage.bestScore) {
  bestScore = JSON.parse(localStorage.bestScore);
  if (bestScore != 99999999) {
    document.querySelector('#best-score').innerText = bestScore;
  }
} else {
  localStorage.bestScore = JSON.stringify(bestScore);
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.style.backgroundColor = 'silver';

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// this function counts how many cards are currently turned over
// if the number is even, we will know we need to check for a match
// if the number is odd, we need to wait for another card to be clicked
function countClickedCards() {
  const cards = document.querySelector('#game').children;
  let count = 0;
  for (let card of cards) {
    if (card.style.backgroundColor != 'silver') {
      count++;
    }
  }
  return count;
}

function checkMatch(clickedCard, prevCard) {
  if (clickedCard.style.backgroundColor === prevCard.style.backgroundColor) {
    return true;
  } else {
    return false;
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  const clickedCard = event.target;
  if (clickedCard.style.backgroundColor === 'silver' && !wait) {
    clickedCard.style.backgroundColor = clickedCard.classList.value;
    const turnedCards = countClickedCards();
    
    if (turnedCards === COLORS.length) {
      // game over
      match = true;
      score++;

      if (score < bestScore) {
        localStorage.bestScore = JSON.stringify(score);
        bestScore = score;
        document.querySelector('#best-score').innerText = score;
      }
    } else if (turnedCards % 2 === 0) {
      // even number of turned cards
      // check for match
      match = checkMatch(clickedCard, prevCard);
      score++;
      if (match) {
        // match
      } else {
        // no match
        wait = true;
        setTimeout(function () {
          clickedCard.style.backgroundColor = 'silver';
          prevCard.style.backgroundColor = 'silver';
          wait = false;
        }, 1000);
      }
    } else {
      // odd number of turned cards
      // record background color of turned card
      prevCard = clickedCard;
      // wait for another click
    }
  }
  document.querySelector('#current-score').innerText = score;
}

// when the DOM loads
getDeck();
let shuffledColors = shuffle(COLORS);
createDivsForColors(shuffledColors);

// this function gets a number of cards from the user and assigns random colors to the cards
function getDeck () {
  const colorList = ['salmon', 'crimson', 'red', 'darkred',
  'orangered', 'gold', 'darkorange', 'yellow', 'lawngreen',
  'limegreen', 'green', 'greenyellow', 'springgreen',
  'palegreen', 'olivedrab', 'cyan', 'mediumaquamarine',
  'lightseagreen', 'teal', 'powderblue', 'dodgerblue', 'steelblue',
  'blue', 'navy', 'darkslateblue', 'violet', 'magenta', 'blueviolet',
  'indigo', 'lightpink', 'mediumvioletred', 'saddlebrown', 'maroon'];

  let cardNum = prompt('How many cards?', 'Enter an even number');
  while (cardNum % 2 != 0 || cardNum > colorList.length * 2) {
    cardNum = prompt(`Invalid input! Please enter an even number ${colorList.length * 2} or less.`, 'Enter an even number');
  }
  COLORS = [];

  for (let i = 0; i < cardNum / 2; i++) {
    let randColor = Math.floor(Math.random() * colorList.length);
    COLORS.push(colorList[randColor]);
    COLORS.push(colorList[randColor]);
    colorList.splice(randColor, 1);
  }

  return COLORS;
}

// this function resets the game
button.addEventListener('click', function () {
  document.querySelector('#game').innerHTML = '';
  COLORS = getDeck();
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  score = 0;
  document.querySelector('#current-score').innerText = 0;
})

// this function resets the best score
bsButton.addEventListener('click', function () {
  localStorage.bestScore = JSON.stringify(999999999);
  bestScore = 999999999;
  document.querySelector('#best-score').innerHTML = '&nbsp;'
})