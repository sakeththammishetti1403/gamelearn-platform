import React, { useState } from 'react';
import QuizGame from './QuizGame';
import MemoryGame from './MemoryGame';

function TicTacToeGame({ onSubmit, disabled }) {
    // ... (rest of TicTacToeGame remains the same)
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [gameOver, setGameOver] = useState(false);

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let line of lines) {
            const [a, b, c] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (index) => {
        if (board[index] || gameOver || disabled) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);

        const winner = calculateWinner(newBoard);
        if (winner) {
            setGameOver(true);
            onSubmit({ winner, moves: newBoard });
        } else if (!newBoard.includes(null)) {
            setGameOver(true);
            onSubmit({ winner: 'draw', moves: newBoard });
        } else {
            setIsXNext(!isXNext);
        }
    };

    const resetLocal = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setGameOver(false);
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <p style={{ fontSize: '16px', color: '#2E3A59', fontWeight: '500' }}>
                    Current Player: <strong style={{ color: '#4F7DF3' }}>{isXNext ? 'X (You)' : 'O'}</strong>
                </p>
                <button
                    className="btn btn-secondary"
                    onClick={resetLocal}
                    disabled={disabled}
                    style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                    Reset Board
                </button>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 100px)',
                gap: '12px',
                justifyContent: 'center',
                backgroundColor: '#F6F8FC',
                padding: '24px',
                borderRadius: '24px',
                width: 'fit-content',
                margin: '0 auto'
            }}>
                {board.map((cell, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(index)}
                        style={{
                            width: '100px',
                            height: '100px',
                            fontSize: '32px',
                            fontWeight: '700',
                            cursor: cell || gameOver || disabled ? 'default' : 'pointer',
                            backgroundColor: cell === 'X' ? '#EEF2FF' : cell === 'O' ? '#FFF1F2' : '#FFFFFF',
                            color: cell === 'X' ? '#4F7DF3' : cell === 'O' ? '#F43F5E' : '#2E3A59',
                            border: '1px solid #E5E9F2',
                            borderRadius: '16px',
                            boxShadow: cell ? 'none' : '0 2px 4px rgba(46, 58, 89, 0.04)',
                            transition: 'all 0.2s ease'
                        }}
                        disabled={cell || gameOver || disabled}
                    >
                        {cell}
                    </button>
                ))}
            </div>
        </div>
    );
}

function HangmanGame({ onSubmit, word, disabled }) {
    const [guesses, setGuesses] = useState([]);
    const [input, setInput] = useState('');

    const handleGuess = (e) => {
        e.preventDefault();
        if (input && !guesses.includes(input.toUpperCase()) && !disabled) {
            const newGuesses = [...guesses, input.toUpperCase()];
            setGuesses(newGuesses);
            setInput('');
        }
    };

    const handleSubmit = () => {
        onSubmit({ guesses });
    };

    const resetLocal = () => {
        setGuesses([]);
        setInput('');
    };

    return (
        <div className="fade-in">
            <div style={{
                fontSize: '36px',
                letterSpacing: '12px',
                marginBottom: '48px',
                textAlign: 'center',
                fontWeight: '700',
                color: '#2E3A59',
                fontFamily: 'monospace'
            }}>
                {word ? word.split('').map(c => guesses.includes(c) ? c : '_').join(' ') : '_ _ _ _ _ _'}
            </div>

            <div style={{
                backgroundColor: '#F6F8FC',
                padding: '24px',
                borderRadius: '20px',
                marginBottom: '32px',
                border: '1px solid #E5E9F2'
            }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#7A859E', marginBottom: '12px', textTransform: 'uppercase' }}>Used Letters</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {guesses.length > 0 ? guesses.map((g, i) => (
                        <span key={i} style={{
                            backgroundColor: '#FFFFFF',
                            color: '#2E3A59',
                            padding: '4px 12px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            border: '1px solid #E5E9F2'
                        }}>{g}</span>
                    )) : <span style={{ color: '#7A859E', fontStyle: 'italic' }}>No letters used yet</span>}
                </div>
            </div>

            <form onSubmit={handleGuess} style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <input
                    type="text"
                    maxLength="1"
                    value={input}
                    onChange={(e) => setInput(e.target.value.toUpperCase())}
                    placeholder="A"
                    style={{
                        width: '64px',
                        height: '56px',
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: '700',
                        borderRadius: '12px',
                        border: '2px solid #E5E9F2',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4F7DF3'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E9F2'}
                    disabled={disabled}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={disabled || !input}
                    style={{ flex: 1, height: '56px' }}
                >
                    Guess Letter
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetLocal}
                    disabled={disabled}
                    style={{ height: '56px', padding: '0 24px' }}
                >
                    Clear
                </button>
            </form>

            <button
                className="btn btn-success"
                onClick={handleSubmit}
                style={{ width: '100%', height: '56px', fontSize: '16px', fontWeight: '700' }}
                disabled={disabled || guesses.length === 0}
            >
                Submit Final Answer
            </button>
        </div>
    );
}

function GameView({ section, onSubmit }) {
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const gameType = section.gameConfig?.gameType;

    const handleGameSubmit = async (input) => {
        setSubmitting(true);
        setFeedback(null);
        try {
            await onSubmit(input);
        } catch (err) {
            setFeedback({
                type: 'error',
                message: err.message || 'Submission failed'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fade-in">
            <div style={{ borderBottom: '1px solid #E5E9F2', paddingBottom: '24px', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2E3A59', marginBottom: '12px' }}>{section.title}</h2>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#7A859E' }}>Game:</span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#2E3A59' }}>{section.gameConfig?.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#7A859E' }}>Passing Score:</span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#4CAF50' }}>{section.gameConfig?.passingScore}</span>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
                {gameType === 'tic-tac-toe' && <TicTacToeGame onSubmit={handleGameSubmit} disabled={submitting} />}
                {gameType === 'hangman' && <HangmanGame onSubmit={handleGameSubmit} word={section.gameConfig?.rules?.word} disabled={submitting} />}
                {gameType === 'quiz' && <QuizGame section={section} onSubmit={handleGameSubmit} disabled={submitting} />}
                {gameType === 'memory' && <MemoryGame section={section} onSubmit={handleGameSubmit} disabled={submitting} />}
                {!gameType && <p style={{ color: '#F43F5E', textAlign: 'center', padding: '40px' }}>Unknown game type configuration</p>}
            </div>

            {submitting && (
                <div style={{
                    textAlign: 'center',
                    color: '#4F7DF3',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginTop: '32px'
                }}>
                    <div className="loading-spinner" style={{ width: '20px', height: '20px', border: '2px solid #EEF2FF', borderTopColor: '#4F7DF3', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Validating results...
                </div>
            )}

            {feedback && (
                <div style={{
                    marginTop: '32px',
                    padding: '20px',
                    borderRadius: '16px',
                    backgroundColor: feedback.type === 'error' ? '#FFF1F2' : '#F0FDF4',
                    color: feedback.type === 'error' ? '#F43F5E' : '#166534',
                    border: `1px solid ${feedback.type === 'error' ? '#FECDD3' : '#DCFCE7'}`,
                    fontWeight: '600',
                    textAlign: 'center'
                }}>
                    {feedback.message}
                </div>
            )}
        </div>
    );
}

export default GameView;

