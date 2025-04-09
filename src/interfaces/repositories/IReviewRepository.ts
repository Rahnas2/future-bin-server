import { IReviewDocument } from "../documents/IReviewDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface IReveiwRepository extends IBaseRepository<IReviewDocument> {
    userHasReviewedCollector(userId: string, collectorId: string): Promise<IReviewDocument | null>
    findOneByUserIdAndTypeApp(userId: string):  Promise<IReviewDocument | null>
    findByUserIdAndTypeCollector(userId: string): Promise<IReviewDocument []>
    findByCollectorId(collectorId: string): Promise<IReviewDocument []>
}