import { injectable } from "inversify";
import { ITransactionDocument } from "../../../interfaces/documents/ITransactionDocument";
import { ITransactionRepository } from "../../../interfaces/repositories/ITransactionReporisoty";
import { BaseRepository } from "./baseRepository";
import transactionModel from "../models/transaction";
import { DatabaseError } from "../../../domain/errors";
import { Types } from "mongoose";
import { revenueSummaryDto } from "../../../dtos/RevenueSummaryDto";
import { transactionAnalyticsDto } from "../../../dtos/transactionAnalyticsDto";

@injectable()
export class transactionRepository extends BaseRepository<ITransactionDocument> implements ITransactionRepository {
    constructor() {
        super(transactionModel)
    }


    async findTransactionsByUserId(userId: string, page: number, limit: number): Promise<ITransactionDocument []> {
        try {
            const skip = (page - 1) * limit
            const result  = await this.model.find({userId}).skip(skip).limit(limit).sort({createdAt: -1})
            return result
        } catch (error) {
            throw new DatabaseError('data base error ')
        }
    }

    async findSummary(): Promise<revenueSummaryDto[]> {
        try {
            const result = await this.model.aggregate([
                {
                    $match: { paymentStatus: 'succeeded' }
                },
                {
                    $group: {
                        _id: '$type',
                        total: { $sum: '$amount' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        type: '$_id',
                        total: 1
                    }
                }
            ])
            console.log('reult ', result)
            return result
        } catch (error) {
            throw new DatabaseError(`data base error ${error}`);
        }
    }

    async findSummaryByTypeBetweenDates(type: 'credited' | 'refunded' | 'transfered', from: Date, to: Date) {
        const result = await this.model.aggregate([
            {
                $match: { type: type, paymentStatus: 'succeeded', createdAt: { $gte: from, $lte: to } }
            },
            {
                $group: {
                    _id: '$createdAt',
                    total: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: '$createdAt',
                    total: 1
                }
            }
        ])
    }

    async findTotalEarningsForCollector(collectorId: string): Promise<{ totalEarnings: number }[]> {
        try {
            const result = await this.model.aggregate([
                {
                    $match: { userId: new Types.ObjectId(collectorId), type: 'transfered', paymentStatus: 'succeeded' }
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
                    $match: { userId: new Types.ObjectId(userId), type: 'transfered' }
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

    async findLatestTransfer(collectorId: string): Promise<{ createdAt: Date } | null> {
        try {
            return await this.model.findOne({ userId: new Types.ObjectId(collectorId), type: 'transfered', paymentStatus: 'succeeded' })
                .sort({ createdAt: -1 });
        } catch (error) {
            throw new DatabaseError(`findLatestCreditTransaction error ${error}`);
        }
    }

    async yearWiseFilerByType(type: string, startYear: number, currentYear: number): Promise<transactionAnalyticsDto []> {
        try {
            const result = await transactionModel.aggregate([
                {
                    $match: {
                        type: type,
                        paymentStatus: 'succeeded',
                        createdAt: {
                            $gte: new Date(`${startYear}-01-01`),
                            $lte: new Date(`${currentYear}-12-31`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $year: "$createdAt" },
                        total: { $sum: "$amount" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        x: '$_id',
                        y: '$total'
                    }
                },
                { $sort: { "x": 1 } }
            ]);
            return result
        } catch (error) {
            throw new DatabaseError(`findLatestCreditTransaction error ${error}`);
        }
    }

    async monthlyFilterByType(type: string, currentYear: number): Promise<transactionAnalyticsDto []> {
        try {
            const result = await transactionModel.aggregate([
                {
                    $match: {
                        type: type,
                        paymentStatus: 'succeeded',
                        createdAt: {
                            $gte: new Date(`${currentYear}-01-01`),
                            $lte: new Date(`${currentYear}-12-31`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        total: { $sum: "$amount" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        x: '$_id',
                        y: '$total'
                    }
                },
                { $sort: { "x": 1 } }
            ]);
            return result
        } catch (error) {
            throw new DatabaseError(`findLatestCreditTransaction error ${error}`);
        }
    }

    async filterByCustomDatesAndType(type: string, startDate: Date, endDate: Date): Promise<transactionAnalyticsDto []> {
        try {
            const result = await transactionModel.aggregate([
                {
                    $match: {
                        type: type,
                        paymentStatus: 'succeeded',
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            day: { $dayOfMonth: "$createdAt" }
                        },
                        total: { $sum: "$amount" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        x: {
                            $concat: [
                              { $toString: '$_id.year' }, '-',
                              { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] }, '-',
                              { $cond: [{ $lt: ['$_id.day', 10] }, { $concat: ['0', { $toString: '$_id.day' }] }, { $toString: '$_id.day' }] }
                            ]
                          },
                        y: '$total'
                    }
                },
                { $sort: { "x": 1 } }
            ]);
            return result
        } catch (error) {
            throw new DatabaseError(`findLatestCreditTransaction error ${error}`);
        }
    }

}