Game = require('./Game.js');

class Table {
    constructor() {
        this.players = 0;
        this.onlinePlayers = 0;
        this.game = new Game();
        this.turn = -1;
    }


    //Game Logic
    start(players) {
        this.players = players;
        this.onlinePlayers = players;
        this.nextMove("First");
    }
    restart() {
        //TODO
    }

    //DEALING
    dealPlayer(player){

    }


    //MOVES
    //Make move from player p (Call,Check,Fold,FirstRaise,Raise)
    playerMove(player, move, raise = 0) {
        if (move === "Call") {
            if (!this.game.checkCall()) { return false }
            this.game.imIn(player);
            this.game.payUp(player);
            return true;
        }
        if (move === "Check") {
            this.game.imIn(player);
            return true;
        }
        if (move === "Fold") {
            this.game.imOut(player);
            return true;
        }
        if (move === "FirstRaise") {
            var bet = this.game.bet;
            if (!this.game.checkRaise(player, bet + raise)) { return false }
            this.game.imIn(player);
            this.game.raiseBet(raise)
            this.game.payUp(player)
            return true;
        }
        if (move === "Raise") {
            if (!this.game.checkRaise(player, raise)) { return false }
            this.game.imIn(player);
            this.game.raiseBet(raise);
            this.game.payRaise(player, raise);
            return true;
        }
    }
    getMove(player){
        //TODO
    }

    nextMove(type) {
        if (type === "First") {
            this.game.dealAll();
            this.turn = 0;
            this.getMove(this.turn);
        }
        else { }

    }





}