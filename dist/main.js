// nodo dentro cui verranno create le carte
const board = document.querySelector('.board');

// imposto il reset della partita
const restart = document.querySelector('.restart');
restart.addEventListener('click', function () {
  location = location;
})

// aggancio il popup col form
const setPopup = document.querySelector('.setPopup');
let setupForm = document.querySelector('.setupForm');

// agancio il segnapunti
let numClick = document.querySelector('.numClick');

// inizializzo le variabili
let numeroClick = 0;
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
    numeroClick++;
    numClick.innerHTML = `flips: ${numeroClick}`;

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
  if (girateNum[0] === girateNum[1]) {
    // contengono la stessa figura
    coppieTrovate++;
    // verifico se sono state trovate tutte le coppie
    if (coppieTrovate === (livello/2)) {
      // mostro il messaggio di fine partita
      setTimeout( function () {
        winnerMsg();
      }, 1000);
      // e dopo 5 secondi la pagina viene ricarticata per resettare il gioco
      setTimeout( function () {
        location = location;
        }, 5000);
    }
  } else {
    // non contengono la stessa figura, quindi
    // dopo un secondo le due carte vengono rigirate
    setTimeout( function() {
      unflipCard(); 
    }, 1000);
  };
  setTimeout( () => {
    girateNum.length = 0;
    girateOrd.length = 0;
    // console.log('azzerati i due array');
  }, 1050);  
};

// funzione che mostra il popup col punteggio a fine partita
let winnerMsg = () => {
  let punteggio = Math.round((120 + livello) * (livello ** 2 / (numeroClick * livello)));
  tempHtml = `
    <p>Hai fatto ${punteggio} punti!</p>
    <p class="text-4xl py-4">(carte girate: ${numeroClick})</p>
    <p>${numeroClick > 90 ? 'puoi fare di meglio...' : 'Ottimo risultato!'}</p>
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
