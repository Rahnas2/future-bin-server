import { injectable } from "inversify";
import { IReviewDocument } from "../../../interfaces/documents/IReviewDocument";
import { BaseRepository } from "./baseRepository";
import reviewModel from "../models/review";
import { IReveiwRepository } from "../../../interfaces/repositories/IReviewRepository";
import { DatabaseError } from "../../../domain/errors";
import { IUserDocument } from "../../../interfaces/documents/IUserDocument";
import { Types } from "mongoose";

@injectable()

export class reveiwRepository extends BaseRepository<IReviewDocument> implements IReveiwRepository {

    constructor() {
        super(reviewModel)
    }

    async userHasReviewedCollector(userId: string, collectorId: string): Promise<IReviewDocument | null> {
        try {
            const review = this.model.findOne({ userId, collectorId, type: 'collector' })
            return review
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async findAllAppReviewsWithUserDetails(lastId: string, limit: number): Promise<{ reviewDocument: IReviewDocument; userDocument: Partial<IUserDocument> }[]> {
        try {

            const matchStage: any = {
                type: 'app'
            };

            if (lastId.trim()) {
                matchStage._id = { $lt: new Types.ObjectId(lastId) };
            }
            console.log('match stange here ', matchStage)
            const reviews = await this.model.aggregate([
                {
                    $match: matchStage 
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',   
                        as: 'userDoc'
                    }
                },
                {
                    $unwind: '$userDoc'
                },
                {
                    $sort: { _id: -1 }
                },
                {
                    $limit: limit
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        type: 1,
                        rating: 1,
                        comment: 1,
                        createdAt: 1,
                        user: {
                            firstName: '$userDoc.firstName',
                            lastName: '$userDoc.lastName',
                            image: '$userDoc.image'
                        }
                    }
                }
            ]);
            console.log('reviews from repository ', reviews)
            return reviews;
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async findOneByUserIdAndTypeApp(userId: string): Promise<IReviewDocument | null> {
        try {
            const review = this.model.findOne({ userId, type: 'app' })
            return review
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async findByUserIdAndTypeCollector(userId: string, lastId: string, limit: number): Promise<{ reviewDocument: IReviewDocument; userDocument: Partial<IUserDocument> }[]> {
        try {
            const matchStage: any = {
                userId: new Types.ObjectId(userId),
                type: 'collector'
            };

            if (lastId.trim()) {
                matchStage._id = { $lt: new Types.ObjectId(lastId) };
            }

            const reviews = await this.model.aggregate([
                {
                    $match: matchStage 
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'collectorId',
                        foreignField: '_id',
                        as: 'userDoc'
                    }
                },
                {
                    $unwind: '$userDoc'
                },
                {
                    $sort: { _id: -1 }
                },
                {
                    $limit: limit
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        type: 1,
                        rating: 1,
                        comment: 1,
                        createdAt: 1,
                        user: {
                            firstName: '$userDoc.firstName',
                            lastName: '$userDoc.lastName',
                            image: '$userDoc.image'
                        }
                    }
                }
            ])
            return reviews
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async findByCollectorId(collectorId: string, lastId: string, limit: number): Promise<{ reviewDocument: IReviewDocument; userDocument: Partial<IUserDocument> }[]> {
        try {
            const matchStage: any = {
                collectorId: new Types.ObjectId(collectorId)
            };

            if (lastId.trim()) {
                matchStage._id = { $lt: new Types.ObjectId(lastId) };
            }

            const reviews = await this.model.aggregate([
                {
                    $match: matchStage 
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDoc'
                    }
                },
                {
                    $unwind: '$userDoc'
                },
                {
                    $sort: { _id: -1 }
                },
                {
                    $limit: limit
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        type: 1,
                        rating: 1,
                        comment: 1,
                        createdAt: 1,
                        user: {
                            firstName: '$userDoc.firstName',
                            lastName: '$userDoc.lastName',
                            image: '$userDoc.image'
                        }
                    }
                }
            ])
            return reviews
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }
}