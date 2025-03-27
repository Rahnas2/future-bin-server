import { Schema, model, Types } from "mongoose";
import { IChatDocument } from "../../../interfaces/documents/IChatDocument";

const chatSchema = new Schema({
    participants: [{
        type: Types.ObjectId, 
        ref: 'user'
    }],
    lastMessage: {
        message: {
            type: String,
            required: true
        },
        isImage: {
            type: Boolean,
            required: true
        },
        senderId: {
            type: Types.ObjectId,
            ref: 'user',
            required: true,
        }
    }
}, { timestamps: true })

const chatModel = model<IChatDocument>('chat', chatSchema)

export default chatModel