import { UserChatListDto } from "../../dtos/UserChatListDto";
import { IChatDocument } from "../documents/IChatDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface IChatRepository extends IBaseRepository<IChatDocument> {
    findUserChatList(userId: string): Promise<UserChatListDto []>
    findSingleChat(userId: string, receiverId: string): Promise<IChatDocument | null>
    findSingleChatInDetail(chatId: string, currentUserId: string): Promise<UserChatListDto>
}