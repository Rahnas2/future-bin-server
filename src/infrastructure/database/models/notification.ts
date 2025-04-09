import  { Schema, model, Types } from "mongoose";
import { INotificationDocument } from "../../../interfaces/documents/INotificationDocument";

const notificationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    clientSecret: {
        type: String,
    },
    requestId: {
        type: Types.ObjectId,
        ref: 'pickup_request'
    }
}) 

const notificationModel = model<INotificationDocument>('notification', notificationSchema)

export default notificationModel