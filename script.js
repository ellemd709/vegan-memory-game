const card_fronts = {
    "card 1": "./images/avocado.jpg",
    "card 2": "./images/banana.jpg",
    "card 3": "./images/broccoli.jpg",
    "card 4": "./images/carrot.jpg",
    "card 5": "./images/cherry.jpg",
    "card 6": "./images/eggplant.jpg",
    "card 7": "./images/grapes.jpg",
    "card 8": "./images/pear.jpg",
    "card 9": "./images/peas.jpg",
    "card 10": "./images/pumpkin.jpg",
    "card 11": "./images/avocado.jpg",
    "card 12": "./images/banana.jpg",
    "card 13": "./images/broccoli.jpg",
    "card 14": "./images/carrot.jpg",
    "card 15": "./images/cherry.jpg",
    "card 16": "./images/eggplant.jpg",
    "card 17": "./images/grapes.jpg",
    "card 18": "./images/pear.jpg",
    "card 19": "./images/peas.jpg",
    "card 20": "./images/pumpkin.jpg",
    
  };

const selectors = {
    boardContainer: document.querySelector(".board-container"),
    board: document.querySelector(".board"),
    moves: document.querySelector(".moves"),
    timer: document.querySelector(".timer"),
    start: document.querySelector("button"),
    win: document.querySelector(".win"),
    cards: document.querySelectorAll(".card-back"),
  };
  
  const state = {
    gameStarted: false,
    flippedCards: 0,
    picks: null,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
  };
  
  // fisher-yates shuffle
  
  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  
  // starts game and keeps stats
  const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add("disabled");
  
    state.loop = setInterval(() => {
      state.totalTime++;
  
      selectors.moves.innerText = `${state.totalFlips} moves`;
      selectors.timer.innerText = `time: ${state.totalTime} sec`;
    }, 1000);
  };
  
  // onclick event for button to start game
  selectors.start.onclick = startGame;
  
  // resets cards if a pair doesn't match
  const flipBackCards = () => {
    document.querySelectorAll(".card:not(.matched)").forEach((card) => {
      card.classList.remove("flipped");
    });
  
    state.flippedCards = 0;
  };
  
  // generate board
  function generateGame() {
    state.picks = ["card 1", "card 2", "card 3", "card 4", "card 5", "card 6", "card 7", "card 8", "card 9", "card 10", "card 11", "card 12"];
    const items = shuffle([...state.picks]);
    
    // loop through the cards and add an inline image for the card-back
    for (var i = 0; i < items.length; i++) {
      selectors.cards[i].setAttribute("style", "background-image: url("+`${card_fronts[items[i]]}`+"");
    }
  }
  
  function flipCard(card) {
    state.flippedCards++;
    state.totalFlips++;
  
    if (!state.gameStarted) {
      startGame();
    }
  
    if (state.flippedCards <= 2) {
      card.classList.add("flipped");
    }
  
    if (state.flippedCards === 2) {
      const flippedCards = document.querySelectorAll(".flipped:not(.matched)");
  
      // if the card-back background-images are the same on flipped cards, we add a class matched
      if (flippedCards[0].innerHTML === flippedCards[1].innerHTML) {
        flippedCards[0].classList.add("matched");
        flippedCards[1].classList.add("matched");
      }
  
      // if they aren't, flip back cards
      setTimeout(() => {
        flipBackCards();
      }, 1000);
    }
  
    if (!document.querySelectorAll(".card:not(.flipped)").length) {
      setTimeout(() => {
        selectors.boardContainer.classList.add("flipped");
        selectors.win.innerHTML = `
                  <span class="win-text">
                      You won!<br />
                      with <span class="highlight">${state.totalFlips}</span> moves<br />
                      under <span class="highlight">${state.totalTime}</span> seconds
                      <button class="replay">Play again</button>
                  </span>
              `;
        clearInterval(state.loop);
      }, 1000);
    }
  }
  
  const attachEventListeners = () => {
    document.addEventListener("click", (event) => {
      const eventTarget = event.target;
      const eventParent = eventTarget.parentElement;
  
      if (
        eventTarget.className.includes("card") &&
        !eventParent.className.includes("flipped")
      ) {
        flipCard(eventParent);
      } else if (
        eventTarget.nodeName === "BUTTON" &&
        !eventTarget.className.includes("disabled")
      ) {
        startGame();
      }
      // if replay button is clickd, rebuild the game
      if (eventTarget.className.includes("replay")) {
        selectors.boardContainer.classList.remove("flipped");
        document.querySelectorAll(".card").forEach((card) => {
          card.classList.remove("flipped", "matched");
        });
        replayGame();
      }
    });
  };
  
  // reset states and generate a new game
  const replayGame = () => {
    state.gameStarted = false;
    state.flippedCards = 0;
    state.totalFlips = 0;
    state.totalTime = 0;
    clearInterval(state.loop);
    state.loop = null;
    state.picks = null;
    generateGame();
    selectors.moves.innerText = `${state.totalFlips} moves`;
    selectors.timer.innerText = `time: ${state.totalTime} sec`;
    selectors.start.classList.remove("disabled");
  };
  
  generateGame();
  attachEventListeners();