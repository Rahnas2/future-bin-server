import { Schema, model, Types } from "mongoose";
import { IMessageDocument } from "../../../interfaces/documents/IMessageDocument";

const messageSchema = new Schema({
    chatId: {
        type: Types.ObjectId,
        ref: 'chatModel'
    },
    senderId: {
        type: Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    receiverId: {
        type: Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    message: { 
        type: String, 
        required: true 
    },
    isImage: {
        type: Boolean,
        default: false
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

const messageModel = model<IMessageDocument>('message', messageSchema);

export default messageModel