import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { SOCKET_URL } from '../../config/socketConfig';

const LiveChat = ({ onBack }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Initialize Socket
        if (!user) return;

        socketRef.current = io(`${SOCKET_URL}/chat`, {
            query: {
                userId: user._id,
                userName: user.name
            }
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('✅ Connected to Support Chat');
            setIsConnected(true);
            // Join a support room specific to this user or a general one
            // For now, we use the user's ID as their personal room for support replies
            socket.emit('get_history', { room: user._id });
        });

        socket.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
            scrollToBottom();
        });

        // Optimistic update confirmation (optional, or just rely on receive_message if we emit to self)
        // In chatHandler, we emit to recipient. If recipient is self (which it is for history), we get it.
        // But for sending, we emit 'message_sent' back to sender.
        socket.on('message_sent', (message) => {
            // Check if we already added it optimistically? 
            // For simplicity, let's just append updates from server to ensure ID consistency
            // Or better, trigger a refetch or just append if not exists.
            // unique check:
            setMessages(prev => {
                if (prev.some(m => m._id === message._id)) return prev;
                return [...prev, message];
            });
            scrollToBottom();
        });

        socket.on('history_data', (history) => {
            setMessages(history);
            scrollToBottom();
        });

        socket.on('user_typing', ({ userName }) => {
            setTypingUser(userName);
        });

        socket.on('user_stop_typing', () => {
            setTypingUser(null);
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    useEffect(scrollToBottom, [messages, typingUser]);

    const handleInput = (e) => {
        setInput(e.target.value);

        if (socketRef.current) {
            socketRef.current.emit('typing', { room: user?._id }); // Typing in user's own room

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socketRef.current.emit('stop_typing', { room: user?._id });
            }, 1000);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || !socketRef.current) return;

        const content = input.trim();

        // Emit to server (sending to 'support' as recipient, or just putting in user's room)
        // For this MVP, let's say we are chatting in the user's room, and support agents would join this room.
        // But since we don't have a support agent UI yet, we'll just simulate a bot or prepare for it.
        // We set recipient to 'support' for logic.

        socketRef.current.emit('send_message', {
            recipient: user._id, // Sending to self/room so it shows up? No, usually send to OTHER.
            // If this is a support chat, we send to 'support_queue' or similar.
            // For now, let's send to our own room ID, so history works.
            room: user._id,
            content
        });

        setInput('');
        socketRef.current.emit('stop_typing', { room: user._id });
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
                    <span style={{ fontSize: '12px', color: isConnected ? '#4CAF50' : '#f44336', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', backgroundColor: isConnected ? '#4CAF50' : '#f44336', borderRadius: '50%', display: 'inline-block' }}></span>
                        {isConnected ? 'Online' : 'Connecting...'}
                    </span>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px', marginBottom: '16px' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#B0B7C3', marginTop: '40px' }}>
                        <p>Welcome to LevelUpED Support.</p>
                        <p>Send a message to start chatting.</p>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.sender._id === user?._id || msg.sender === user?._id;
                    return (
                        <div key={msg._id || index} style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                        }}>
                            <div style={{
                                padding: '12px 16px',
                                backgroundColor: isMe ? '#4F7DF3' : '#F6F8FC',
                                color: isMe ? 'white' : '#2E3A59',
                                borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                fontSize: '14px',
                                lineHeight: '1.4'
                            }}>
                                {msg.content}
                            </div>
                            <div style={{ fontSize: '10px', color: '#B0B7C3', marginTop: '4px', textAlign: isMe ? 'right' : 'left' }}>
                                {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    );
                })}

                {typingUser && typingUser !== user?.name && (
                    <div style={{ alignSelf: 'flex-start', padding: '12px 16px', backgroundColor: '#F6F8FC', borderRadius: '20px 20px 20px 4px' }}>
                        <span style={{ fontSize: '12px', color: '#7A859E' }}>{typingUser} is typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInput}
                    placeholder="Type a message..."
                    disabled={!isConnected}
                    style={{ flex: 1, padding: '12px', borderRadius: '24px', border: '1px solid #E5E9F2', fontSize: '14px', outline: 'none' }}
                />
                <button
                    type="submit"
                    disabled={!isConnected || !input.trim()}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: isConnected && input.trim() ? '#4F7DF3' : '#E5E9F2',
                        color: 'white',
                        border: 'none',
                        cursor: isConnected && input.trim() ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        transition: 'background-color 0.2s'
                    }}
                >
                    ➤
                </button>
            </form>
        </div>
    );
};

export default LiveChat;
