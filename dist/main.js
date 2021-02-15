// main div where cards will be rendered
const board = document.querySelector('.board');

// restart button reloads the page
const restart = document.querySelector('.restart');
restart.addEventListener('click', function () {
  location = location;
});

// info button selector
const info = document.querySelector('.info');
const infoPopup = document.querySelector('.infoPopup');

// info popup become visible for 10 seconds...
info.addEventListener('click', function () {
  infoPopup.classList.remove('hidden');
  setTimeout( function () {
    infoPopup.classList.add('hidden');
  }, 10000);
});

// ...or closed if OK is clicked
const okInfo = document.querySelector('.okInfo');
okInfo.addEventListener('click', function() {
  infoPopup.classList.add('hidden');
});

// initial form popup selector
const setPopup = document.querySelector('.setPopup');
let setupForm = document.querySelector('.setupForm');

// score label selector
let scoreLabel = document.querySelector('.scoreLabel');

// variables setup
let flippedCards = 0;     // total number of flips
let flippedValue = [];    // stores the value of the 2 cards to check if matching
let flippedPos = [];      // stores the position in the board of the 2 flipped cards
let pairsFound = 0;       // increments on every pair found
let level;
let cardSet = 'vegs';

// function to randomly re-order array elements
const shuffle = arr => {
  const result = [];
  for (let i = arr.length-1; i >= 0; i--) {
    // picks an integer between 0 and i:
    const r = Math.floor(Math.random()*(i+1));
    // inserts the arr[i] element in the r-th free space in the shuffled array:
    for(let j = 0, k = 0; j <= arr.length-1; j++) {
      if(result[j] === undefined) {
        // if array contains objects, this doesn't clone them! Use a better clone function instead, if that is needed. 
        if(k === r) {
          result[j] = arr[i];
          break;
        }
        k++;
      }
    }
  }
  return result;
}

// function to show the front of the flipped card
let flipCard = (e) => {
  // is a card clicked on back face?  
  if (e.target.classList.contains('retro') && flippedValue.length < 2) {

    flippedCards++;
    scoreLabel.innerHTML = `moves: ${Math.floor(flippedCards/2)}`;

    // hiding back face and showing the front
    let retro = e.target;
    retro.classList.add('hidden');
    let fronte = retro.parentElement.children[1];
    fronte.classList.remove('hidden');

    // storing value and position in arrays
    flippedValue.push(retro.parentElement.dataset.num);
    flippedPos.push(retro.parentElement.dataset.ord);

    // when we got 2 flipped cards they are compared
    if (flippedValue.length === 2) {
      compare();
    }
  }
};

// function to compare 2 cards
let compare = () => {
  // are they matching?
  if (flippedValue[0] === flippedValue[1]) {
    pairsFound++;

    flippedValue.length = 0;
    flippedPos.length = 0;

    // is game complete?
    if (pairsFound ===    (level/2)) {
      // showing winner popup after 1 second...
      setTimeout( function () {
        winnerMsg();
      }, 1000);
      // ...and after 8 seconds the game restart
      setTimeout( function () {
        location = location;
        }, 8000);
    }
  } else {
    // cards doesn't match, they are unflipped after 1 second
    setTimeout( function() {
      unflipCard();
      flippedValue.length = 0;
      flippedPos.length = 0;
     }, 1000);
  };
};

// function to show the final score
let winnerMsg = () => {
  const moves = flippedCards/2;
  const score = Math.round(100 * 0.8 * level / moves);
  tempHtml = `
    <p>Your score is ${score}!</p>
    <p class="text-2xl py-2">(${moves} moves)</p>
    <p>${score > 90 ? 'Great job!' : 'You can do better.'}</p>
    `;
  let winPopup = document.querySelector('.winPopup');
  winPopup.innerHTML = tempHtml;
  winPopup.classList.remove('hidden');
};

// function to hide two cards that doesn't match
let unflipCard = () => {
  // cards selector
  let card1 = board.querySelector(`[data-ord="${flippedPos[0]}"]`);
  let card2 = board.querySelector(`[data-ord="${flippedPos[1]}"]`);
  
  // hiding front face
  card1.children[1].classList.add('hidden');
  card2.children[1].classList.add('hidden');
  // showing back face
  card1.children[0].classList.remove('hidden');
  card2.children[0].classList.remove('hidden');
}

// function that renders cards content, front and back faces
let card = '';
let ord = 1;
const creaCards = (n, cardSet) => {
  card = `
    <li data-ord='${ord}' data-num='${n}' class="rounded-lg overflow-hidden">
      <div class="retro bg-green-300 p-2 h-full">
      </div>
      <div class="fronte shadow-lg bg-white p-2 h-full">
        <div style="background: url('img/${cardSet}/${n}.png')" class="h-full mx-auto bg-center bg-contain bg-no-repeat" />
      </div>
    </li>
    `;
  ord++;
}

// adding event listener
board.addEventListener('click', flipCard);

// getting value of rows, cloumns and cards set from the setup form
setupForm.addEventListener('submit', e => {
  e.preventDefault();

  let rows = setupForm.rows.value;
  let columns = setupForm.columns.value;
  let cardsSet = setupForm.cardsset.value;

  // closing popup
  setPopup.classList.add('hidden');

  level = rows * columns;

  // adding tailwind class to generate the cards grid
  board.classList.add(`grid-cols-${columns}`);
  board.classList.add(`grid-rows-${rows}`);

  // dynamically created class is not supported in PurgeCSS, so I'll add here all possible classes statically
  const forPurgeCss = `grid-cols-4 grid-cols-6 grid-cols-8 grid-rows-4 grid-rows-6`;

  // pushing necessary pairs of cards in the deck 
  let cards = [];
  for (let index = 1; index <= level/2; index++) {
    cards.push(index);
    cards.push(index);
  }

  // shuffling elements order
  let shuffled = shuffle(cards);

  // cards rendering (with delay effect)
  let index = 1;
  shuffled.forEach( el => {
    setTimeout( function () {
      creaCards(el, cardsSet)
      board.innerHTML += card;
    }, (index)*50);
    index++;
  });

  flipCard(e);
});
