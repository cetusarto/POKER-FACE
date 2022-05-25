var socket = io()

var ready = false;
var enough = false;

//game logic
var cards;
var onGamePlayers;

//Elements
var readyButton;
var players = [];
var tableCards = [];
var ownCards = [];
var winnerCards = [];
var pot;
var token;
var raise;
var fold;
var meet;
var call;
var check;

//EventListener
window.addEventListener('load', function () {
    readyButton = document.getElementById("ready");
    pot = document.getElementById("pot");
    token = document.getElementById("token");
    raise = document.getElementById("raise");
    fold = document.getElementById("fold");
    meet = document.getElementById("meet");
    call = document.getElementById("call");
    check = document.getElementById("check");

    //Player cards
    ownCards.push({
        number: document.getElementById("numberCard1"),
        suit: document.getElementById("suitCard1")
    })
    ownCards.push({
        number: document.getElementById("numberCard2"),
        suit: document.getElementById("suitCard2")
    })

    //winner cards
    winnerCards.push({
        number: document.getElementById("numberCardGanador1"),
        suit: document.getElementById("suitCardGanador1")
    })
    winnerCards.push({
        number: document.getElementById("numberCardGanador2"),
        suit: document.getElementById("suitCardGanador2")
    })

    //Table Cards
    for (let i = 1; i < 6; i++) {
        tableCards.push({
            number: document.getElementById("numberTableCard1" + i),
            suit: document.getElementById("suitTableCard1")
        })
    }

    //Players
    for (let i = 1; i < 6; i++) {
        ownCards.push({
            img: document.getElementById("img" + i),
            suit: document.getElementById("txt4" + i)
        })
    }

})


//Functions
//Aux Functions
function dissapear(element) {
    element.style.display = "none"
}
function show(element) {
    element.style.display = "block"
}

//OnClick
function readyToPlay() {
    readyButton.style.display = "none";
    if (!ready) {
        socket.emit("game::playerReady")
        ready = true;
    }
}

function startGame() {
    
}


//Socket
socket.on("connect", () => { })
socket.on("game::starting", () => {
    socket.emit("game::getFirstCards")
})
socket.on("game::gettingFirstCards", (cards, players) => {
    this.cards = cards;
    this.onGamePlayers = players;
    startGame();
})


