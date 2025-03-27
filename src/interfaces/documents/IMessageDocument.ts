import { Document } from "mongoose";
import { Message } from "../../domain/entities/message";

export interface IMessageDocument extends Message, Document {
    _id: string
}