import { ITransactionDocument } from "../documents/ITransactionDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface ITransactionRepository extends IBaseRepository<ITransactionDocument>{
    findTotalEarnings(userId: string): Promise<{ totalEarnings: number }[]>
    findCollectorEarningsByPickupType(userId: string): Promise<{ _id: string; totalEarnings: number }[]>
    findLatestCreditTransaction(userId: string): Promise<{ createdAt: Date } | null>
}