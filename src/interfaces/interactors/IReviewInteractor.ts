import { Review } from "../../domain/entities/review";
import { IReviewDocument } from "../documents/IReviewDocument";

export interface IReveiwInteractor {
    addReview(data: Review): Promise<IReviewDocument>
    updateReview(id: string, data: Partial<IReviewDocument>): Promise<IReviewDocument>
    getAllReviews(): Promise<IReviewDocument []>
    getUserReviewAboutApp(userId: string): Promise<IReviewDocument | null>
    getUserReviewsAboutCollectors(userId: string): Promise<IReviewDocument []>
    getCollectorReviews(collectorId: string): Promise<IReviewDocument []>
    deleteReview(id: string): Promise<void>
}