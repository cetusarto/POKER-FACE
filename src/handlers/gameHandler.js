const Game = require("../logic/Game");

module.exports = (io, socket, table, game) => {

    const playerReady = () => {
        table.players[socket.id] = Object.keys(table.players).length;
        socket.join("readyPlayers");
        table.money[table.players[socket.id]] = 1000;
        table.checked[table.players[socket.id]] = false;


        if (Object.keys(table.players).length >= 2 && !table.onGame) {
            startGame()
        }
    }

    const startGame = () => {
        game.resetGame(Object.keys(table.players).length);
        game.dealAll();
        table.onGame = true;
        table.pot = 0;
        table.bet = 5;
        io.to("readyPlayers").emit("game::starting")
        setTimeout(requestMove, 3000);
    }

    const restartGame = () => {
        game.resetGame(Object.keys(table.players).length);
        game.dealAll();
        table.onGame = false;
        io.to("readyPlayers").emit("game::restart")
    }


    const getCards = () => {
        io.to(socket.id).emit("game::gettingCards",
            {
                tableCards: game.tableCards,
                playerCards: game.playerCards[table.players[socket.id]]
            },
            table.money,
            table.players[socket.id],
            table.pot,
            table.bet
        );
    }


    const checkWWin = () => {
        var sum = game.inGame.reduce((partialSum, a) => partialSum + a, 0);
        if (sum == 1) {
            var person = game.inGame.indexOf(true);
            sendWin(person, 'Ganaste por W', 'Gano por W el jugador');
            return true;
        }
        return false;
    }

    const getWinner = () => {
        const sum = obj => Object.values(table.checked).reduce((a, b) => a + b);
        if (sum == Object.keys(table.checked).length) {
            console.log('hey')
            var winners = game.getWinner();
            var id = winners[0]
            var desc = winners[1]
            var cards = winners[2]
            sendWin(id, "You won with " + desc, "Player 1 won with " + desc)
            return true
        }
        return false

    }
    const sendWin = (winnerID, messageWinner, messageLoser) => {
        var socketIds = Object.keys(table.players)
        table.money[winnerID] = table.pot;
        var winnerCards = game.playerCards[winnerID];
        io.to(socketIds[winnerID]).emit("game::win", messageWinner, winnerCards)
        io.except(socketIds[winnerID]).emit("game::lose", messageLoser, winnerCards)
        restartGame();
    }

    const requestMove = () => {
        game.nextTurn();
        const turn = game.turn;
        if (turn == -1) { return }
        if (checkWWin()) { return };
        if (getWinner()) { return }
        var socketIds = Object.keys(table.players)
        io.to(socketIds[turn]).emit("game::getMove")
        io.to('readyPlayers').except(socketIds[turn]).emit("game::playerState", turn, 'playing')
    }

    // Moves
    const playerFolds = (id) => {
        game.imOut(id)
        table.checked[id] = true;
        var socketIds = Object.keys(table.players)
        io.to('readyPlayers').except(socketIds[id]).emit("game::playerState", id, 'fold')
        requestMove();
    }

    const playerChecks = (id) => {
        game.imIn(id);
        table.checked[id] = true;
        var socketIds = Object.keys(table.players)
        io.to('readyPlayers').except(socketIds[id]).emit("game::playerState", id, 'check')
        requestMove();
    }

    const playerCalls = (id, callMoney, allIn) => {
        game.imIn(id);
        var socketIds = Object.keys(table.players)
        var reason = "call"
        if (allIn) { table.allIn[id] = true; reason = 'allin' }
        table.money[id] -= callMoney;
        table.pot += callMoney;
        io.to('readyPlayers').except(socketIds[id]).emit("game::playerState", id, reason, table.money[id], table.pot)
        requestMove();
    }

    socket.on("game::playerReady", playerReady);
    socket.on("game::getCards", getCards)
    socket.on("game::playerFolds", playerFolds)
    socket.on("game::playerChecks", playerChecks)
    socket.on("game::playerCalls", playerCalls)
}