const GameResult = require('../models/GameResult');
const User = require('../models/User');

// In-memory room storage
const rooms = new Map();

// Game constants
const GAME_CONFIG = {
    MIN_PLAYERS: 2,
    MAX_PLAYERS: 10,
    QUESTION_COUNT: 5,
    QUESTION_TIME: 15,
    POINTS_CORRECT: 100,
    POINTS_FAST_BONUS: 50
};

const ROOM_STATES = {
    WAITING: 'WAITING',
    PLAYING: 'PLAYING',
    FINISHED: 'FINISHED'
};

// Sample questions (in production, fetch from DB)
const SAMPLE_QUESTIONS = [
    {
        text: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: 1
    },
    {
        text: "Which data structure uses LIFO?",
        options: ["Queue", "Stack", "Array", "Tree"],
        correctAnswer: 1
    },
    {
        text: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
        correctAnswer: 1
    },
    {
        text: "Which HTTP method is idempotent?",
        options: ["POST", "PUT", "PATCH", "All of the above"],
        correctAnswer: 1
    },
    {
        text: "What is the default port for HTTPS?",
        options: ["80", "443", "8080", "3000"],
        correctAnswer: 1
    }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Ensure uniqueness
    return rooms.has(code) ? generateRoomCode() : code;
}

function createRoom(hostSocket, hostName) {
    const code = generateRoomCode();
    const room = {
        code,
        host: hostSocket.id,
        players: [{
            id: hostSocket.id,
            name: hostName,
            score: 0,
            answers: []
        }],
        state: ROOM_STATES.WAITING,
        currentQuestion: 0,
        questions: [...SAMPLE_QUESTIONS],
        timer: GAME_CONFIG.QUESTION_TIME,
        maxPlayers: GAME_CONFIG.MAX_PLAYERS,
        createdAt: Date.now()
    };

    rooms.set(code, room);
    console.log(`📦 [SERVER] Room created: ${code} by ${hostName}`);
    return room;
}

function getRoom(code) {
    return rooms.get(code);
}

function addPlayerToRoom(room, socket, playerName) {
    if (room.players.length >= room.maxPlayers) {
        return { success: false, error: 'Room is full' };
    }

    if (room.state !== ROOM_STATES.WAITING) {
        return { success: false, error: 'Game already in progress' };
    }

    // Check if player already in room
    if (room.players.find(p => p.id === socket.id)) {
        return { success: false, error: 'Already in this room' };
    }

    room.players.push({
        id: socket.id,
        name: playerName,
        score: 0,
        answers: []
    });

    console.log(`👤 [SERVER] ${playerName} joined room ${room.code}`);
    return { success: true };
}

function removePlayerFromRoom(room, socketId) {
    const playerIndex = room.players.findIndex(p => p.id === socketId);
    if (playerIndex === -1) return;

    const player = room.players[playerIndex];
    room.players.splice(playerIndex, 1);

    console.log(`👋 [SERVER] ${player.name} left room ${room.code}`);

    // If host left, end game
    if (room.host === socketId) {
        console.log(`🚫 [SERVER] Host left, ending room ${room.code}`);
        rooms.delete(room.code);
        return true; // Room deleted
    }

    // If no players left, delete room
    if (room.players.length === 0) {
        console.log(`🗑️ [SERVER] Room ${room.code} empty, deleting`);
        rooms.delete(room.code);
        return true;
    }

    return false;
}

// ============================================
// GAME LOGIC
// ============================================

function startGame(io, room) {
    if (room.state !== ROOM_STATES.WAITING) return;
    if (room.players.length < GAME_CONFIG.MIN_PLAYERS) return;

    room.state = ROOM_STATES.PLAYING;
    room.currentQuestion = 0;

    console.log(`🎮 [SERVER] Starting game in room ${room.code} with ${room.players.length} players`);

    io.to(room.code).emit('game:start', {
        playerCount: room.players.length,
        questionCount: GAME_CONFIG.QUESTION_COUNT
    });

    // Send first question after 2 seconds
    setTimeout(() => sendQuestion(io, room), 2000);
}

