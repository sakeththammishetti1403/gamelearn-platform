import React, { useState } from 'react';
import Documentation from '../Support/Documentation';
import ContactForm from '../Support/ContactForm';
import LiveChat from '../Support/LiveChat';

function SupportModal({ isOpen, onClose }) {
    const [view, setView] = useState('menu'); // menu, docs, email, chat

    if (!isOpen) return null;

    const handleBack = () => setView('menu');

    const renderContent = () => {
        switch (view) {
            case 'docs':
                return <Documentation onBack={handleBack} />;
            case 'email':
                return <ContactForm onBack={handleBack} />;
            case 'chat':
                return <LiveChat onBack={handleBack} />;
            default:
                return (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#EEF2FF',
                                borderRadius: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '40px',
                                margin: '0 auto 24px'
                            }}>👋</div>
                            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#2E3A59', marginBottom: '12px' }}>How can we help?</h2>
                            <p style={{ color: '#7A859E', fontSize: '16px' }}>Our support team is here to ensure you have the best learning experience.</p>
                        </div>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div
                                onClick={() => setView('docs')}
                                style={{
                                    padding: '24px',
                                    borderRadius: '20px',
                                    border: '1px solid #E5E9F2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={e => e.currentTarget.style.borderColor = '#4F7DF3'}
                                onMouseOut={e => e.currentTarget.style.borderColor = '#E5E9F2'}
                            >
                                <div style={{ fontSize: '24px' }}>📖</div>
                                <div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#2E3A59', marginBottom: '4px' }}>Documentation</h4>
                                    <p style={{ fontSize: '14px', color: '#7A859E' }}>Browse guides and tutorials</p>
                                </div>
                            </div>

                            <div
                                onClick={() => setView('email')}
                                style={{
                                    padding: '24px',
                                    borderRadius: '20px',
                                    border: '1px solid #E5E9F2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={e => e.currentTarget.style.borderColor = '#4F7DF3'}
                                onMouseOut={e => e.currentTarget.style.borderColor = '#E5E9F2'}
                            >
                                <div style={{ fontSize: '24px' }}>📧</div>
                                <div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#2E3A59', marginBottom: '4px' }}>Email Support</h4>
                                    <p style={{ fontSize: '14px', color: '#7A859E' }}>Get a response within 24 hours</p>
                                </div>
                            </div>

                            <div
                                onClick={() => setView('chat')}
                                style={{
                                    padding: '24px',
                                    borderRadius: '20px',
                                    border: '1px solid #E5E9F2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={e => e.currentTarget.style.borderColor = '#4F7DF3'}
                                onMouseOut={e => e.currentTarget.style.borderColor = '#E5E9F2'}
                            >
                                <div style={{ fontSize: '24px' }}>💬</div>
                                <div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#2E3A59', marginBottom: '4px' }}>Live Chat</h4>
                                    <p style={{ fontSize: '14px', color: '#7A859E' }}>Talk to us right now</p>
                                </div>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={onClose}
                            style={{ width: '100%', marginTop: '40px', height: '56px', fontSize: '16px', fontWeight: '700' }}
                        >
                            Close
                        </button>
                    </>
                );
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(46, 58, 89, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '32px',
                width: '100%',
                maxWidth: '560px',
                height: '600px', // Fixed height for smoother transitions
                padding: '48px',
                boxShadow: '0 24px 48px rgba(46, 58, 89, 0.15)',
                position: 'relative',
                animation: 'modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '32px',
                        right: '32px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#7A859E',
                        zIndex: 10
                    }}
                >×</button>

                {renderContent()}
            </div>
        </div>
    );
}

export default SupportModal;
