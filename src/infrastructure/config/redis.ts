import { createClient } from 'redis'

const redisClient = createClient()


redisClient.on('error', err => console.log('Redis Client Error', err));

(async () => {
    await redisClient.connect();
    console.log('Connected to Redis');
})();

export default redisClient