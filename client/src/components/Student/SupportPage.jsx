import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ContactForm from '../Support/ContactForm';
import Documentation from '../Support/Documentation';
import AIChat from '../Support/AIChat';

const SupportPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [view, setView] = useState('menu'); // menu, contact, docs, chat

    // Check for pre-filled data in location state
    const { initialSubject, initialMessage } = location.state || {};

    // Auto-navigate to contact if pre-filled data exists
    React.useEffect(() => {
        if (initialSubject || initialMessage) {
            setView('contact');
        }
    }, [initialSubject, initialMessage]);

    const handleBack = () => setView('menu');

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
            <header style={{ marginBottom: '48px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>Student Support & Assistance</h1>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>How can we help you today?</p>
            </header>

            {view === 'menu' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div
                        onClick={() => setView('contact')}
                        className="card"
                        style={{ padding: '40px', textAlign: 'center', cursor: 'pointer' }}
                    >
                        <div style={{ fontSize: '48px', marginBottom: '24px' }}>📧</div>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>Email Support</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Raise a ticket and our tutors will get back to you within 24 hours.</p>
                        <button className="btn btn-primary" style={{ width: '100%' }}>Get in Touch</button>
                    </div>

                    <div
                        onClick={() => setView('docs')}
                        className="card"
                        style={{ padding: '40px', textAlign: 'center', cursor: 'pointer' }}
                    >
                        <div style={{ fontSize: '48px', marginBottom: '24px' }}>📖</div>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>Documentation</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Browse through our guides and FAQs to find answers quickly.</p>
                        <button className="btn btn-secondary" style={{ width: '100%' }}>Browse Guides</button>
                    </div>

                    <div
                        onClick={() => setView('chat')}
                        className="card"
                        style={{ padding: '40px', textAlign: 'center', cursor: 'pointer', border: '2px solid var(--primary-light)' }}
                    >
                        <div style={{ fontSize: '48px', marginBottom: '24px' }}>🤖</div>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>AI Live Tutor</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Connect with our AI tutor instantly for help with your subjects.</p>
                        <button className="btn btn-primary" style={{ width: '100%' }}>Start Chatting</button>
                    </div>
                </div>
            )}

            {view === 'contact' && (
                <div className="card" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
                    <ContactForm
                        onBack={handleBack}
                        initialSubject={initialSubject}
                        initialMessage={initialMessage}
                    />
                </div>
            )}

            {view === 'docs' && (
                <div className="card" style={{ padding: '40px' }}>
                    <button
                        onClick={handleBack}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        ← Back to Support
                    </button>
                    <Documentation />
                </div>
            )}

            {view === 'chat' && (
                <div className="card" style={{ padding: 0, overflow: 'hidden', maxWidth: '800px', margin: '0 auto' }}>
                    <AIChat onBack={handleBack} />
                </div>
            )}
        </div>
    );
};

export default SupportPage;
