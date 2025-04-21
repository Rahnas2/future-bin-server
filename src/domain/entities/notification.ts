import { notificationTypesDto } from "../../dtos/notificationTypeDto"

export interface Notification {
    receiverId: string,
    type: notificationTypesDto,
    message: string,
    isRead: boolean
    linkUrl?: string
    requestId?: string
}