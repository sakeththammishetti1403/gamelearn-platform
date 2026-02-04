import React from 'react';

function StatsCards({ stats }) {
    const cardData = [
        { title: 'Modules Finished', value: stats.levelsCompleted, icon: '🏆', color: 'var(--success)', bg: 'rgba(0, 214, 143, 0.1)' },
        { title: 'Learning Streak', value: `${stats.dayStreak} Days`, icon: '🔥', color: 'var(--status-warning)', bg: 'rgba(217, 119, 6, 0.1)' },
        { title: 'Knowledge Points', value: stats.totalPoints, icon: '💎', color: 'var(--primary)', bg: 'var(--primary-light)' },
        { title: 'Study Hours', value: stats.hoursLearned, icon: '⏱️', color: 'var(--secondary)', bg: 'var(--secondary-light)' },
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
        }}>
            {cardData.map((card, index) => (
                <div key={index} className="card" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '24px'
                }}>
                    <div style={{
                        fontSize: '24px',
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: card.bg,
                        color: card.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {card.icon}
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>{card.title}</div>
                        <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-main)' }}>{card.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatsCards;

