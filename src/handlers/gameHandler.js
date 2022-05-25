const Game = require("../logic/Game");

module.exports = (io, socket, table, game) => {

    const playerReady = () => {

        table.players[socket.id] = Object.keys(table.players).length;
        socket.join("readyPlayers");
        table.money[table.players[socket.id]] = 1000;
        if (Object.keys(table.players).length >= 2 && !table.onGame) {
            startGame()
        }
    }

    const startGame = () => {
        game.resetGame(Object.keys(table.players).length);
        game.dealAll();
        table.onGame = true;
        io.to("readyPlayers").emit("game::starting")
        setTimeout(requestMove, 2000);
    }


    const getFirstCards = () => {
        io.to(socket.id).emit("game::gettingFirstCards",
            {
                tableCards: [game.tableCards[0], game.tableCards[1], game.tableCards[2], null, null],
                playerCards: game.playerCards[table.players[socket.id]]
            },
            table.money,
            table.players[socket.id]
        );
    }

    const requestMove = () => {
        game.nextTurn();
        const turn = game.turn;
        var socketIds = Object.keys(table.players)
        io.to(socketIds[turn]).emit("game::getMove")
        io.to('readyPlayers').except(socketIds[turn]).emit("game::playerState", turn,'playing')
    }

    // Moves
    const playerFolds = (id) => { 
        game.imOut(id);
        var socketIds = Object.keys(table.players)
        io.to('readyPlayers').except(socketIds[id]).emit("game::playerState", id,'fold')
        requestMove();
    }

    socket.on("game::playerReady", playerReady);
    socket.on("game::getFirstCards", getFirstCards)
    socket.on("game::playerFolds", playerFolds)
}