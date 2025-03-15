
import { Schema, model } from "mongoose";
import { Subscription } from "../../../domain/entities/subscription";

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
    }
}, { timestamps: true })

const subscriptionModel = model<Subscription>('subscription', subscriptionSchema)

export default subscriptionModel