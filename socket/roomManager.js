const rooms = new Map(); // roomId -> Room details

const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Enhanced Room State
 * {
 *   id: string,
 *   players: Array<{ id, name, score, isHost, answered }>,
 *   state: 'lobby' | 'playing' | 'finished',
 *   currentQuestionIndex: number,
 *   questions: Array,
 *   timer: number,
 *   playerAnswers: Object
 * }
 */

const createRoom = (hostSocketId, hostName) => {
    const roomId = generateRoomCode();
    rooms.set(roomId, {
        id: roomId,
        players: [{ id: hostSocketId, name: hostName, score: 0, isHost: true, answered: false }],
        state: 'lobby',
        currentQuestionIndex: 0,
        questions: [],
        playerAnswers: {}, // { questionIndex: { socketId: { answerIndex, points, timeTaken } } }
        timer: null
    });
    return roomId;
};

const joinRoom = (roomId, socketId, playerName) => {
    const room = rooms.get(roomId);
    if (!room) return { error: 'Room not found' };

    // Allow up to 50 players as per requirements
    if (room.players.length >= 50) return { error: 'Room is full' };

    // Handling state during join
    if (room.state !== 'lobby') {
        // Option: Spectator mode or reject. Requirement says "late joiners should see current question"
        // For now, let's treat them as active players if possible, or spectators.
        // Let's allow joining but they might miss previous questions.
    }

    // Check if player already exists (avoid duplicates)
    if (room.players.some(p => p.id === socketId)) return { room };

    room.players.push({ id: socketId, name: playerName, score: 0, isHost: false, answered: false });
    return { room };
};

const leaveRoom = (socketId) => {
    for (const [roomId, room] of rooms.entries()) {
        const playerIndex = room.players.findIndex(p => p.id === socketId);
        if (playerIndex !== -1) {
            room.players.splice(playerIndex, 1);
            if (room.players.length === 0) {
                rooms.delete(roomId);
            } else {
                // If host leaves, make someone else host
                if (!room.players.some(p => p.isHost)) {
                    room.players[0].isHost = true;
                }
            }
            return { roomId, room };
        }
    }
    return null;
};

const getRoom = (roomId) => rooms.get(roomId);

const deleteRoom = (roomId) => rooms.delete(roomId);

module.exports = {
    rooms,
    createRoom,
    joinRoom,
    leaveRoom,
    getRoom,
    deleteRoom
};

