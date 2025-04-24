import { IReviewDocument } from "../documents/IReviewDocument";
import { IUserDocument } from "../documents/IUserDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface IReveiwRepository extends IBaseRepository<IReviewDocument> {
    userHasReviewedCollector(userId: string, collectorId: string): Promise<IReviewDocument | null>
    findOneByUserIdAndTypeApp(userId: string):  Promise<IReviewDocument | null>

    findAllAppReviewsWithUserDetails(lastId: string, limit: number): Promise<{reviewDocument: IReviewDocument, userDocument: Partial<IUserDocument>} []>
    findByUserIdAndTypeCollector(userId: string, lastId: string, limit: number): Promise<{ reviewDocument: IReviewDocument; userDocument: Partial<IUserDocument> }[]> 
    findByCollectorId(collectorId: string, lastId: string, limit: number): Promise<{ reviewDocument: IReviewDocument; userDocument: Partial<IUserDocument> }[]> 
}