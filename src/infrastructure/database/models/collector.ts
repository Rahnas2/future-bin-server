import  { Schema, model, Types } from "mongoose";

import { ICollectorDocument } from "../../../interfaces/documents/ICollectorDocument";

const collectorSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: "userModel", 
            required: true,
        },
        idCard: {
            front: {
                type: String,
                required: true,
            },
            back: {
                type: String,
                required: true,
            },
        },
        vehicleDetails: {
            model: {
                type: String,
                required: true,
            },
            licensePlate: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
        },
        approvalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"], 
            default: "pending",
        },
        status: {
            type: String,
            enum: ["active", "in-active"],
            default: "in-active",
        },
        stripeAccountId: {
            type: String,
            default: null,
        },
        isStripeEnabled: {
            type: Boolean, 
            default: false
        }
    },
    {
        timestamps: true, 
    }
);


const collectorModel = model<ICollectorDocument>('collector', collectorSchema)
export default collectorModel

