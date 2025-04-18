import { injectable } from "inversify";
import { BaseRepository } from "./baseRepository";
import { IMessageDocument } from "../../../interfaces/documents/IMessageDocument";
import { IMessageRepository } from "../../../interfaces/repositories/IMessageRepository";
import messageModel from "../models/message";
import { DatabaseError, notFound } from "../../../domain/errors";

@injectable()
export class messagRepository extends BaseRepository<IMessageDocument> implements IMessageRepository {
    constructor() {
        super(messageModel)
    }

    async getMessageHistory(chatId: string): Promise<IMessageDocument []> {
        try {
            const result = await this.model.find({ 
                chatId: chatId
             })

             if(!result) throw new notFound('not found messages')

            return result
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async deleteByChatId(chatId: string): Promise<{ acknowledged: boolean, deletedCount: number }> {
        try {
            return await this.model.deleteMany({chatId})
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }
}