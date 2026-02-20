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

// 2. Validate Environment Variables
const validateEnv = require('./utils/validateEnv');
validateEnv();

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
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
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

// 8. Error Handling Middleware (Must be last)
app.use(errorHandler);

const path = require('path');

// 9. Serve Frontend (Monolithic Deployment)
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/dist')));

// Health Check
app.get('/health', (req, res) => res.status(200).json({
    status: 'active',
    services: ['api', 'sockets'],
    timestamp: new Date()
}));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
});

// 10. Start Unified Server with Port Collision Handling
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Unified Server + Multiplayer Arena running on port ${PORT}`);
    console.log(`✅ Server is ready to accept connections`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ FATAL ERROR: Port ${PORT} is already in use.`);
        console.error(`💡 SOLUTION: Check for duplicate processes or run 'npm run kill-server' (if available).`);
    } else {
        console.error("❌ server failed to start:", err);
    }
    process.exit(1);
});

