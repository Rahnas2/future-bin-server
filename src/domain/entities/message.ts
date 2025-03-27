export interface Message {
    chatId: string,
    senderId: string,
    receiverId: string, 
    message: string,
    isImage: boolean
}