import { IMessageDocument } from "../documents/IMessageDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface IMessageRepository extends IBaseRepository<IMessageDocument> {

    getMessageHistory(chatId: string): Promise<IMessageDocument []>
    deleteByChatId(chatId: string): Promise<{ acknowledged: boolean, deletedCount: number }>
}