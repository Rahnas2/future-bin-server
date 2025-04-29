import { Document } from "mongoose";
import { scheduledPickup } from "../../domain/entities/scheduledPickup";

export interface IScheduledPickupDocument extends scheduledPickup, Document {
    _id: string
}