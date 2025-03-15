export interface ISocketRepository {
    getSocketId(_id: string): Promise<string | null>
}