const Game = require("../logic/Game");

module.exports = (io, socket, table, game) => {

    const playerReady = () => {

        table.players[socket.id] = Object.keys(table.players).length + 1;
        socket.join("readyPlayers");
        if (Object.keys(table.players).length >= 2 && !table.onGame) {
            startGame()
        }
    }

    const startGame = () => {
        game.resetGame(Object.keys(table.players).length);
        game.dealAll();
        table.onGame = true;
        io.to("readyPlayers").emit("game::starting")
    }

    const getFirstCards = () => {
        io.to(socket.id).emit("game::gettingFirstCards",
            {
                tableCards: [game.tableCards[0], game.tableCards[1], game.tableCards[2], null, null],
                playerCards: game.playerCards[table.players[socket.id] - 1]
            }
        )
    }

    const test = () => {

        console.log(game)
    }

    socket.on("game::playerReady", playerReady);
    socket.on("test", test);
    socket.on("game::getFirstCards", getFirstCards)
}