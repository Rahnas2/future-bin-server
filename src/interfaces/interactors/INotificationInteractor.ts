import { INotificationDocument } from "../documents/INotificationDocument";

export interface INotificationInteractor {

    fetchAllNotificationOfReceiver(receiverId: string): Promise<INotificationDocument []>

    deleteNotification(id: string): Promise<void>

}