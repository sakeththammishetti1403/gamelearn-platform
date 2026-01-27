const BaseGame = require('./BaseGame');

class TicTacToe extends BaseGame {
    constructor(rules, maxScore, passingScore) {
        super(rules, maxScore, passingScore);
    }

    validate(input) {
        // Input expected: { winner: 'X' | 'O' | 'draw', moves: [...] }
        // In a real backend validation, we would replay the moves to verify the winner.
        // For this MVP, we will trust the client's result but check basic validity.

        const { winner, moves } = input;

        if (!winner) {
            return {
                score: 0,
                isPassed: false,
                feedback: 'Game not completed.',
            };
        }

        // Simple check: User (usually 'X') must win to pass
        const isPassed = winner === 'X';
        const score = isPassed ? this.maxScore : 0;

        return {
            score,
            isPassed,
            feedback: isPassed ? 'Congratulations! You won!' : 'Try again. You need to win to proceed.',
        };
    }
}

module.exports = TicTacToe;
