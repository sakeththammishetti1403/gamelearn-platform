import React, { useState } from 'react';

function QuizGame({ section, onSubmit, disabled }) {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const questions = section.gameConfig?.rules?.questions || [];

    const handleOptionSelect = (questionIndex, optionIndex) => {
        if (disabled || submitted) return;
        setAnswers({
            ...answers,
            [questionIndex]: optionIndex
        });
    };

    const handleSubmit = () => {
        const formattedAnswers = Object.entries(answers).map(([qIdx, oIdx]) => ({
            questionIndex: parseInt(qIdx),
            selectedOptionIndex: oIdx
        }));

        if (formattedAnswers.length < questions.length) {
            alert('Please answer all questions before submitting.');
            return;
        }

        setSubmitted(true);
        onSubmit({ answers: formattedAnswers });
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'grid', gap: '32px' }}>
                {questions.map((q, qIdx) => (
                    <div key={qIdx} style={{
                        backgroundColor: '#F6F8FC',
                        padding: '24px',
                        borderRadius: '20px',
                        border: '1px solid #E5E9F2'
                    }}>
                        <p style={{ fontSize: '17px', fontWeight: '700', color: '#2E3A59', marginBottom: '20px' }}>
                            {qIdx + 1}. {q.question}
                        </p>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {q.options.map((option, oIdx) => {
                                const isSelected = answers[qIdx] === oIdx;
                                return (
                                    <button
                                        key={oIdx}
                                        onClick={() => handleOptionSelect(qIdx, oIdx)}
                                        disabled={disabled || submitted}
                                        style={{
                                            padding: '14px 20px',
                                            borderRadius: '12px',
                                            border: `2px solid ${isSelected ? '#4F7DF3' : '#E5E9F2'}`,
                                            backgroundColor: isSelected ? '#EEF2FF' : '#FFFFFF',
                                            color: isSelected ? '#4F7DF3' : '#2E3A59',
                                            textAlign: 'left',
                                            fontSize: '15px',
                                            fontWeight: isSelected ? '700' : '500',
                                            cursor: disabled || submitted ? 'default' : 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                border: `2px solid ${isSelected ? '#4F7DF3' : '#7A859E'}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4F7DF3' }} />}
                                            </div>
                                            {option}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={disabled || submitted || Object.keys(answers).length < questions.length}
                style={{ width: '100%', marginTop: '40px', height: '56px', fontSize: '16px', fontWeight: '700' }}
            >
                Submit Quiz
            </button>
        </div>
    );
}

export default QuizGame;
