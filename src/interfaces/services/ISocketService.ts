export interface ISocketService {
    sentNotification(id: string, event: string, data: any) : Promise<void>
}