import { UserChatListDto } from "../../dtos/UserChatListDto";
import { IMessageDocument } from "../documents/IMessageDocument";

export interface IChatInteractor {
    getChatList(userId: string): Promise<UserChatListDto []>
    sentMessage(senderId: string, receiverId: string, message: string): Promise<void>
    getMessageHistory(chatId: string): Promise<IMessageDocument []>
    getMessagesBetweenTwoUser(userId1: string, userId2: string): Promise<IMessageDocument []>
}