const BaseGame = require('./BaseGame');

class Hangman extends BaseGame {
    constructor(rules, maxScore, passingScore) {
        super(rules, maxScore, passingScore);
    }

    validate(input) {
        // Input expected: { word: 'TARGETWORD', guesses: ['A', 'B', 'C'] }
        // rules expected: { word: 'TARGETWORD', maxMistakes: 6 }

        // In a real scenario, the target word might be hidden or validated differently.
        // Here, we assume the client sends the state, but we verify against the rules if provided.
        // Or better, the rules contain the target word, and we check if the user found it.

        const targetWord = this.rules.word ? this.rules.word.toUpperCase() : 'UNKNOWN';
        const { guesses } = input; // Array of characters guessed

        if (!guesses || !Array.isArray(guesses)) {
            return {
                score: 0,
                isPassed: false,
                feedback: 'Invalid input: guesses must be an array.',
            };
        }

        const uniqueGuesses = new Set(guesses.map(g => g.toUpperCase()));
        let mistakes = 0;
        let correctGuesses = 0;
        const targetChars = new Set(targetWord.split(''));

        // Replay the game to count mistakes
        for (let char of uniqueGuesses) {
            if (!targetChars.has(char)) {
                mistakes++;
            }
        }

        // Check if all target characters are guessed
        let allGuessed = true;
        for (let char of targetChars) {
            if (!uniqueGuesses.has(char)) {
                allGuessed = false;
                break;
            }
        }

        const maxMistakes = this.rules.maxMistakes || 6;
        const isLost = mistakes > maxMistakes;
        const isWon = allGuessed && !isLost;

        const isPassed = isWon;
        const score = isPassed ? this.maxScore : 0;

        return {
            score,
            isPassed,
            feedback: isPassed
                ? `Congratulations! You guessed the word: ${targetWord}`
                : `Game Over. You made ${mistakes} mistakes.`,
        };
    }
}

module.exports = Hangman;
