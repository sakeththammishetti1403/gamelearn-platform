const BaseGame = require('./BaseGame');

class Quiz extends BaseGame {
    /**
     * Validates the quiz answers.
     * @param {Object} input - { answers: [{ questionIndex, selectedOptionIndex }] }
     * @returns {Object} - { score, isPassed, feedback }
     */
    validate(input) {
        const { answers } = input;
        const questions = this.rules.questions;
        let correctCount = 0;

        answers.forEach(answer => {
            const question = questions[answer.questionIndex];
            if (question && question.correctOptionIndex === answer.selectedOptionIndex) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / questions.length) * this.maxScore);
        const isPassed = score >= this.passingScore;

        return {
            score,
            isPassed,
            feedback: isPassed
                ? `Great job! You got ${correctCount} out of ${questions.length} correct.`
                : `You got ${correctCount} out of ${questions.length} correct. Review the content and try again!`
        };
    }
}

module.exports = Quiz;
