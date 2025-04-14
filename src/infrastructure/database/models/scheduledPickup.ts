import  { Schema, model, Types } from "mongoose";
import { IScheduledPickupDocument } from "../../../interfaces/documents/IScheduledPickupDocument";

const scheduledPickupSchema = new Schema({
    pickupRequestId: {
        type: Types.ObjectId,
        ref: 'pickup_request',
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    completedAt: {
        type: Date,
        default: null
    }
})

const scheduledPickupModel = model<IScheduledPickupDocument>('scheduled_pickup', scheduledPickupSchema)

export default scheduledPickupModel