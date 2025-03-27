import { Types } from "mongoose"

export interface Chat {
    participants: Types.ObjectId []
    lastMessage: {
        message: string,
        senderId: string,
        isImage: boolean
    }
}