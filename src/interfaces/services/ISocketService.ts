export interface ISocketService {
    sentNotification(_id: string, event: string, data: any) : Promise<void>
}