import { revenueSummaryDto } from "../../dtos/RevenueSummaryDto";
import { transactionAnalyticsDto } from "../../dtos/transactionAnalyticsDto";
import { ITransactionDocument } from "../documents/ITransactionDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface ITransactionRepository extends IBaseRepository<ITransactionDocument>{

    findTransactionsByUserId(userId: string, page: number, limit: number): Promise<ITransactionDocument []>

    findSummary(): Promise<revenueSummaryDto []>
    findTotalEarningsForCollector(collectorId: string): Promise<{ totalEarnings: number }[]>
    findCollectorEarningsByPickupType(userId: string): Promise<{ _id: string; totalEarnings: number }[]>
    findLatestTransfer(collectorId: string): Promise<{ createdAt: Date } | null>

    yearWiseFilerByType(type: string, startYear: number, currentYear: number): Promise<transactionAnalyticsDto []>
    monthlyFilterByType(type: string, currentYear: number): Promise<transactionAnalyticsDto []> 
    filterByCustomDatesAndType(type: string, startDate: Date, endDate: Date): Promise<transactionAnalyticsDto []>
}