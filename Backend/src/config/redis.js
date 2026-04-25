const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

let redis = null;
let redisErrorLogged = false;

const connectRedis = () => {
  try {
    if (!process.env.REDIS_URL) {
      if (!redisErrorLogged) {
        console.log('⚠️ Redis URL not configured - Redis disabled');
        redisErrorLogged = true;
      }
      return null;
    }
    
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryStrategy: (times) => {
        if (times > 3) {
          if (!redisErrorLogged) {
            console.log('⚠️ Redis connection failed - continuing without Redis caching');
            redisErrorLogged = true;
          }
          return null;
        }
        return Math.min(times * 100, 3000);
      },
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true
    });
    
    redis.on('error', (err) => {
      if (!redisErrorLogged) {
        console.log('⚠️ Redis Error (caching disabled):', err.message);
        redisErrorLogged = true;
      }
    });
    
    redis.on('connect', () => {
      console.log('✅ Redis Connected');
    });
    
    return redis;
  } catch (error) {
    if (!redisErrorLogged) {
      console.log('⚠️ Redis Error - continuing without Redis:', error.message);
      redisErrorLogged = true;
    }
    return null;
  }
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };