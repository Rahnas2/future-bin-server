import { Document, Types } from "mongoose";
import { Chat } from "../../domain/entities/chat";

export interface IChatDocument extends Chat, Document {
    _id: Types.ObjectId
}