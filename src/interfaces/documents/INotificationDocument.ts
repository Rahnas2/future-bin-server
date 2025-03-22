import { Document } from "mongoose";
import { Notification } from "../../domain/entities/notification";


export interface INotificationDocument extends Notification, Document { } 