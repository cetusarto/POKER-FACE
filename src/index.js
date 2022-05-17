const Game = require('./Game.js');
const game = new Game(6)
game.dealPlayerCards()
game.dealTableCards()

console.log(game.playerCards)
console.log(game.tableCards)
game.imIn(0)
game.imIn(1)
game.imIn(5)
game.imIn(4)
game.imIn(3)
game.imIn(2)
console.log(game.getWinner())
