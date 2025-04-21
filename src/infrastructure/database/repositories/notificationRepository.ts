import { injectable } from "inversify";
import { BaseRepository } from "./baseRepository";
import { INotificationDocument } from "../../../interfaces/documents/INotificationDocument";
import { INotificationRepository } from "../../../interfaces/repositories/INotificationRepository";
import notificationModel from "../models/notifications";

@injectable()
export class notificationRepository extends BaseRepository<INotificationDocument> implements INotificationRepository {
    constructor(){
        super(notificationModel)
    }
}