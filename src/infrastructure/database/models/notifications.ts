import  { Schema, model, Types } from "mongoose";
import { INotificationDocument } from "../../../interfaces/documents/INotificationDocument";
import { notificationTypesArr } from "../../../dtos/notificationTypeDto";

const notificationSchema = new Schema({
    receiverId: {
        type: Types.ObjectId,
        ref: 'users',
        required: true
    },
    type: {
        type: String,
        enum: notificationTypesArr,
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
    requestId: {
        type: Types.ObjectId,
        ref: 'pickup_request'
    }
}, {timestamps: true}) 

const notificationModel = model<INotificationDocument>('notification', notificationSchema)

export default notificationModel