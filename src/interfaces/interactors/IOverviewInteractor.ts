import { unreadCountsDto } from "../../dtos/unreadCountsDto";

export interface IOverviewInteractor {
    getUnreadCounts(userId: string): Promise<unreadCountsDto>
}