// nodo dentro cui verranno create le carte
const board = document.querySelector('.board');

// imposto il restart della partita
const restart = document.querySelector('.restart');
restart.addEventListener('click', function () {
  location = location;
});

// aggangio il pulsante info e il relativo popup
const info = document.querySelector('.info');
const infoPopup = document.querySelector('.infoPopup');

// al clik su info mostro il relativo popup per 10 secondi
info.addEventListener('click', function () {
  infoPopup.classList.remove('hidden');
  setTimeout( function () {
    infoPopup.classList.add('hidden');
  }, 10000);
});

// chiudo il popup info col button OK
const okInfo = document.querySelector('.okInfo');
okInfo.addEventListener('click', function() {
  infoPopup.classList.add('hidden');
});

// aggancio il popup iniziale per la scelta del livello
const setPopup = document.querySelector('.setPopup');
let setupForm = document.querySelector('.setupForm');

// agancio il segnapunti
let scoreLabel = document.querySelector('.scoreLabel');

// inizializzo le variabili
let flippedCards = 0;
let girateNum = [];
let girateOrd = [];
let coppieTrovate = 0;
let livello;

// funzione che riordina casualmente gli elementi di un array
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

// funzione che al click scopre la carta
let flipCard = (e) => {
  // verifico che sia stato cliccato una card sul retro
  if (e.target.classList.contains('retro') && girateNum.length < 2) {

    // incremento e aggiorno il numero delle carte girate
    flippedCards++;
    scoreLabel.innerHTML = `moves: ${Math.floor(flippedCards/2)}`;

    // nascondo il retro della carta cliccata e mostro il fronte
    let retro = e.target;
    retro.classList.add('hidden');
    let fronte = retro.parentElement.children[1];
    fronte.classList.remove('hidden');

    // inserisco valore e posizione della carta nei rispettivi array
    girateNum.push(retro.parentElement.dataset.num);
    girateOrd.push(retro.parentElement.dataset.ord);

    // quando le carte scoperte sono 2 le confronto
    if (girateNum.length === 2) {
      confronta();
    }
  }
};

// funzione che confronta le due carte girate
let confronta = () => {
  // contengono la stessa figura ?
  if (girateNum[0] === girateNum[1]) {
    coppieTrovate++;
    // svuoto gli array con le ultime due carte scoperte
    girateNum.length = 0;
    girateOrd.length = 0;

    // sono state trovate tutte le coppie ?
    if (coppieTrovate === (livello/2)) {
      // mostro il messaggio di fine partita
      setTimeout( function () {
        winnerMsg();
      }, 1000);
      // e dopo 8 secondi la pagina viene ricarticata per resettare il gioco
      setTimeout( function () {
        location = location;
        }, 8000);
    }
  } else {
    // non contengono la stessa figura, dopo un secondo le due carte vengono ricoperte
    setTimeout( function() {
      unflipCard();
      girateNum.length = 0;
      girateOrd.length = 0;
     }, 1000);
  };
};

// funzione che mostra il popup col punteggio a fine partita
let winnerMsg = () => {
  const moves = flippedCards/2;
  const punteggio = Math.round(100 * 0.8 * livello / moves);
  tempHtml = `
    <p>Hai fatto ${punteggio} punti!</p>
    <p class="text-2xl py-2">(${moves} mosse)</p>
    <p>${punteggio > 90 ? 'Ottimo risultato!' : 'Puoi fare di meglio'}</p>
    `;
  let winPopup = document.querySelector('.winPopup');
  winPopup.innerHTML = tempHtml;
  winPopup.classList.remove('hidden');
};

// funzione che ricopro le due carte (poichè diverse)
let unflipCard = () => {
  // seleziono le due carte
  let carta1 = board.querySelector(`[data-ord="${girateOrd[0]}"]`);
  let carta2 = board.querySelector(`[data-ord="${girateOrd[1]}"]`);
  
  // nascondo il fronte delle due carte cliccate
  carta1.children[1].classList.add('hidden');
  carta2.children[1].classList.add('hidden');
  // e mostro il retro
  carta1.children[0].classList.remove('hidden');
  carta2.children[0].classList.remove('hidden');
}

// funzione che renderizza fronte e retro della carta
let card = '';
let ord = 1;
const creaCards = (n) => {
  card = `
    <li data-ord='${ord}' data-num='${n}' class="rounded-lg overflow-hidden">
      <div class="retro bg-green-300 p-2 h-full">
      </div>
      <div class="fronte shadow-lg bg-white p-2 h-full">
        <div style="background: url('img/fruits/${n}.png')" class="h-full mx-auto bg-center bg-contain bg-no-repeat" />
      </div>
    </li>
    `;
  ord++;
}

// aggiungo il listener alla board
board.addEventListener('click', flipCard);

// aggancio il form
setupForm.addEventListener('submit', e => {
  e.preventDefault();
  // leggo i dati dal form e imposto righe e colonne
  let righe = setupForm.righe.value;
  let colonne = setupForm.colonne.value;

  // al submit chiudo il popup
  setPopup.classList.add('hidden');

  livello = righe * colonne;

  // aggiungo la classe tailwind per incolonnare le carte (il numero di righe è fisso)
  board.classList.add(`grid-cols-${colonne}`);
  board.classList.add(`grid-rows-${righe}`);

  // dato che la creazione dinamica di classi non è supportata da purgeCSS aggiungo di seguito le eventuali classi statiche utili
  const forPurgeCss = `grid-cols-4 grid-cols-6 grid-cols-8 grid-rows-4 grid-rows-6`;

  // riempio l'array con le carte uguali a due due 
  let cards = [];
  for (let index = 1; index <= livello/2; index++) {
    cards.push(index);
    cards.push(index);
  }

  // mischio l'ordine nell'array
  let shuffled = shuffle(cards);

  // appendo le carte alla board (con effetto ritardo)
  let index = 1;
  shuffled.forEach( el => {
    setTimeout( function () {
      creaCards(el)
      board.innerHTML += card;
    }, (index)*100);
    index++;
  });

  flipCard(e);
});
