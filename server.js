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
app.use(express.static(path.join(__dirname, 'client/dist'), {
    maxAge: '1d',
    etag: true
}));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return next();
    }
    
    console.log('🔄 Catch-all route hit for:', req.path);
    const indexPath = path.resolve(__dirname, 'client', 'dist', 'index.html');
    console.log('📄 Attempting to serve index.html from:', indexPath);
    
    // Check if file exists
    const fs = require('fs');
    if (fs.existsSync(indexPath)) {
        console.log('✅ index.html found, serving...');
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error('❌ Error sending file:', err);
                res.status(500).send('Error loading application');
            }
        });
    } else {
        console.error('❌ index.html not found at:', indexPath);
        console.log('📂 Checking what files exist in client/dist:');
        try {
            const files = fs.readdirSync(path.join(__dirname, 'client', 'dist'));
            console.log('Files in dist:', files);
        } catch (e) {
            console.error('Cannot read dist directory:', e.message);
        }
        res.status(404).send('Frontend not found. Please check deployment.');
    }
});

// 8. Error Handling Middleware (Must be ABSOLUTE LAST)
app.use(errorHandler);

// 10. Start Unified Server with Port Collision Handling
console.log(`🚀 Starting server on port ${PORT}...`);
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server successfully started!`);
    console.log(`🚀 Unified Server + Multiplayer Arena running on port ${PORT}`);
    console.log(`🌐 Server is ready to accept connections`);
    console.log(`📍 Health check available at: http://0.0.0.0:${PORT}/health`);
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

