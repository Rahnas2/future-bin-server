import { transactionAnalyticsDto } from "../../dtos/transactionAnalyticsDto";
import { ITransactionDocument } from "../documents/ITransactionDocument";

export interface ITransactionInteractor {
    transactionHistory(userId: string, role: string, page: number, limit: number): Promise<{ transactions: ITransactionDocument[], total: number }>
    analytics(filter: string, type: string, startDate?: string, endDate?: string): Promise<transactionAnalyticsDto []>
}