import { IReviewDocument } from "../documents/IReviewDocument";
import { IUserDocument } from "../documents/IUserDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface IReveiwRepository extends IBaseRepository<IReviewDocument> {
    userHasReviewedCollector(userId: string, collectorId: string): Promise<IReviewDocument | null>
    findAllAppReviewsWithUserDetails(): Promise<{reviewDocument: IReviewDocument, userDocument: Partial<IUserDocument>} []>
    findOneByUserIdAndTypeApp(userId: string):  Promise<IReviewDocument | null>
    findByUserIdAndTypeCollector(userId: string): Promise<IReviewDocument []>
    findByCollectorId(collectorId: string): Promise<IReviewDocument []>
}