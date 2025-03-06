import  { Schema, model, ObjectId } from "mongoose";

import { ICollector } from "../../../domain/entities/collector";

const { ObjectId } = Schema.Types;


const collectorSchema = new Schema<ICollector>(
    {
        userId: {
            type: ObjectId,
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
            enum: ["active", "inactive"],
            default: "active",
        },
        wallet: {
            balance: {
                type: Number,
                default: 0,
            },
            transactions: [
                {
                    amount: {
                        type: Number,
                        required: true,
                    },
                    type: {
                        type: String,
                        enum: ["credit", "debit"],
                        required: true,
                    },
                    discription: {
                        type: String
                    },
                    date: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
        },
    },
    {
        timestamps: true, 
    }
);


const collectorModel = model<ICollector>('collector', collectorSchema)
export default collectorModel

