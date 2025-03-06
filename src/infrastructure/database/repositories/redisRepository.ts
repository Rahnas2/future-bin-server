import redisClient from "../../config/redis";
import { injectable } from "inversify";

@injectable()
export class redisRepository {

    async set(key: string, value: any, ttl?: number){
        const serializedValue = JSON.stringify(value)
        if (ttl) {
            await redisClient.setEx(key, ttl, serializedValue)
        } else {
            await redisClient.set(key, serializedValue)
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
    }
    

    async update(key: string, updates: any) {
        const existingValue = await this.get(key);
        if (!existingValue) {
            throw new Error("Key does not exist");
        }

        const updatedValue = { ...existingValue, ...updates }
        await this.set(key, updatedValue)
    }

    async delete(key: string) {
        await redisClient.del(key);
    }
}