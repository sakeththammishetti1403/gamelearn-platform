import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Common/Loading';

const SOCKET_URL = 'http://localhost:5000';
let socket = null;

function MultiplayerDashboard() {
    const { user } = useAuth();

    // State
    const [view, setView] = useState('LOBBY'); // LOBBY, WAITING, PLAYING, FINISHED
    const [roomCode, setRoomCode] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [players, setPlayers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timer, setTimer] = useState(15);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [result, setResult] = useState(null);
    const [finalResults, setFinalResults] = useState([]);
    const [error, setError] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    // ============================================
    // SOCKET CONNECTION
    // ============================================

    useEffect(() => {
        // Initialize socket
        socket = io(SOCKET_URL, {
            transports: ['websocket'],
            withCredentials: true,
            query: {
                name: user?.name || 'Player'
            }
        });

        socket.on('connect', () => {
            console.log('✅ [CLIENT] Connected to server');
            setIsConnected(true);
            setError('');
        });

        socket.on('disconnect', () => {
            console.log('🔌 [CLIENT] Disconnected from server');
            setIsConnected(false);
        });

        socket.on('connect_error', (err) => {
            console.error('❌ [CLIENT] Connection error:', err);
            setError('Failed to connect to server');
        });

        // Room events
        socket.on('room:created', (data) => {
            console.log('✅ [CLIENT] room:created received');
            console.log('📦 [CLIENT] Room code:', data.code);
            console.log('👥 [CLIENT] Players:', data.players);

            setRoomCode(data.code);
            setPlayers(data.players);
            setView('WAITING');
            setError('');
        });

        socket.on('room:joined', (data) => {
            console.log('👤 [CLIENT] Joined room:', data.code);
            setRoomCode(data.code);
            setPlayers(data.players);
            setView('WAITING');
        });

        socket.on('room:update', (data) => {
            console.log('🔄 [CLIENT] Room updated');
            setPlayers(data.players);
        });

        socket.on('room:error', (data) => {
            console.error('❌ [CLIENT] Room error:', data.message);
            setError(data.message);
            setTimeout(() => setError(''), 5000);
        });

        // Game events
        socket.on('game:start', (data) => {
            console.log('🎮 [CLIENT] Game starting!');
            setView('PLAYING');
            setSelectedAnswer(null);
            setResult(null);
        });

        socket.on('game:question', (data) => {
            console.log(`❓ [CLIENT] Question ${data.questionNumber}/${data.totalQuestions}`);
            setCurrentQuestion(data);
            setTimer(data.timer);
            setSelectedAnswer(null);
            setResult(null);
        });

        socket.on('game:timer', (data) => {
            setTimer(data.timer);
        });

        socket.on('game:result', (data) => {
            console.log(`${data.correct ? '✅' : '❌'} [CLIENT] Answer result:`, data);
            setResult(data);
        });

        socket.on('game:scores', (data) => {
            setPlayers(data.players);
        });

        socket.on('game:end', (data) => {
            console.log('🏁 [CLIENT] Game ended');
            setFinalResults(data.results);
            setView('FINISHED');
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [user]);

    // ============================================
    // HANDLERS
    // ============================================

    const handleCreateRoom = () => {
        console.log('\n🎮 [CLIENT] Create Room button clicked');
        console.log('🔌 [CLIENT] Socket connected:', isConnected);
        console.log('🔌 [CLIENT] Socket ID:', socket?.id);

        if (!isConnected) {
            console.error('❌ [CLIENT] Cannot create room - not connected to server');
            setError('Not connected to server. Please wait...');
            return;
        }

        if (!socket) {
            console.error('❌ [CLIENT] Socket object is null');
            setError('Connection error. Please refresh the page.');
            return;
        }

        console.log('📤 [CLIENT] Emitting room:create event');
        socket.emit('room:create');

        // Show loading state
        setError('Creating room...');
    };

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (!joinCode.trim()) {
            setError('Please enter a room code');
            return;
        }
        if (!isConnected) {
            setError('Not connected to server');
            return;
        }
        console.log('🎮 [CLIENT] Joining room:', joinCode);
        socket.emit('room:join', joinCode.toUpperCase());
    };

    const handleAnswer = (answerIndex) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(answerIndex);
        console.log('🎮 [CLIENT] Submitting answer:', answerIndex);
        socket.emit('game:answer', { roomCode, answerIndex });
    };

    const handleBackToLobby = () => {
        setView('LOBBY');
        setRoomCode('');
        setJoinCode('');
        setPlayers([]);
        setCurrentQuestion(null);
        setFinalResults([]);
        setError('');
    };

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode);
        alert('Room code copied!');
    };

    // ============================================
    // RENDER FUNCTIONS
    // ============================================

    const renderLobby = () => (
        <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>🎮 Multiplayer Arena</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                    Challenge your friends in a real-time quiz battle!
                </p>
            </div>

            {!isConnected && (
                <div className="card" style={{ padding: '20px', marginBottom: '24px', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="pulse" style={{ fontSize: '24px' }}>⚠️</div>
                        <div>
                            <div style={{ fontWeight: '700', color: '#92400E' }}>Connecting to server...</div>
                            <div style={{ fontSize: '14px', color: '#92400E', opacity: 0.8 }}>Please wait</div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="card fade-in" style={{ padding: '20px', marginBottom: '24px', backgroundColor: '#FEE2E2', border: '1px solid #EF4444' }}>
                    <div style={{ fontWeight: '700', color: '#991B1B' }}>❌ {error}</div>
                </div>
            )}

            <div className="card" style={{ padding: '40px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Create New Room</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
                    Start a new game and invite your friends with a room code
                </p>
                <button
                    className="btn btn-primary"
                    onClick={handleCreateRoom}
                    disabled={!isConnected}
                    style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '700' }}
                >
                    🎯 Create Room
                </button>
            </div>

            <div className="card" style={{ padding: '40px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Join Existing Room</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
                    Enter a 6-character room code to join a game
                </p>
                <form onSubmit={handleJoinRoom}>
                    <input
                        type="text"
                        placeholder="Enter room code (e.g., ABC123)"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '18px',
                            fontWeight: '700',
                            textAlign: 'center',
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            marginBottom: '16px',
                            border: '2px solid var(--border-color)',
                            borderRadius: '12px'
                        }}
                    />
                    <button
                        type="submit"
                        className="btn btn-secondary"
                        disabled={!isConnected || !joinCode.trim()}
                        style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '700' }}
                    >
                        🚀 Join Room
                    </button>
                </form>
            </div>
        </div>
    );

    const renderWaiting = () => (
        <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>Waiting for Players...</h2>

                <div style={{
                    fontSize: '48px',
                    fontWeight: '900',
                    color: 'var(--primary)',
                    letterSpacing: '8px',
                    padding: '24px',
                    backgroundColor: 'var(--bg-app)',
                    borderRadius: '16px',
                    marginBottom: '24px',
                    border: '2px solid var(--primary)',
                    cursor: 'pointer'
                }} onClick={copyRoomCode}>
                    {roomCode}
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '8px', letterSpacing: 'normal' }}>
                        Click to copy
                    </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
                        PLAYERS IN ROOM ({players.length})
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {players.map((player, i) => (
                            <div key={i} style={{
                                padding: '16px',
                                backgroundColor: 'var(--bg-app)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    fontWeight: '900'
                                }}>
                                    {player.name[0].toUpperCase()}
                                </div>
                                <span style={{ fontWeight: '600', fontSize: '16px' }}>{player.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: '#DBEAFE', borderRadius: '12px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '14px', color: '#1E40AF', fontWeight: '600' }}>
                        {players.length < 2
                            ? '⏳ Waiting for at least 2 players to start...'
                            : '🎮 Game will start automatically!'}
                    </div>
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={handleBackToLobby}
                    style={{ width: '100%', padding: '12px' }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );

    const renderPlaying = () => {
        if (!currentQuestion) {
            return (
                <div className="card fade-in" style={{ maxWidth: '900px', margin: '40px auto', padding: '60px', textAlign: 'center' }}>
                    <div className="pulse" style={{ fontSize: '48px', marginBottom: '24px' }}>⏳</div>
                    <h2 style={{ fontSize: '24px' }}>Loading Question...</h2>
                </div>
            );
        }

        return (
            <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)' }}>
                        Question {currentQuestion.questionNumber} of {currentQuestion.totalQuestions}
                    </div>
                    <div style={{
                        fontSize: '32px',
                        fontWeight: '900',
                        color: timer <= 5 ? '#EF4444' : 'var(--primary)',
                        animation: timer <= 5 ? 'pulse 1s infinite' : 'none'
                    }}>
                        {timer}s
                    </div>
                </div>

                {/* Question Card */}
                <div className="card" style={{ padding: '48px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', lineHeight: '1.5', marginBottom: '32px' }}>
                        {currentQuestion.text}
                    </h2>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = result && result.correctAnswer === index;
                            const isWrong = result && selectedAnswer === index && !result.correct;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    disabled={selectedAnswer !== null}
                                    className="btn"
                                    style={{
                                        padding: '20px 24px',
                                        textAlign: 'left',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        backgroundColor: isCorrect ? '#10B981' : isWrong ? '#EF4444' : isSelected ? 'var(--primary)' : 'var(--bg-secondary)',
                                        color: isCorrect || isWrong || isSelected ? 'white' : 'var(--text-primary)',
                                        border: isSelected ? '2px solid var(--primary)' : '2px solid transparent',
                                        cursor: selectedAnswer !== null ? 'not-allowed' : 'pointer',
                                        opacity: selectedAnswer !== null && !isSelected && !isCorrect ? 0.5 : 1,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <span style={{ marginRight: '12px', opacity: 0.7 }}>{String.fromCharCode(65 + index)}.</span>
                                    {option}
                                </button>
                            );
                        })}
                    </div>

                    {result && (
                        <div className="fade-in" style={{
                            marginTop: '24px',
                            padding: '20px',
                            backgroundColor: result.correct ? '#D1FAE5' : '#FEE2E2',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '18px', fontWeight: '700', color: result.correct ? '#065F46' : '#991B1B' }}>
                                {result.correct ? '✅ Correct!' : '❌ Wrong'}
                            </div>
                            <div style={{ fontSize: '14px', color: result.correct ? '#065F46' : '#991B1B', marginTop: '4px' }}>
                                +{result.points} points
                            </div>
                        </div>
                    )}
                </div>

                {/* Live Scoreboard */}
                {players.length > 0 && (
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
                            LIVE SCORES
                        </div>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {players.map((player, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px',
                                    backgroundColor: 'var(--bg-app)',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{ fontWeight: '600' }}>{player.name}</span>
                                    <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)' }}>
                                        {player.score || 0}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderFinished = () => (
        <div className="fade-in" style={{ maxWidth: '600px', margin: '40px auto' }}>
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                <span style={{ fontSize: '80px', display: 'block', marginBottom: '24px' }}>
                    {finalResults[0]?.id === socket?.id ? '🏆' : '🎮'}
                </span>
                <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>
                    {finalResults[0]?.id === socket?.id ? 'Victory!' : 'Game Complete'}
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Great game everyone!
                </p>

                <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
                        FINAL RESULTS
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {finalResults.map((player, i) => (
                            <div key={i} style={{
                                padding: '20px',
                                backgroundColor: i === 0 ? '#FEF3C7' : 'var(--bg-app)',
                                borderRadius: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: i === 0 ? '2px solid #F59E0B' : 'none'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-tertiary)' }}>
                                        #{i + 1}
                                    </span>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: '700', fontSize: '16px' }}>{player.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {player.accuracy}% accuracy
                                        </div>
                                    </div>
                                </div>
                                <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)' }}>
                                    {player.score}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleBackToLobby}
                    style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '700' }}
                >
                    Back to Lobby
                </button>
            </div>
        </div>
    );

    // ============================================
    // MAIN RENDER
    // ============================================

    try {
        return (
            <div style={{ padding: '40px 20px', minHeight: '100vh' }}>
                {view === 'LOBBY' && renderLobby()}
                {view === 'WAITING' && renderWaiting()}
                {view === 'PLAYING' && renderPlaying()}
                {view === 'FINISHED' && renderFinished()}
            </div>
        );
    } catch (error) {
        console.error('❌ [CLIENT] Render error:', error);
        return (
            <div className="card" style={{ maxWidth: '600px', margin: '100px auto', padding: '48px', textAlign: 'center' }}>
                <span style={{ fontSize: '64px', display: 'block', marginBottom: '24px' }}>⚠️</span>
                <h2 style={{ marginBottom: '16px' }}>Something went wrong</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    {error.message || 'An unexpected error occurred'}
                </p>
                <button className="btn btn-primary" onClick={handleBackToLobby}>
                    Back to Lobby
                </button>
            </div>
        );
    }
}

export default MultiplayerDashboard;