function sendQuestion(io, room) {
    if (room.currentQuestion >= room.questions.length) {
        endGame(io, room);
        return;
    }

    const question = room.questions[room.currentQuestion];
    room.timer = GAME_CONFIG.QUESTION_TIME;
    room.playerAnswers = {}; // Reset answers for this question

    console.log(`❓ [SERVER] Sending Q${room.currentQuestion + 1} to room ${room.code}`);

    io.to(room.code).emit('game:question', {
        questionNumber: room.currentQuestion + 1,
        totalQuestions: room.questions.length,
        text: question.text,
        options: question.options,
        timer: room.timer
    });

    // Start timer
    startTimer(io, room);
}

function startTimer(io, room) {
    const timerInterval = setInterval(() => {
        room.timer--;

        io.to(room.code).emit('game:timer', { timer: room.timer });

        if (room.timer <= 0) {
            clearInterval(timerInterval);
            processQuestionEnd(io, room);
        }
    }, 1000);

    // Store interval for cleanup
    room.timerInterval = timerInterval;
}

function handleAnswer(io, socket, roomCode, answerIndex) {
    const room = getRoom(roomCode);
    if (!room || room.state !== ROOM_STATES.PLAYING) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    // Prevent duplicate answers
    if (room.playerAnswers && room.playerAnswers[socket.id]) return;

    const question = room.questions[room.currentQuestion];
    const isCorrect = answerIndex === question.correctAnswer;

    // Calculate score
    let points = 0;
    if (isCorrect) {
        points = GAME_CONFIG.POINTS_CORRECT;
        // Fast answer bonus
        if (room.timer > 10) {
            points += GAME_CONFIG.POINTS_FAST_BONUS;
        }
    }

    player.score += points;
    player.answers.push({
        questionIndex: room.currentQuestion,
        answer: answerIndex,
        correct: isCorrect,
        points,
        timeLeft: room.timer
    });

    // Track who answered
    if (!room.playerAnswers) room.playerAnswers = {};
    room.playerAnswers[socket.id] = true;

    console.log(`✅ [SERVER] ${player.name} answered Q${room.currentQuestion + 1}: ${isCorrect ? 'CORRECT' : 'WRONG'} (+${points}pts)`);

    // Send result to player
    socket.emit('game:result', {
        correct: isCorrect,
        correctAnswer: question.correctAnswer,
        points,
        newScore: player.score
    });

    // Broadcast score update
    io.to(roomCode).emit('game:scores', {
        players: room.players.map(p => ({
            id: p.id,
            name: p.name,
            score: p.score
        }))
    });
}

function processQuestionEnd(io, room) {
    const question = room.questions[room.currentQuestion];

    // Send correct answer to all players who didn't answer
    room.players.forEach(player => {
        if (!room.playerAnswers || !room.playerAnswers[player.id]) {
            const socket = io.sockets.sockets.get(player.id);
            if (socket) {
                socket.emit('game:result', {
                    correct: false,
                    correctAnswer: question.correctAnswer,
                    points: 0,
                    newScore: player.score
                });
            }
        }
    });

    room.currentQuestion++;

    // Send next question or end game
    setTimeout(() => {
        if (room.currentQuestion < room.questions.length) {
            sendQuestion(io, room);
        } else {
            endGame(io, room);
        }
    }, 3000);
}

async function endGame(io, room) {
    room.state = ROOM_STATES.FINISHED;

    if (room.timerInterval) {
        clearInterval(room.timerInterval);
    }

    // Sort players by score
    const results = room.players
        .map(p => ({
            id: p.id,
            name: p.name,
            score: p.score,
            accuracy: (p.answers.filter(a => a.correct).length / p.answers.length * 100).toFixed(1)
        }))
        .sort((a, b) => b.score - a.score);

    console.log(`🏁 [SERVER] Game ended in room ${room.code}`);
    console.log(`🏆 Winner: ${results[0].name} with ${results[0].score} points`);

    io.to(room.code).emit('game:end', {
        results,
        winner: results[0]
    });

    // Save to database
    try {
        await saveGameResults(room, results);
    } catch (error) {
        console.error('❌ [SERVER] Failed to save game results:', error);
    }

    // Clean up room after 30 seconds
    setTimeout(() => {
        rooms.delete(room.code);
        console.log(`🗑️ [SERVER] Room ${room.code} cleaned up`);
    }, 30000);
}

