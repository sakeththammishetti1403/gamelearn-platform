const Redis = require('ioredis');

// Setup Redis Client
// Replace with environment variables in production
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});

module.exports = redis;
