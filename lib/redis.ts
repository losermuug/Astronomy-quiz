import Redis from 'ioredis';

// Redis client үүсгэх
const redis = new Redis(process.env.REDIS_URL || '', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Redis холбогдсон эсэхийг шалгах
redis.on('connect', () => {
  console.log('✅ Redis холбогдлоо');
});

redis.on('error', (err) => {
  console.error('❌ Redis алдаа:', err);
});

export default redis;

