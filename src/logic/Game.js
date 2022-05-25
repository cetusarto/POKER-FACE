Deck = require('./Deck.js');


module.exports = class Game {
    constructor(players) {
        this.players = players;
        this.deck = new Deck();

        this.playerCards = [];
        this.tableCards = [];
        this.inGame = [];
        this.resetGame();
        this.turn = -1
    }

    //Turn
    nextTurn() {
        if (this.inGame.reduce((partialSum, a) => partialSum + a, 0) == 0) { this.turn = -1; return }
        if (this.turn == -1 || this.turn == this.players - 1) {
            if (!this.inGame[0]) { this.turn = 0; this.nextTurn(); return }
            this.turn = 0
        }
        else {
            if (!this.inGame[this.turn + 1]) { this.turn++; this.nextTurn(); return }
            this.turn++;
        }
    }
    //In or Out
    //Player gets in bet
    imIn(player) {
        this.inGame[player] = true;
    }
    //Player gets out of bet
    imOut(player) {
        this.inGame[player] = false;
    }

    //Deals Cards
    dealAll() {
        //Deals table cards
        for (let i = 0; i < 5; i++) {
            this.tableCards[i] = this.deck.deal();
        }
        //Deals player cards
        for (let i = 0; i < this.players; i++) {
            this.playerCards[i][0] = this.deck.deal();
        }
        for (let i = 0; i < this.players; i++) {
            this.playerCards[i][1] = this.deck.deal();
        }
    }
    //Resets arrays
    resetGame(newPlayers = this.players) {
        this.deck.restart();
        this.playerCards = [];
        this.players = newPlayers;
        this.turn = -1;

        //Resets tableCards Array
        this.tableCards = [null, null, null, null, null]

        //Resets playerCards array
        for (let i = 0; i < this.players; i++) {
            this.playerCards.push([null, null])
        }

        //Resets inGame array
        this.inGame = []
        for (let i = 0; i < this.players; i++) {
            this.inGame.push(true)
        }


    }

    //Returns the card and the id of the winner
    getWinner() {
        var Hand = require('pokersolver').Hand;
        var hands = []
        var ids = []

        for (let i = 0; i < this.inGame.length; i++) {
            if (this.inGame[i]) {
                hands.push(Hand.solve(this.playerCards[i].concat(this.tableCards)));
                ids.push(i);
            }
        }

        var winner = Hand.winners(hands)[0];

        for (let i = 0; i < ids.length; i++) {
            if (winner === hands[i]) {
                return ([ids[i], winner.descr, this.playerCards[ids[i]]])
            }

        }
    }
}

