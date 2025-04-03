import { Chat } from "../domain/entities/chat";
import { IChatDocument } from "../interfaces/documents/IChatDocument";

export interface UserChatListDto {
    _id: string,
    lastMessage: {
        message: string,
        senderId: string,
        isImage: boolean
    }
    participanId: string,
    firstName: string,
    lastName: string,
    image: string
}  