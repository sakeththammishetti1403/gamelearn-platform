const BaseGame = require('./BaseGame');

class Memory extends BaseGame {
    /**
     * Validates the memory game pairs.
     * @param {Object} input - { pairs: [{ item1, item2 }] }
     * @returns {Object} - { score, isPassed, feedback }
     */
    validate(input) {
        const { pairs } = input;
        const correctPairs = this.rules.pairs;
        let correctCount = 0;

        pairs.forEach(pair => {
            const match = correctPairs.find(cp =>
                (cp.item1 === pair.item1 && cp.item2 === pair.item2) ||
                (cp.item1 === pair.item2 && cp.item2 === pair.item1)
            );
            if (match) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / correctPairs.length) * this.maxScore);
        const isPassed = score >= this.passingScore;

        return {
            score,
            isPassed,
            feedback: isPassed
                ? `Excellent! You matched all ${correctCount} pairs correctly.`
                : `You matched ${correctCount} out of ${correctPairs.length} pairs. Keep practicing!`
        };
    }
}

module.exports = Memory;
