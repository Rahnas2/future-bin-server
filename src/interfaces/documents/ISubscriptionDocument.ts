import { Document } from "mongoose";
import { IUser } from "../../domain/entities/user";
import { Subscription } from "../../domain/entities/subscription";

export interface ISubscriptionDocument extends Subscription, Document {
    _id: string
} 