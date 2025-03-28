import { Schema, model } from "mongoose";
import { IPickupeRequestDocument } from "../../../interfaces/documents/IPickupRequestDocument";
const { ObjectId } = Schema.Types;

const pickupRequestSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: "users",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["on-demand", "subscription"],
        required: true
    },
    wasteTypes: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 1
        },
        weight: {
            type: Number,
            default: 1,
            min: 1
        }
    }],
    status: {
        type: String,
        enum: ["pending", "accepted", "completed", "cancelled"],
        default: 'pending'
    },
    address: {
        street: {
            type: String, required: true
        },
        houseNo: {
            type: String, required: true
        },
        district: {
            type: String, required: true
        },
        city: {
            type: String, required: true
        },
        pincode: {
            type: Number, required: true
        },
        location: {
            type: { type: String, default: 'Point', required: true },
            coordinates: { type: [Number], required: true },
        },
    },
    collectorId: {
        type: ObjectId,
        ref: "collectors",
        default: null
    },
    collectorName: {
        type: String,
        default: null
    },
    weight: {
        type: Number
    },
    price: {
        type: Number
    },
    subscriptionPlanId: {
        type: ObjectId,
        ref: "subscriptions"
    },
    subscriptionPlanName: {
        type: String,
    },
    paymentStatus: {
        type: String,
        default: 'pending'
    },
    assignedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true })

pickupRequestSchema.index({ 'address.location': '2dsphere' })

const pickupRequestModel = model<IPickupeRequestDocument>("pickup_request", pickupRequestSchema)

export default pickupRequestModel