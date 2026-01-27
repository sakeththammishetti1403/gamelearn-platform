import React, { useState, useEffect } from 'react';

function MemoryGame({ section, onSubmit, disabled }) {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const pairs = section.gameConfig?.rules?.pairs || [];

    useEffect(() => {
        // Initialize and shuffle cards
        const allItems = pairs.flatMap(p => [p.item1, p.item2]);
        const shuffled = allItems
            .map(value => ({ value, id: Math.random() }))
            .sort(() => Math.random() - 0.5);
        setCards(shuffled);
    }, [section]);

    const handleCardClick = (index) => {
        if (disabled || submitted || flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].value)) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const [firstIdx, secondIdx] = newFlipped;
            const firstCard = cards[firstIdx].value;
            const secondCard = cards[secondIdx].value;

            // Check if they are a pair in the rules
            const isMatch = pairs.some(p =>
                (p.item1 === firstCard && p.item2 === secondCard) ||
                (p.item1 === secondCard && p.item2 === firstCard)
            );

            if (isMatch) {
                setMatched([...matched, firstCard, secondCard]);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    useEffect(() => {
        if (matched.length === cards.length && cards.length > 0 && !submitted) {
            // All matched!
            setSubmitted(true);
            const formattedPairs = pairs.map(p => ({ item1: p.item1, item2: p.item2 }));
            onSubmit({ pairs: formattedPairs });
        }
    }, [matched, cards, submitted]);

    return (
        <div className="fade-in">
            <p style={{ textAlign: 'center', color: '#7A859E', marginBottom: '32px', fontSize: '15px' }}>
                Match the related terms by clicking on the cards.
            </p>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '16px',
                justifyContent: 'center'
            }}>
                {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index);
                    const isMatched = matched.includes(card.value);

                    return (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(index)}
                            style={{
                                height: '100px',
                                backgroundColor: isMatched ? '#F0FDF4' : isFlipped ? '#EEF2FF' : '#FFFFFF',
                                border: `2px solid ${isMatched ? '#4CAF50' : isFlipped ? '#4F7DF3' : '#E5E9F2'}`,
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '12px',
                                textAlign: 'center',
                                cursor: isMatched || isFlipped || disabled || submitted ? 'default' : 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: isFlipped || isMatched ? 'rotateY(0deg)' : 'rotateY(0deg)', // Simplified for now
                                boxShadow: isFlipped || isMatched ? 'none' : '0 4px 12px rgba(46, 58, 89, 0.04)'
                            }}
                        >
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '700',
                                color: isMatched ? '#166534' : isFlipped ? '#4F7DF3' : 'transparent',
                                visibility: isFlipped || isMatched ? 'visible' : 'hidden'
                            }}>
                                {card.value}
                            </span>
                            {!(isFlipped || isMatched) && (
                                <div style={{ fontSize: '24px', color: '#D1DBFF' }}>?</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {matched.length === cards.length && cards.length > 0 && (
                <div style={{
                    marginTop: '40px',
                    textAlign: 'center',
                    color: '#4CAF50',
                    fontWeight: '700',
                    fontSize: '18px',
                    backgroundColor: '#F0FDF4',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #DCFCE7'
                }}>
                    ✓ All pairs matched! Submitting...
                </div>
            )}
        </div>
    );
}

export default MemoryGame;
