const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const errorHandler = require('./middleware/errorMiddleware');

// 1. Load Env
dotenv.config();

// Global error handlers
process.on('uncaughtException', (error) => {
    console.error('❌ UNCAUGHT EXCEPTION:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ UNHANDLED REJECTION at:', promise);
    console.error('Reason:', reason);
    process.exit(1);
});

console.log('🔧 Starting server initialization...');
console.log('� Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', process.env.PORT || 5000);

// 2. Validate Environment Variables
const validateEnv = require('./utils/validateEnv');
try {
    validateEnv();
} catch (error) {
    console.error('❌ Environment validation failed:', error.message);
    process.exit(1);
}

// 2. Setup Express & HTTP Server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// 3. Global Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'https://leveluped.vercel.app',
        'https://leveluped-app-production-94a3.up.railway.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());

// Initialize Passport
const passport = require('passport');
app.use(passport.initialize());
require('./config/passport')(passport);

// 4. Database Connection
console.log('🔄 Connecting to MongoDB...');
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        console.error("Full error:", err);
        process.exit(1);
    });

// 5. Attach Socket.IO to SAME server
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173',
            'https://leveluped.vercel.app',
            'https://leveluped-app-production-94a3.up.railway.app',
            process.env.FRONTEND_URL
        ].filter(Boolean),
        credentials: true
    }
});

// 6. Multiplayer Arena Logic (Delegated for Production-Grade Gameplay)
const socketHandler = require('./socket/gameHandler');
socketHandler(io);

// 6b. Real-time Chat Logic
const chatHandler = require('./socket/chatHandler');
chatHandler(io);

// 7. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/career', require('./routes/career'));
app.use('/api/learning', require('./routes/learning'));

// Auto-seed Career Tracks
const seedCareerTracks = require('./seedCareer');
mongoose.connection.once('open', () => {
    seedCareerTracks();
});

app.use('/api/game', require('./routes/game'));
app.use('/api/instructor', require('./routes/instructor'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/support', require('./routes/support'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/reward', require('./routes/reward'));

const path = require('path');

// Simple ping endpoint for Railway healthcheck
app.get('/ping', (req, res) => {
    console.log('🏓 Ping received');
    res.send('pong');
});

// Health Check - MUST be before static files
app.get('/health', (req, res) => {
    console.log('✅ Health check requested');
    res.status(200).json({
        status: 'active',
        services: ['api', 'sockets'],
        timestamp: new Date(),
        port: PORT,
        env: process.env.NODE_ENV
    });
});

// Simple test endpoint
app.get('/test', (req, res) => {
    console.log('🧪 Test endpoint hit');
    res.send('Server is working! Port: ' + PORT);
});

// 9. Serve Frontend (Monolithic Deployment)
console.log('📁 Setting up static file serving from:', path.join(__dirname, 'client/dist'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/dist')));

// The "catchall" handler: for any request that doesn't match API routes
app.get('*', (req, res) => {
    // Skip API routes and socket.io
    if (req.path.startsWith('/api/') || req.path.startsWith('/socket.io')) {
        return res.status(404).json({ error: 'Not found' });
    }
    
    console.log('🔄 Catch-all route hit for:', req.path);
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// 8. Error Handling Middleware (Must be ABSOLUTE LAST)
app.use(errorHandler);

// 10. Start Unified Server with Port Collision Handling
console.log(`🚀 Starting server on port ${PORT}...`);
console.log(`🔌 Binding to 0.0.0.0:${PORT}`);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server successfully started!`);
    console.log(`🚀 Unified Server + Multiplayer Arena running on port ${PORT}`);
    console.log(`� Server is ready to accept connections`);
    console.log(`📍 Health check available at: http://0.0.0.0:${PORT}/health`);
    console.log(`📍 Ping endpoint available at: http://0.0.0.0:${PORT}/ping`);
    console.log(`📍 Test endpoint available at: http://0.0.0.0:${PORT}/test`);
    
    // Log server address info
    const address = server.address();
    console.log(`📡 Server address info:`, JSON.stringify(address));
}).on('error', (err) => {
    console.error('❌ Server failed to start!');
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ FATAL ERROR: Port ${PORT} is already in use.`);
        console.error(`💡 SOLUTION: Check for duplicate processes or run 'npm run kill-server' (if available).`);
    } else {
        console.error("❌ Server error:", err.message);
        console.error("Full error:", err);
    }
    process.exit(1);
});

