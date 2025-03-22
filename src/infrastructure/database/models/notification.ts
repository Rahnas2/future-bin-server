import  { Schema, model, Types } from "mongoose";
import { INotificationDocument } from "../../../interfaces/documents/INotificationDocument";

const notificationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    clientSecret: {
        type: String,
    }
}) 

const notificationModel = model<INotificationDocument>('notification', notificationSchema)

export default notificationModel