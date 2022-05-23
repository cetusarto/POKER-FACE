module.exports = (io, socket, table, game) => {

    const disconnect = () => {
        delete table.players[socket.id];
        socket.leave("readyPlayers");
        if (io.engine.clientsCount < 2) {
            table.onGame = false;
        }

    }



    socket.on("disconnect", disconnect);
}