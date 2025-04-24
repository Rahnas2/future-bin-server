import { injectable } from "inversify";
import { BaseRepository } from "./baseRepository";
import { INotificationDocument } from "../../../interfaces/documents/INotificationDocument";
import { INotificationRepository } from "../../../interfaces/repositories/INotificationRepository";
import notificationModel from "../models/notifications";
import { DatabaseError } from "../../../domain/errors";
import { DeleteResult } from "mongoose";
import { request } from "http";

@injectable()
export class notificationRepository extends BaseRepository<INotificationDocument> implements INotificationRepository {
    constructor(){
        super(notificationModel)
    }

    async findByReceiverId(receiverId: string): Promise<INotificationDocument[]> {
        try {
            return await this.model.find({receiverId}).sort({createdAt: -1})
        } catch (error) {
            throw new DatabaseError('data base error ')
        }
    }

    async deleteByRequestId(requestId: string): Promise<DeleteResult> {
        try {
            return await this.model.deleteOne({requestId})
        } catch (error) {
            throw new DatabaseError('data base error ')
        }
    }
}