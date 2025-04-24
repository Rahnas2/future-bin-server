import { injectable } from "inversify";
import { ITransactionDocument } from "../../../interfaces/documents/ITransactionDocument";
import { ITransactionRepository } from "../../../interfaces/repositories/ITransactionReporisoty";
import { BaseRepository } from "./baseRepository";
import transactionModel from "../models/transaction";
import { DatabaseError } from "../../../domain/errors";
import { Types } from "mongoose";

@injectable()
export class transactionRepository extends BaseRepository<ITransactionDocument> implements ITransactionRepository {
    constructor() {
        super(transactionModel)
    }

    async findTotalEarnings(userId: string): Promise<{ totalEarnings: number }[]> {
        try {
            const result = await this.model.aggregate([
                {
                    $match: { userId: new Types.ObjectId(userId), type: 'credit', paymentStatus: 'succeeded' }
                },
                {
                    $group: {
                        _id: null,
                        totalEarnings: { $sum: '$amount' }
                    }
                }
            ]);
            return result
        } catch (error) {
            throw new DatabaseError(`data base error ${error}`);
        }
    }

    async findCollectorEarningsByPickupType(userId: string): Promise<{ _id: string; totalEarnings: number }[]> {
        try {
            const result = await this.model.aggregate([
                {
                    $match: { userId: new Types.ObjectId(userId), type: 'credit' }
                },
                {
                    $lookup: {
                        from: 'pickup_requests',
                        localField: 'pickupRequestId',
                        foreignField: '_id',
                        as: 'details'
                    }
                },
                { $unwind: '$details' },
                {
                    $group: {
                        _id: '$details.type',
                        totalEarnings: { $sum: '$amount' }
                    }
                }
            ]);

            return result
        } catch (error) {
            throw new DatabaseError(`data base error ${error}`);
        }
    }

    async findLatestCreditTransaction(userId: string): Promise<{ createdAt: Date } | null> {
        try {
            return await this.model.findOne({ userId: new Types.ObjectId(userId), type: 'credit', paymentStatus: 'succeeded' })
                .sort({ createdAt: -1 });
        } catch (error) {
            throw new DatabaseError(`findLatestCreditTransaction error ${error}`);
        }
    }


}