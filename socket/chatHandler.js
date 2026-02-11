const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

module.exports = (io) => {
    const chatNamespace = io.of('/chat');

    chatNamespace.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        const userName = socket.handshake.query.userName;

        console.log(`💬 [CHAT] ${userName} connected (${socket.id})`);

        // Join user's personal room for direct messages
        if (userId) {
            socket.join(userId);
        }

        // Join support room if user is admin or support agent (for future role handling)
        // socket.join('support_room');

        // Handle joining specific chat rooms (e.g., support tickets or course discussions)
        socket.on('join_room', (room) => {
            socket.join(room);
            console.log(`💬 [CHAT] ${userName} joined room: ${room}`);
        });

        // Handle sending messages
        socket.on('send_message', async (data) => {
            const { recipient, content, room } = data;

            try {
                // Save to DB
                // If userId is missing (e.g., anonymous), handle gracefully or require auth
                if (!userId) {
                    socket.emit('error', { message: 'Authentication required' });
                    return;
                }

                const newMessage = new ChatMessage({
                    sender: userId,
                    recipient: recipient || room, // If room provided, treat as recipient
                    content: content,
                    read: false
                });

                await newMessage.save();

                // Populate sender info for the client
                const populatedMessage = await newMessage.populate('sender', 'name avatar');

                // Emit to recipient (room or specific user)
                const target = room || recipient;
                chatNamespace.to(target).emit('receive_message', populatedMessage);

                // Also emit back to sender (for optimistic UI updates confirmation)
                socket.emit('message_sent', populatedMessage);

            } catch (error) {
                console.error('❌ [CHAT] Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Typing indicators
        socket.on('typing', (data) => {
            const { room } = data;
            socket.to(room).emit('user_typing', { userId, userName });
        });

        socket.on('stop_typing', (data) => {
            const { room } = data;
            socket.to(room).emit('user_stop_typing', { userId });
        });

        // Fetch Chat History
        socket.on('get_history', async (data) => {
            const { room, limit = 50 } = data;
            try {
                const messages = await ChatMessage.find({
                    $or: [
                        { recipient: room },
                        { recipient: userId, sender: room } // If it's a DM, handle logic differently
                        // For simplistic support chat room = 'support_userId'
                    ]
                })
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .populate('sender', 'name avatar');

                socket.emit('history_data', messages.reverse());
            } catch (error) {
                console.error('❌ [CHAT] Error fetching history:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`💬 [CHAT] ${userName} disconnected`);
        });
    });

    console.log('✅ [SERVER] Chat handler initialized on namespace /chat');
};
