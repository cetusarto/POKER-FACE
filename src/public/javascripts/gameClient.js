var socket = io()

var ready = false;
var enough = false;

//game logic
var cards;
var onGamePlayers;
var playerPos;
var playerMoney;
var money;
var tablePot;
var competitors = {};
var bet;

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
    console.log(money)
    for (let i of keys) {
        if (i == this.pos) { continue; }
        competitors[i] = id;
        id++;
    }
}


// DOCUMENT SETTING
//Sets Personal Money
function setPersonalMoney() {
    token.value = this.playerMoney
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

    for (let i = 0; i < 5; i++) {
        this.tableCards[i].number.innerText = tableCards[i].charAt(0);
        this.tableCards[i].suit.src = getSuitRoute(tableCards[i].charAt(1))
    }

}


//Shows players when the other is moving
function playerMoving(turn, reason, pMoney) {

    const number = this.competitors[turn];
    var lines = this.players[number].text.innerText.split("\n");
    var state = "";
    if (reason === 'playing') { state = "\n Turno del jugador" }
    if (reason === 'fold') { state = "\n Jugador se rindió" }
    if (reason === 'check') { state = "\n Jugador checkeó" }
    if (reason === 'allin') { state = "\n Jugador fue All IN" }


    if (lines.length == 2) {
        this.players[number].text.innerText += state;
    } else if (lines.length == 3) {
        var secondLine = lines[1]
        if (pMoney != 0) { secondLine = "Dinero $" + pMoney }
        this.players[number].text.innerText = lines[0] + "\n" + secondLine + state;
    }
}
function setPot() {
    this.pot.innerHTML = this.tablePot;
}

//ON CLICK
function readyToPlay() {
    dissapear(readyButton)
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
    this.socket.emit("game::playerChecks", this.pos);
}
function call(type) {
    if (type === 1) {
        if (this.bet >= this.playerMoney) { return call(2) }
        this.playerMoney -= this.bet;
        this.tablePot += this.bet;

        this.socket.emit("game::playerCalls", this.pos, this.bet, false);
        setPersonalMoney()
        setPot()
    }
    if (type === 2) {
        this.tablePot = this.playerMoney;

        this.playerMoney = 0;
        alert('All In!!')
        this.socket.emit("game::playerCalls", this.pos, this.playerMoney, true);
        setPersonalMoney()
        setPot()
    }
}
function raise() {
    var moneyRaise = parseInt(this.raiseE.value);
    console.log(moneyRaise)
    if (this.bet + moneyRaise >= this.playerMoney) {
        this.bet = this.bet + this.playerMoney;
        return call(2)
    }
    else {
        this.bet += moneyRaise;
        return call(1)
    }
}



//Game functions
function startGame() {
    setPersonalMoney();
    setPot();
    setCardsFirstTime();
    assignCompetitorNumber();
    disableMoves()
    setCompetitorElements();
}


//Socket
socket.on("connect", () => { })
socket.on("game::starting", () => {
    socket.emit("game::getCards")
})


socket.on("game::gettingCards", (cards, money, pos, pot, bet) => {
    this.cards = cards;
    this.money = money;
    this.pos = pos;
    this.playerMoney = money[pos]
    this.tablePot = pot;
    this.bet = bet;
    startGame();
})


socket.on("game::getMove", () => {
    enableMoves()
    alert("Es su turno, tiene 30 segundos para jugar, la apuesta está en " + this.bet);
    setTimeout(() => {
        folding();
        disableMoves()
    }, 10000);

})

socket.on("game::playerState", (turn, reason, pMoney = this.money[turn], pot = this.tablePot) => {
    this.tablePot = pot;
    this.pot.innerHTML = pot;
    this.money[turn] = pMoney;
    setPot()
    playerMoving(turn, reason, pMoney)
})

socket.on("game::restart", () => {
    show(readyButton);
    ready = false;
})

socket.on("game::win", (message, winnerCards) => {
    for (let i = 0; i < 2; i++) {
        this.winnerCards[i].number.innerText = winnerCards[i].charAt(0);
        this.winnerCards[i].suit.src = getSuitRoute(winnerCards[i].charAt(1))
    }
    alert(message);
})
socket.on("game::lose", (message,winnerCards) => {
    for (let i = 0; i < 2; i++) {
        this.winnerCards[i].number.innerText = winnerCards[i].charAt(0);
        this.winnerCards[i].suit.src = getSuitRoute(winnerCards[i].charAt(1))
    }
    alert(message);
})



