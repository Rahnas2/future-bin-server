export interface IRedisRepository {
    set<T>(key: string, value: T, ttl?: number): Promise<void>;  
    get<T>(key: string): Promise<T | null>;                      
    update<T>(key: string, updates: Partial<T>): Promise<void>;  
    delete(key: string): void
}