async function saveGameResults(room, results) {
    // Save game result
    const gameResult = new GameResult({
        roomCode: room.code,
        players: results.map(r => ({
            userId: r.id, // In production, use actual user ID
            name: r.name,
            score: r.score,
            accuracy: parseFloat(r.accuracy)
        })),
        winner: results[0].id,
        timestamp: new Date(),
        questionCount: room.questions.length
    });

    await gameResult.save();

    // Update user stats (if user IDs are available)
    // This would be implemented when we have proper user authentication
    console.log(`💾 [SERVER] Game results saved for room ${room.code}`);
}

// ============================================
// SOCKET EVENT HANDLERS
// ============================================

module.exports = (io) => {
    io.on('connection', (socket) => {
        const playerName = socket.handshake.query.name || 'Player';
        console.log(`🔌 [SERVER] ${playerName} connected (${socket.id})`);

        // CREATE ROOM
        socket.on('room:create', () => {
            console.log(`\n📥 [ROOM] Create requested by ${playerName} (${socket.id})`);

            try {
                const room = createRoom(socket, playerName);
                socket.join(room.code);

                console.log(`✅ [ROOM] Room ${room.code} created successfully`);
                console.log(`👤 [ROOM] Host ${playerName} joined room ${room.code}`);

                const response = {
                    code: room.code,
                    players: room.players.map(p => ({ id: p.id, name: p.name, score: p.score }))
                };

                console.log(`📤 [ROOM] Emitting room:created to ${socket.id}:`, response);
                socket.emit('room:created', response);

            } catch (error) {
                console.error(`❌ [ROOM] Failed to create room:`, error);
                socket.emit('room:error', { message: 'Failed to create room. Please try again.' });
            }
        });

        // JOIN ROOM
        socket.on('room:join', (code) => {
            console.log(`\n📥 [ROOM] Join requested by ${playerName} (${socket.id}) for room: ${code}`);

            const room = getRoom(code);

            if (!room) {
                console.error(`❌ [ROOM] Room ${code} not found`);
                socket.emit('room:error', { message: 'Room not found' });
                return;
            }

            const result = addPlayerToRoom(room, socket, playerName);

            if (!result.success) {
                console.error(`❌ [ROOM] Failed to join ${code}: ${result.error}`);
                socket.emit('room:error', { message: result.error });
                return;
            }

            socket.join(code);
            console.log(`✅ [ROOM] ${playerName} successfully joined room ${code}`);

            // Notify player
            const joinResponse = {
                code: room.code,
                players: room.players.map(p => ({ id: p.id, name: p.name, score: p.score }))
            };

            console.log(`📤 [ROOM] Emitting room:joined to ${socket.id}`);
            socket.emit('room:joined', joinResponse);

            // Notify all players in room
            const updateResponse = {
                players: room.players.map(p => ({ id: p.id, name: p.name, score: p.score }))
            };

            console.log(`📤 [ROOM] Broadcasting room:update to all in ${code}`);
            io.to(code).emit('room:update', updateResponse);

            // Auto-start if minimum players reached
            if (room.players.length >= GAME_CONFIG.MIN_PLAYERS && room.state === ROOM_STATES.WAITING) {
                console.log(`🎮 [ROOM] Minimum players reached in ${code}, starting game in 2s...`);
                setTimeout(() => startGame(io, room), 2000);
            }
        });

        // SUBMIT ANSWER
        socket.on('game:answer', ({ roomCode, answerIndex }) => {
            handleAnswer(io, socket, roomCode, answerIndex);
        });

        // DISCONNECT
        socket.on('disconnect', () => {
            console.log(`🔌 [SERVER] ${playerName} disconnected (${socket.id})`);

            // Find and remove player from any room
            for (const [code, room] of rooms.entries()) {
                if (room.players.find(p => p.id === socket.id)) {
                    const roomDeleted = removePlayerFromRoom(room, socket.id);

                    if (!roomDeleted) {
                        // Notify remaining players
                        io.to(code).emit('room:update', {
                            players: room.players.map(p => ({ id: p.id, name: p.name, score: p.score }))
                        });
                    } else {
                        // Notify players that room ended
                        io.to(code).emit('room:error', { message: 'Host disconnected. Game ended.' });
                    }
                    break;
                }
            }
        });
    });

    console.log('✅ [SERVER] Game handler initialized');
};
