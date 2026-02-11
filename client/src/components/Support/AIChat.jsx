import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../services/api';

const AIChat = ({ onBack }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your GameLearn AI Tutor. Ask me anything about your courses, platform features, or study tips!", timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/support/chat`,
                { message: input },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const aiMessage = {
                role: 'assistant',
                content: response.data.reply,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #E5E9F2', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>←</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '32px' }}>🤖</div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#2E3A59' }}>AI Learning Tutor</h3>
                        <span style={{ fontSize: '12px', color: '#00D68F' }}>● Online</span>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#F7F9FC' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        backgroundColor: msg.role === 'user' ? '#4F7DF3' : 'white',
                        color: msg.role === 'user' ? 'white' : '#2E3A59',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        position: 'relative'
                    }}>
                        <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{msg.content}</div>
                        <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7, textAlign: 'right' }}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: '16px', backgroundColor: 'white', color: '#2E3A59', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div className="dot-flashing"></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ padding: '20px', borderTop: '1px solid #E5E9F2', display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    style={{ flex: 1, padding: '12px 20px', borderRadius: '24px', border: '1px solid #E5E9F2', outline: 'none' }}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#4F7DF3',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s',
                        opacity: (isLoading || !input.trim()) ? 0.6 : 1
                    }}
                >
                    ➤
                </button>
            </form>

            <style>{`
                .dot-flashing {
                    position: relative;
                    width: 10px;
                    height: 10px;
                    border-radius: 5px;
                    background-color: #4F7DF3;
                    color: #4F7DF3;
                    animation: dot-flashing 1s infinite linear alternate;
                    animation-delay: 0.5s;
                }
                .dot-flashing::before, .dot-flashing::after {
                    content: "";
                    display: inline-block;
                    position: absolute;
                    top: 0;
                }
                .dot-flashing::before {
                    left: -15px;
                    width: 10px;
                    height: 10px;
                    border-radius: 5px;
                    background-color: #4F7DF3;
                    color: #4F7DF3;
                    animation: dot-flashing 1s infinite linear alternate;
                    animation-delay: 0s;
                }
                .dot-flashing::after {
                    left: 15px;
                    width: 10px;
                    height: 10px;
                    border-radius: 5px;
                    background-color: #4F7DF3;
                    color: #4F7DF3;
                    animation: dot-flashing 1s infinite linear alternate;
                    animation-delay: 1s;
                }
                @keyframes dot-flashing {
                    0% { background-color: #4F7DF3; }
                    50%, 100% { background-color: #ebe6ff; }
                }
            `}</style>
        </div>
    );
};

export default AIChat;
