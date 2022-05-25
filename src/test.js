const Game = require('./logic/Game');
var assert = require('assert');



game = new Game(2);

describe('Game integration with Deck', function () {
    describe('Length of deck expected after dealAll()', function () {
        it('should return 43 when 2 players are inGame', function () {
            game.resetGame(2)
            game.dealAll()
            assert.equal(game.deck.length(), 39);
        }),
            it('should return 41 when 3 players are inGame', function () {
                game.resetGame(3)
                game.dealAll()
                assert.equal(game.deck.length(), 37);
            }),
            it('should return 37 when 5 players are inGame', function () {
                game.resetGame(5)
                game.dealAll()
                assert.equal(game.deck.length(), 33);
            })
    });
});

game = new Game(2);
describe('Game integration with PokerSolver', function () {
    describe('Winner after a better hand', function () {
        it('should return player 0 when triple', function () {
            game.resetGame(2)
            game.dealAll()
            game.tableCards = ['Ac', '2c', '5h', '9s', '6d']
            game.playerCards[0] = ['Ad', 'Ah']
            game.playerCards[1] = ['2d', '4h']
            var winner = game.getWinner()
            assert.equal(winner[0], 0);
        }),
            it('should return player 1 when straigth', function () {
                game.resetGame(2)
                game.dealAll()
                game.tableCards = ['Ac', '2c', '5h', '9s', '6d']
                game.playerCards[0] = ['Ad', 'Ah']
                game.playerCards[1] = ['3d', '4s']
                var winner = game.getWinner()
                assert.equal(winner[0], 1);
            }),
            it('should return player 2 when poker', function () {
                game.resetGame(3)
                game.dealAll()
                game.tableCards = ['Ac', '2c', '5h', '9s', '9d']
                game.playerCards[0] = ['Ad', 'Ah']
                game.playerCards[1] = ['3d', '4s']
                game.playerCards[2] = ['9h', '9c']


                var winner = game.getWinner()
                assert.equal(winner[0], 2);
            }),
            it('should not return player 0 when triple and folded', function () {
                game.resetGame(2)
                game.dealAll()
                game.tableCards = ['Ac', '2c', '5h', '9s', '6d']
                game.playerCards[0] = ['Ad', 'Ah']
                game.playerCards[1] = ['2d', '4h']
                game.inGame[0] = false
                var winner = game.getWinner()
                assert.notEqual(winner[0], 0);
            }),
            it('should not return player 2 when poker and folded', function () {
                game.resetGame(3)
                game.dealAll()
                game.tableCards = ['Ac', '2c', '5h', '9s', '9d']
                game.playerCards[0] = ['Ad', 'Ah']
                game.playerCards[1] = ['3d', '4s']
                game.playerCards[2] = ['9h', '9c']
                game.inGame[2] = false

                var winner = game.getWinner()
                assert.notEqual(winner[0], 2);
            })
    })

});


