import { inject, injectable } from "inversify";
import { IReveiwInteractor } from "../interfaces/interactors/IReviewInteractor";
import { Review } from "../domain/entities/review";
import { IReviewDocument } from "../interfaces/documents/IReviewDocument";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IReveiwRepository } from "../interfaces/repositories/IReviewRepository";
import { conflictError } from "../domain/errors";
import { IUserDocument } from "../interfaces/documents/IUserDocument";

@injectable()

export class reviewInteractor implements IReveiwInteractor{

    constructor(@inject(INTERFACE_TYPE.reveiwRepository) private reveiwRepository: IReveiwRepository){}
    async addReview(data: Review): Promise<IReviewDocument> {

        if(data.type === 'collector') {
            const existingCollectorReview = await this.reveiwRepository.userHasReviewedCollector(data.userId, data.collectorId as string)

            if(existingCollectorReview){
                throw new conflictError('you are already added subscriptin for this collector')
            }
        }else {
            const existingAppReview = await this.reveiwRepository.findOneByUserIdAndTypeApp(data.userId)
            if(existingAppReview){
                throw new conflictError('more than one review about us is not possible for single user')
            }
        }

        
        return await this.reveiwRepository.create(data)
    }

    async updateReview(id: string, data: Partial<IReviewDocument>): Promise<IReviewDocument> {
        return this.reveiwRepository.findByIdAndUpdate(id, data)
    }

    async getAllReviews(page: number, limit: number): Promise<{reviews: IReviewDocument[], total: number}> {
        const reviews =  await this.reveiwRepository.findAll(page, limit)
        const total = await this.reveiwRepository.totalDocumentCount()
        return { reviews, total }
    }

    async getUserReviewAboutApp(userId: string): Promise<IReviewDocument | null> {
        return this.reveiwRepository.findOneByUserIdAndTypeApp(userId)
    }

    async getUserReveiwWithCollectorId(userId: string, collectorId: string): Promise<IReviewDocument | null> {
        return this.reveiwRepository.userHasReviewedCollector(userId, collectorId)
    }

    async getAllAppReviews(lastId: string, limit: number): Promise<{reviewDocument: IReviewDocument, userDocument: Partial<IUserDocument>} []> {
        return this.reveiwRepository.findAllAppReviewsWithUserDetails(lastId, limit)
    }

    async getUserReviewsAboutCollectors(userId: string, lastId: string, limit: number): Promise<{reviewDocument: IReviewDocument, userDocument: Partial<IUserDocument>} []> {
        return this.reveiwRepository.findByUserIdAndTypeCollector(userId, lastId, limit)
    }

    async getCollectorReviews(collectorId: string, lastId: string, limit: number): Promise<{reviewDocument: IReviewDocument, userDocument: Partial<IUserDocument>} []>{
        return this.reveiwRepository.findByCollectorId(collectorId, lastId, limit)
    }

    async deleteReview(id: string): Promise<void> {
        await this.reveiwRepository.deleteById(id)
    }

}