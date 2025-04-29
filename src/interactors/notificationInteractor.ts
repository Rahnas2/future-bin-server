import { inject, injectable } from "inversify";

import { INTERFACE_TYPE } from "../utils/appConst";
import { INotificationRepository } from "../interfaces/repositories/INotificationRepository";
import { INotificationInteractor } from "../interfaces/interactors/INotificationInteractor";

@injectable()
export class notificationInteractor implements INotificationInteractor {
    constructor(@inject(INTERFACE_TYPE.notificationRepository) private notificationRepository: INotificationRepository) {}

    async fetchAllNotificationOfReceiver(receiverId: string){
        const result = await this.notificationRepository.updateManay({receiverId: receiverId}, {isRead: true})
        console.log('reult ', result)
        return this.notificationRepository.findByReceiverId(receiverId)
    }

    async deleteNotification(id: string): Promise<void> {
        await this.notificationRepository.deleteById(id)
    }
}