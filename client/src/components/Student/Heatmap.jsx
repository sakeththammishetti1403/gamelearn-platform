import React from 'react';

const Heatmap = ({ data }) => {
    // Generate last 365 days
    const days = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }

    const getActivityLevel = (date) => {
        const entry = data.find(d => d._id === date);
        if (!entry) return 0;
        if (entry.count >= 5) return 4;
        if (entry.count >= 3) return 3;
        if (entry.count >= 2) return 2;
        return 1;
    };

    const colors = [
        '#ebedf0', // Level 0
        '#c6e48b', // Level 1
        '#7bc96f', // Level 2
        '#239a3b', // Level 3
        '#196127'  // Level 4
    ];

    return (
        <div style={{ marginTop: '20px' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(53, 1fr)',
                gap: '4px',
                maxWidth: '100%',
                overflowX: 'auto',
                padding: '10px'
            }}>
                {days.map(day => (
                    <div
                        key={day}
                        title={`${day}: ${data.find(d => d._id === day)?.count || 0} activities`}
                        style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: colors[getActivityLevel(day)],
                            borderRadius: '2px'
                        }}
                    />
                ))}
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px',
                fontSize: '12px',
                color: 'var(--text-secondary)'
            }}>
                <span>Less</span>
                {colors.map(c => (
                    <div key={c} style={{ width: '12px', height: '12px', backgroundColor: c, borderRadius: '2px' }} />
                ))}
                <span>More</span>
            </div>
        </div>
    );
};

export default Heatmap;
