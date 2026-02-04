import React from 'react';

const roadmapData = [
    {
        icon: '🎨',
        title: 'Enhanced UI / UX',
        description: 'Continuous refinement of the visual interface for maximum clarity and focus.'
    },
    {
        icon: '🎮',
        title: 'Multiplayer Games',
        description: 'Compete with peers in real-time coding challenges and knowledge quizzes.'
    },
    {
        icon: '🤖',
        title: 'AI Chatbot',
        description: '24/7 personalized learning assistant to answer doubts instanty.'
    },
    {
        icon: '🎯',
        title: 'Personalized Paths',
        description: 'Adaptive learning routes tailored to your specific pace and performance.'
    },
    {
        icon: '📚',
        title: 'More Subjects',
        description: 'Expanding the catalog to include AI/ML, Cloud Computing, and Cybersecurity.'
    },
    {
        icon: '🏆',
        title: 'Leaderboards',
        description: 'Global and class-wise rankings to motivate healthy academic competition.'
    },
    {
        icon: '👨‍🏫',
        title: 'Faculty Support',
        description: 'Direct connection with verified instructors for mentorship and guidance.'
    },
    {
        icon: '🚀',
        title: 'Career Tracks',
        description: 'Specialized modules preparing you for specific job roles and interviews.'
    },
    {
        icon: '📡',
        title: 'Offline Mode',
        description: 'Download content and learn without an internet connection.'
    },
    {
        icon: '📜',
        title: 'Certifications',
        description: 'Earn verified certificates upon course completion for your resume.'
    },
    {
        icon: '🛡️',
        title: 'Anti-Cheat System',
        description: 'Advanced proctoring to ensure the integrity of assessments.'
    }
];

function Roadmap() {
    return (
        <div className="container fade-in">
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px' }}>Future Roadmap</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Our vision for the next generation of this platform.</p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
            }}>
                {roadmapData.map((item, index) => (
                    <div key={index} className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{
                            fontSize: '24px',
                            minWidth: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--text-main)', // Emoji color usually stays naturally, but wrapper can control opacity
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {item.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>{item.title}</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '48px', textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px' }}>Have a suggestion?</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>We value your feedback in shaping the future of education.</p>
                <button className="btn btn-primary" onClick={() => document.querySelector('.sidebar button[class*="btn-secondary"]')?.click()}>
                    Share Feedback
                </button>
            </div>
        </div>
    );
}

export default Roadmap;
