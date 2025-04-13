import { Review } from "../../domain/entities/review";
import { IReviewDocument } from "../documents/IReviewDocument";
import { IUserDocument } from "../documents/IUserDocument";

export interface IReveiwInteractor {
    addReview(data: Review): Promise<IReviewDocument>
    updateReview(id: string, data: Partial<IReviewDocument>): Promise<IReviewDocument>
    getAllReviews(page: number, limit: number): Promise<{reviews: IReviewDocument[], total: number}>
    
    getAllAppReviews(): Promise<{reviewDocument: IReviewDocument, userDocument: Partial<IUserDocument>} []>

    getUserReviewAboutApp(userId: string): Promise<IReviewDocument | null>
    getUserReveiwWithCollectorId(userId: string, collectorId: string): Promise<IReviewDocument | null>
    
    getUserReviewsAboutCollectors(userId: string): Promise<IReviewDocument []>
    getCollectorReviews(collectorId: string): Promise<IReviewDocument []>
    deleteReview(id: string): Promise<void>
}