class BaseGame {
    constructor(rules, maxScore, passingScore) {
        this.rules = rules;
        this.maxScore = maxScore;
        this.passingScore = passingScore;
    }

    /**
     * Validates the game move or result.
     * @param {Object} input - The user's input or game state.
     * @returns {Object} - { score, isPassed, feedback }
     */
    validate(input) {
        throw new Error('validate() must be implemented');
    }

    calculateScore(result) {
        // Default simple scoring: if passed, give max score
        return result.isPassed ? this.maxScore : 0;
    }
}

module.exports = BaseGame;
