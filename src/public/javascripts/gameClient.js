var socket = io()

var ready = false;
var enough = false;

//game logic
var cards;
var onGamePlayers;
var playerPos;
var playerMoney;
var competitors = {};

//Elements
var readyButton;
var players = [];
var tableCards = [];
var ownCards = [];
var winnerCards = [];
var pot;
var token;
var raiseE;
var foldE;
var allinE;
var callE;
var checkE;
var raiseB;

//EventListener
window.addEventListener('load', function () {
    readyButton = document.getElementById("ready");
    pot = document.getElementById("pot");
    token = document.getElementById("token");
    raiseE = document.getElementById("raise");
    raiseB = document.getElementById("raiseB");
    foldE = document.getElementById("fold");
    allinE = document.getElementById("allin");
    callE = document.getElementById("call");
    checkE = document.getElementById("check");

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
            number: document.getElementById("numberTableCard" + i),
            suit: document.getElementById("suitTableCard" + i)
        })
    }

    //Players
    for (let i = 1; i < 5; i++) {
        players.push({
            img: document.getElementById("img" + i),
            text: document.getElementById("txt" + i)
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
function getSuitRoute(letter) {
    if (letter === 'c') { return "/public/images/clover.png" }
    if (letter === 'd') { return "/public/images/diamond.png" }
    if (letter === 'h') { return "/public/images/heart.png" }
    if (letter === 's') { return "/public/images/spade.png" }
}
function disableMoves() {
    foldE.disabled = true;
    allinE.disabled = true;
    callE.disabled = true;
    checkE.disabled = true;
    raiseB.disabled = true;
};
function enableMoves() {
    foldE.disabled = false;
    allinE.disabled = false;
    callE.disabled = false;
    checkE.disabled = false;
    raiseB.disabled = false;
};



//GAME LOGIC
//Sets a number for each competitor
function assignCompetitorNumber() {
    var keys = Object.keys(money);
    var id = 0;
    for (let i of keys) {
        if (i == this.pos) { continue; }
        competitors[i] = id;
        id++;
    }
}


// DOCUMENT SETTING
//Sets Personal Money
function setPersonalMoney() {
    token.value = this.money[this.pos]
}
// Sets competitors elements
function setCompetitorElements() {
    for (let comp of Object.keys(competitors)) {
        const number = this.competitors[comp];
        const money = this.money[comp];
        var text = "Jugador " + (number + 1) + "\n" + "Dinero $" + money;
        show(players[number].img)
        this.players[number].text.innerText = text;
    }

}
//Sets cards for first time
function setCardsFirstTime() {
    let tableCards = this.cards.tableCards;
    let playerCards = this.cards.playerCards;

    for (let i = 0; i < 2; i++) {
        this.ownCards[i].number.innerText = playerCards[i].charAt(0);
        this.ownCards[i].suit.src = getSuitRoute(playerCards[i].charAt(1))
    }

    for (let i = 0; i < 3; i++) {
        this.tableCards[i].number.innerText = tableCards[i].charAt(0);
        this.tableCards[i].suit.src = getSuitRoute(tableCards[i].charAt(1))
    }

}
//Shows players when the other is moving
function playerMoving(turn, reason) {
    const number = this.competitors[turn];
    var lines = this.players[number].text.innerText.split("\n");
    var state = "";
    if (reason === 'playing') { state = "\n Turno del jugador" }
    if (reason === 'fold') { state = "\n Jugador se rindió" }

    if (lines.length == 2) {
        this.players[number].text.innerText += state;
    } else if (lines.length == 3) {
        this.players[number].text.innerText = lines[0] + "\n" + lines[1] + state;
    }
}

//ON CLICK
function readyToPlay() {
    readyButton.style.display = "none";
    if (!ready) {
        socket.emit("game::playerReady")
        ready = true;
    }
}
function folding() {
    this.socket.emit("game::playerFolds", this.pos);
    disableMoves();
}
function check() {
    //TODO
}
function call() { }
function raise() { }



//Game functions
function startGame() {
    setPersonalMoney();
    setCardsFirstTime();
    assignCompetitorNumber();
    setCompetitorElements();
}


//Socket
socket.on("connect", () => { })
socket.on("game::starting", () => {
    socket.emit("game::getFirstCards")
})

socket.on("game::gettingFirstCards", (cards, money, pos) => {
    this.cards = cards;
    this.money = money;
    this.pos = pos;

    startGame();
})


socket.on("game::getMove", () => {
    alert("Es su turno, tiene 30 segundos para jugar");
    setTimeout(folding, 2000);
})

socket.on("game::playerState", (turn, reason) => {
    playerMoving(turn, reason)
})



