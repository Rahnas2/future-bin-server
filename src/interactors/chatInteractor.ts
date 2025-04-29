import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IMessageRepository } from "../interfaces/repositories/IMessageRepository";
import { IChatInteractor } from "../interfaces/interactors/IChatInteractor";
import { IMessageDocument } from "../interfaces/documents/IMessageDocument";
import { UserChatListDto } from "../dtos/UserChatListDto";
import { IChatRepository } from "../interfaces/repositories/IChatRepository";
import { notFound } from "../domain/errors";

@injectable()
export class chatInteractor implements IChatInteractor {
    constructor(@inject(INTERFACE_TYPE.messagRepository) private messagRepository: IMessageRepository,
        @inject(INTERFACE_TYPE.chatRepository) private chatRepository: IChatRepository) { }

    async getChatList(userId: string): Promise<UserChatListDto[]> {
        return this.chatRepository.findUserChatList(userId)
    }

    async sentMessage(senderId: string, receiverId: string, message: string) {

        await this.messagRepository.create({ senderId, receiverId, message })

    }

    async getMessagesBetweenTwoUser(userId1: string, userId2: string): Promise<IMessageDocument[]> {
        const chat = await this.chatRepository.findSingleChat(userId1, userId2)

        if(!chat) throw new notFound('chat not found')

        return this.messagRepository.getMessageHistory(chat._id.toString())
    }

    async getMessageHistory(chatId: string, receiverId: string): Promise<IMessageDocument[]> {
        await this.messagRepository.updateManay({chatId, receiverId}, {isRead: true})
        return this.messagRepository.getMessageHistory(chatId)
    }
}