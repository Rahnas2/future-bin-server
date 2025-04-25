import { Schema, Model, Types, model  } from "mongoose";
import { StringDecoder } from "string_decoder";
import { ITransactionDocument } from "../../../interfaces/documents/ITransactionDocument";

const transactionSchema = new Schema ({
    paymentId: {
        type: String
    },
    pickupRequestId: {
        type: Types.ObjectId,
        ref: 'pickup_requests',
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        ref: 'users',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String
    }, 
    type: {
        type: String,
        enum: ['credited', 'refunded', 'transfered']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'succeeded', 'failed'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
}) 

const transactionModel = model<ITransactionDocument>('transaction', transactionSchema)

export default transactionModel