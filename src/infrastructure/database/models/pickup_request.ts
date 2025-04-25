import { Schema, Types, model } from "mongoose";
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
    email: {
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
        enum: ["pending", "accepted", "confirmed", "completed", "cancelled"],
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
    cancellation: {
        cancelledBy: {
            type: String,
            enum: ["user", "collector"],
        },
        reason: {
            type: String
        },
        description: {
            type: String
        },
        proof: {
            type: String
        },
    },
    refund: {
        refunded: {
            type: Boolean,
            default: false
        },
        refundedAmount: {
            type: Number,
            default: 0
        },
        refundId: {
            type: String
        },
        refundedAt: {
            type: Date
        }
    },
    totalWeight: {
        type: Number
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    paymentIntentId: {
        type: String
    },
    subscription: {
        planId: {
            type: Types.ObjectId
        },
        name: {
            type: String
        },
        features: {
            type: [String]
        },
        totalPickups: {
            type: Number
        },
        completedPickups: {
            type: Number
        },
        frequency: {
            type: String
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        }
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