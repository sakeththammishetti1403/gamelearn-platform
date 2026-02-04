import React, { useState, useEffect, useRef } from 'react';

const LiveChat = ({ onBack }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello! How can we help you today?', sender: 'agent', time: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user', time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate agent response
        setTimeout(() => {
            const responses = [
                "I see, could you tell me more about that?",
                "Let me check that for you.",
                "Have you tried refreshing the page?",
                "That sounds like a technical glitch. I've noted it down.",
                "Is there anything else I can help with?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const agentMsg = { id: Date.now() + 1, text: randomResponse, sender: 'agent', time: new Date() };
            setMessages(prev => [...prev, agentMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div style={{ padding: '0 20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #E5E9F2', paddingBottom: '16px' }}>
                <button
                    onClick={onBack}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#2E3A59' }}
                >
                    ←
                </button>
                <div>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#2E3A59' }}>Live Support</h2>
                    <span style={{ fontSize: '12px', color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#4CAF50', borderRadius: '50%', display: 'inline-block' }}></span>
                        Online
                    </span>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px', marginBottom: '16px' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                    }}>
                        <div style={{
                            padding: '12px 16px',
                            backgroundColor: msg.sender === 'user' ? '#4F7DF3' : '#F6F8FC',
                            color: msg.sender === 'user' ? 'white' : '#2E3A59',
                            borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            fontSize: '14px',
                            lineHeight: '1.4'
                        }}>
                            {msg.text}
                        </div>
                        <div style={{ fontSize: '10px', color: '#B0B7C3', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                            {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div style={{ alignSelf: 'flex-start', padding: '12px 16px', backgroundColor: '#F6F8FC', borderRadius: '20px 20px 20px 4px' }}>
                        <span style={{ fontSize: '12px', color: '#7A859E' }}>Agent is typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '12px', borderRadius: '24px', border: '1px solid #E5E9F2', fontSize: '14px', outline: 'none' }}
                />
                <button
                    type="submit"
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
                        fontSize: '20px'
                    }}
                >
                    ➤
                </button>
            </form>
        </div>
    );
};

export default LiveChat;
