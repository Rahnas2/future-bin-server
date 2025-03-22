import { INotificationDocument } from "../documents/INotificationDocument";

export interface INotificationInteractor {

    fetchAllNotificationOfUser(userId: string): Promise<INotificationDocument []>
    deleteNotification(id: string): Promise<void>

}