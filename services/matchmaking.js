const matchmakingQueue = []; // Array of { socketId, userId, skillRating, name, joinedAt }

const addToQueue = (player) => {
    // Check if already in queue
    if (matchmakingQueue.some(p => p.socketId === player.socketId)) return;

    matchmakingQueue.push({
        ...player,
        joinedAt: Date.now()
    });
    console.log(`👤 Player ${player.name} (${player.socketId}) joined matchmaking.`);
};

const removeFromQueue = (socketId) => {
    const index = matchmakingQueue.findIndex(p => p.socketId === socketId);
    if (index !== -1) {
        matchmakingQueue.splice(index, 1);
        console.log(`👋 Player ${socketId} left matchmaking.`);
        return true;
    }
    return false;
};

const findMatch = () => {
    // Sort by skill rating or wait time
    if (matchmakingQueue.length >= 2) {
        // Simple strategy: pair first two available
        // Future: Check rating difference (e.g., +/- 200)
        return matchmakingQueue.splice(0, 2);
    }
    return null;
};

const getQueueStatus = (socketId) => {
    const player = matchmakingQueue.find(p => p.socketId === socketId);
    if (!player) return null;
    return {
        waitTime: Math.floor((Date.now() - player.joinedAt) / 1000),
        queueSize: matchmakingQueue.length
    };
};

module.exports = {
    addToQueue,
    removeFromQueue,
    findMatch,
    getQueueStatus
};
