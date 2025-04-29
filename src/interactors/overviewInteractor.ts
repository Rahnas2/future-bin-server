import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils/appConst";
import { INotificationRepository } from "../interfaces/repositories/INotificationRepository";
import { IOverviewInteractor } from "../interfaces/interactors/IOverviewInteractor";
import { unreadCountsDto } from "../dtos/unreadCountsDto";
import { IMessageRepository } from "../interfaces/repositories/IMessageRepository";

@injectable()

export class overviewInteractor implements IOverviewInteractor {
    constructor(@inject(INTERFACE_TYPE.notificationRepository) private notificationRepository: INotificationRepository,
        @inject(INTERFACE_TYPE.messagRepository) private messagRepository: IMessageRepository) { }

    async getUnreadCounts(userId: string): Promise<unreadCountsDto> {
        const [unreadNotifications, unreadChats] = await Promise.all([
            this.notificationRepository.countFilterDocument({ receiverId: userId, isRead: false }),
            this.messagRepository.countUnreadChats(userId)
        ])


        return {
            unreadNotifications,
            unreadChats
        }
    }
}