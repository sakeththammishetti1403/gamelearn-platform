const Redis = require('ioredis');

let redisClient = null;

if (process.env.REDIS_URL) {
    console.log('🔌 [CACHE] Initializing Redis connection...');
    redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
            if (times > 3) {
                console.warn('⚠️ [CACHE] Redis connection failed, disabling cache.');
                return null;
            }
            return Math.min(times * 50, 2000);
        }
    });

    redisClient.on('error', (err) => {
        // Suppress initial connection errors to avoid crashing logic if redis is optional
        console.warn('⚠️ [CACHE] Redis error:', err.message);
    });

    redisClient.on('connect', () => {
        console.log('✅ [CACHE] Redis connected');
    });
} else {
    console.log('ℹ️ [CACHE] No REDIS_URL provided. Caching disabled.');
}

const cacheService = {
    get: async (key) => {
        if (!redisClient || redisClient.status !== 'ready') return null;
        try {
            const data = await redisClient.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn(`[CACHE] Get error for ${key}:`, error.message);
            return null;
        }
    },

    set: async (key, value, ttlSeconds = 300) => {
        if (!redisClient || redisClient.status !== 'ready') return;
        try {
            await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
        } catch (error) {
            console.warn(`[CACHE] Set error for ${key}:`, error.message);
        }
    },

    del: async (key) => {
        if (!redisClient || redisClient.status !== 'ready') return;
        try {
            await redisClient.del(key);
        } catch (error) {
            console.warn(`[CACHE] Del error for ${key}:`, error.message);
        }
    },

    flush: async () => {
        if (!redisClient || redisClient.status !== 'ready') return;
        try {
            await redisClient.flushall();
            console.log('🧹 [CACHE] Flushed all keys');
        } catch (error) {
            console.warn('[CACHE] Flush error:', error.message);
        }
    }
};

module.exports = cacheService;
