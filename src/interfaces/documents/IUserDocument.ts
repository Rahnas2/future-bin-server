import { Document } from "mongoose";
import { IUser } from "../../domain/entities/user";

export interface IUserDocument extends IUser, Document {
    _id: string
} 