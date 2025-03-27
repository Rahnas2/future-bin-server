import { injectable } from "inversify";
import { DatabaseError, notFound } from "../../../domain/errors";
import { UserChatListDto } from "../../../dtos/UserChatListDto";
import { IChatDocument } from "../../../interfaces/documents/IChatDocument";
import { IBaseRepository } from "../../../interfaces/repositories/IBaseRepository";
import { IChatRepository } from "../../../interfaces/repositories/IChatRepository";
import chatModel from "../models/chat";
import { BaseRepository } from "./baseRepository";
import { IUser } from "../../../domain/entities/user";

@injectable()
export class chatRepository extends BaseRepository<IChatDocument> implements IChatRepository {

    constructor() {
        super(chatModel)
    }

    async findUserChatList(userId: string): Promise<UserChatListDto[]> {
        try {

            console.log('star finding ')
            // Fetch all conversations involving the current user
            const chatList = await this.model.find({ participants: userId })
                .populate({
                    path: 'participants',
                    select: 'firstName lastName image', // Exclude _id from populated users
                })
                .sort({ updatedAt: -1 })
                .lean();

            console.log('chat list ', JSON.stringify(chatList, null, 2))

            return chatList.map(chat => {
                const otherParticipant = (chat.participants as any[]).find(
                    p => p._id.toString() !== userId
                );
                console.log('other participants ', otherParticipant)
                return {
                    _id: chat._id.toString(),
                    lastMessage: {
                        message: chat.lastMessage.message,
                        senderId: chat.lastMessage.senderId.toString()
                    },
                    participanId: otherParticipant._id,
                    firstName: otherParticipant.firstName,
                    lastName: otherParticipant.lastName,
                    image: otherParticipant.image || ""
                };
            });

        } catch (error) {
            throw new DatabaseError(`data base error here -> ${error}`)
        }
    }

    async findSingleChat(userId: string, receiverId: string): Promise<IChatDocument | null> {
        try {
            const chat = await this.model.findOne({ participants: { $all: [userId, receiverId] } })
            // if(!chat){
            //     throw new notFound('chat not found')
            // } 

            return chat
        } catch (error) {
            throw new DatabaseError(`data base error find sinle chat ${error}`)
        }
    }

    async findSingleChatInDetail(chatId: string, currentUserId: string): Promise<UserChatListDto> {
        try {
            const chat = await this.model.findById(chatId)
                .populate({
                    path: 'participants',
                    select: 'firstName lastName image',
                })

                if(!chat) throw new notFound('chat not found')


                const otherParticipant = (chat.participants as any[]).find(p => p._id.toString() !== currentUserId)
                console.log('other participant in single chat ', otherParticipant)
                return {
                    _id: chat._id.toString(),
                    lastMessage: {
                        message: chat.lastMessage.message,
                        senderId: chat.lastMessage.senderId.toString()
                    },
                    participanId: otherParticipant._id,
                    firstName: otherParticipant.firstName,
                    lastName: otherParticipant.lastName,
                    image: otherParticipant.image || ""
                };

        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }
}