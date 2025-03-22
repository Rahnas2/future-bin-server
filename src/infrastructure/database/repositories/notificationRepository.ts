import { injectable } from "inversify";
import notificationModel from "../models/notification";
import { BaseRepository } from "./baseRepository";
import { INotificationDocument } from "../../../interfaces/documents/INotificationDocument";
import { INotificationRepository } from "../../../interfaces/repositories/INotificationRepository";

@injectable()
export class notificationRepository extends BaseRepository<INotificationDocument> implements INotificationRepository {
    constructor(){
        super(notificationModel)
    }
}