import { BaseRepository } from "../../infrastructure/database/repositories/baseRepository";
import { INotificationDocument } from "../documents/INotificationDocument";


export interface INotificationRepository extends BaseRepository<INotificationDocument> {}