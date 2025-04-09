import { injectable } from "inversify";
import { IReviewDocument } from "../../../interfaces/documents/IReviewDocument";
import { BaseRepository } from "./baseRepository";
import reviewModel from "../models/review";
import { IReveiwRepository } from "../../../interfaces/repositories/IReviewRepository";
import { DatabaseError } from "../../../domain/errors";

@injectable()

export class reveiwRepository extends BaseRepository<IReviewDocument> implements IReveiwRepository {

    constructor() {
        super(reviewModel)
    }

    async userHasReviewedCollector(userId: string, collectorId: string): Promise<IReviewDocument | null> {
        try {
            const review = this.model.findOne({userId, collectorId, type: 'collector'})
            return review
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async findOneByUserIdAndTypeApp(userId: string): Promise<IReviewDocument | null> {
        try {
            const review = this.model.findOne({userId, type: 'app'})
            return review
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async findByUserIdAndTypeCollector(userId: string): Promise<IReviewDocument[]> {
        try {
            const reviews = this.model.find({userId, type: 'collector'})
            return reviews
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    } 

    async findByCollectorId(collectorId: string): Promise<IReviewDocument[]> {
        try {
            const reviews = this.model.find({collectorId})
            return reviews
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }
}