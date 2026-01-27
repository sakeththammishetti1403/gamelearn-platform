import React from 'react';

function StatsCards({ stats }) {
    const cardData = [
        { title: 'Levels Completed', value: stats.levelsCompleted, icon: '🏆', color: '#4CAF50' },
        { title: 'Day Streak', value: stats.dayStreak, icon: '🔥', color: '#FF9800' },
        { title: 'Total Points', value: stats.totalPoints, icon: '💎', color: '#4F7DF3' },
        { title: 'Hours Learned', value: stats.hoursLearned, icon: '⏱️', color: '#9C27B0' },
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
        }}>
            {cardData.map((card, index) => (
                <div key={index} className="card" style={{
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E9F2',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(46, 58, 89, 0.04)',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{
                        fontSize: '24px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        backgroundColor: `${card.color}10`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {card.icon}
                    </div>
                    <div>
                        <div style={{ color: '#7A859E', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{card.title}</div>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#2E3A59' }}>{card.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatsCards;

