import mongoose, { DeleteResult } from "mongoose";
import { BaseRepository } from "../../infrastructure/database/repositories/baseRepository";
import { INotificationDocument } from "../documents/INotificationDocument";


export interface INotificationRepository extends BaseRepository<INotificationDocument> {
    findByReceiverId(receiverId: string): Promise<INotificationDocument []>

    deleteByRequestId(requestId: string): Promise<DeleteResult>
}