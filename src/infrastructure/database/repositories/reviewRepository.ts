import { injectable } from "inversify";
import { IReviewDocument } from "../../../interfaces/documents/IReviewDocument";
import { BaseRepository } from "./baseRepository";
import reviewModel from "../models/review";
import { IReveiwRepository } from "../../../interfaces/repositories/IReviewRepository";
import { DatabaseError } from "../../../domain/errors";
import { IUserDocument } from "../../../interfaces/documents/IUserDocument";

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

    async findAllAppReviewsWithUserDetails(): Promise<{ reviewDocument: IReviewDocument; userDocument: Partial<IUserDocument> }[]> {
        try {
            const reviews = await this.model.aggregate([
                {
                    $match: {
                        type: 'app'
                    }
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

    async findByUserIdAndTypeCollector(userId: string): Promise<IReviewDocument[]> {
        try {
            const reviews = this.model.find({ userId, type: 'collector' })
            return reviews
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async findByCollectorId(collectorId: string): Promise<IReviewDocument[]> {
        try {
            const reviews = this.model.find({ collectorId })
            return reviews
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }
}