const TicTacToe = require('./games/TicTacToe');
const Hangman = require('./games/Hangman');
const Quiz = require('./games/Quiz');
const Memory = require('./games/Memory');

class GameFactory {
    static createGame(gameType, rules, maxScore, passingScore) {
        switch (gameType) {
            case 'tic-tac-toe':
                return new TicTacToe(rules, maxScore, passingScore);
            case 'hangman':
                return new Hangman(rules, maxScore, passingScore);
            case 'quiz':
                return new Quiz(rules, maxScore, passingScore);
            case 'memory':
                return new Memory(rules, maxScore, passingScore);
            default:
                throw new Error(`Game type ${gameType} not supported`);
        }
    }
}

module.exports = GameFactory;
