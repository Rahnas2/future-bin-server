export interface Notification {
    userId: string,
    type: string
    message: string,
    isRead: boolean
    clientSecret?: string
    requestId?: string
}