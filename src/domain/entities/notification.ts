export interface Notification {
    userId: string,
    message: string,
    clientSecret?: string
    requestId?: string
}