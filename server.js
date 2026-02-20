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
// Temporarily disable helmet to fix CSP blocking issue
// app.use(helmet({
//     contentSecurityPolicy: false,
//     crossOriginEmbedderPolicy: false
// }));

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'https://gamelearn-platform-2.onrender.com',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
    next();
});

// CRITICAL: Health check FIRST - before any other setup
app.get('/health', (req, res) => {
    console.log('✅ Health check requested');
    res.status(200).send('OK');
});

app.get('/ping', (req, res) => {
    console.log('🏓 Ping received');
    res.status(200).send('pong');
});

// Initialize Passport with error handling
try {
    const passport = require('passport');
    app.use(passport.initialize());
    require('./config/passport')(passport);
    console.log('✅ Passport initialized');
} catch (err) {
    console.error('⚠️ Passport initialization failed:', err.message);
    console.error('Server will continue without OAuth');
}

// 4. Database Connection
console.log('🔄 Connecting to MongoDB...');
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        console.error("⚠️ Server will continue without MongoDB");
        // Don't exit - let server start anyway for healthcheck
    });

// 5. Attach Socket.IO to SAME server
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173',
            'https://gamelearn-platform-2.onrender.com',
            process.env.FRONTEND_URL
        ].filter(Boolean),
        credentials: true
    }
});

// 6. Multiplayer Arena Logic (Delegated for Production-Grade Gameplay)
try {
    const socketHandler = require('./socket/gameHandler');
    socketHandler(io);
    console.log('✅ Game handler initialized');
} catch (err) {
    console.error('⚠️ Game handler failed:', err.message);
}

// 6b. Real-time Chat Logic
try {
    const chatHandler = require('./socket/chatHandler');
    chatHandler(io);
    console.log('✅ Chat handler initialized');
} catch (err) {
    console.error('⚠️ Chat handler failed:', err.message);
}

// 7. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/career', require('./routes/career'));
app.use('/api/learning', require('./routes/learning'));

// Auto-seed Career Tracks
const seedCareerTracks = require('./seedCareer');
mongoose.connection.once('open', () => {
    try {
        seedCareerTracks();
    } catch (err) {
        console.error('⚠️ Career seeding failed:', err.message);
    }
});

app.use('/api/game', require('./routes/game'));
app.use('/api/instructor', require('./routes/instructor'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/support', require('./routes/support'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/reward', require('./routes/reward'));

const path = require('path');

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
// Express 5 compatible - use regex instead of *
app.get(/^\/(?!api|socket\.io).*/, (req, res) => {
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

