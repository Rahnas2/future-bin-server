
import { Schema, model } from "mongoose";
import { Subscription } from "../../../domain/entities/subscription";
import { ISubscriptionDocument } from "../../../interfaces/documents/ISubscriptionDocument";

const subscriptionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    features: {
        type: [String],
        required: true
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    totalPickups: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const subscriptionModel = model<ISubscriptionDocument>('subscription', subscriptionSchema)

export default subscriptionModel