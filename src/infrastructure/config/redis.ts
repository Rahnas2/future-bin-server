import { createClient } from 'redis'

const redisClient = createClient({url: process.env.REDIS_URL})


redisClient.on('error', err => console.log('Redis Connection Error', err));

(async () => {
    await redisClient.connect();
    console.log('Connected to Redis');
})();

export default redisClient   