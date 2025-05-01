import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils/appConst";
import { ITransactionRepository } from "../interfaces/repositories/ITransactionReporisoty";
import { ITransactionInteractor } from "../interfaces/interactors/ITransactionInteractor";
import { ITransactionDocument } from "../interfaces/documents/ITransactionDocument";
import { InvalidCredentialsError } from "../domain/errors";
import { transactionAnalyticsDto } from "../dtos/transactionAnalyticsDto";

@injectable()
export class transactionInteractor implements ITransactionInteractor {
    constructor(@inject(INTERFACE_TYPE.transactionRepository) private transactionRepository: ITransactionRepository) { }

    async transactionHistory(userId: string, role: string, page: number, limit: number): Promise<{ transactions: ITransactionDocument[], total: number }> {
        if (role === 'admin') {
            const [ transactions, total ] =  await Promise.all([
                this.transactionRepository.findAll(page, limit),
                this.transactionRepository.totalDocumentCount()
            ]) 
            return { transactions, total } 
            
        }
        const transactions =  await this.transactionRepository.findTransactionsByUserId(userId, page, limit)
        const total = await this.transactionRepository.countFilterDocument({userId})

        return { transactions, total }
    }

    async analytics(filter: string, type: string, startDate?: string, endDate?: string): Promise<transactionAnalyticsDto[]> {
        const currentYear = new Date().getFullYear();

        let response = []
        let result = []


        if (filter === 'yearly') {
            const startYear = currentYear - 9;
            response = await this.transactionRepository.yearWiseFilerByType(type, startYear, currentYear)

            for (let i = startYear; i <= currentYear; i++) {
                const found = response.find(r => r.x == i.toString());
                result.push({
                    x: i.toString(),
                    y: found ? found.y : 0
                });
            }
        } else if (filter === 'monthly') {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            response = await this.transactionRepository.monthlyFilterByType(type, currentYear)

            for (let i = 1; i <= 12; i++) {
                const found = response.find(r => r.x == i.toString());
                result.push({
                    x: monthNames[i - 1],
                    y: found ? found.y : 0
                });
            }

        } else if (filter === 'custom') {

            if (!startDate || !endDate) {
                throw new InvalidCredentialsError('stard date and end date are required')
            }

            const start = new Date(startDate);
            const end = new Date(endDate);
            // Include entire end date
            end.setHours(23, 59, 59, 999);


            const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

            response = await this.transactionRepository.filterByCustomDatesAndType(type, start, end)
            for (let i = 0; i < daysDiff; i++) {
                const current = new Date(start);
                current.setDate(current.getDate() + i);
                const year = current.getFullYear();
                const month = current.getMonth() + 1;
                const day = current.getDate();

                const found = response.find(r => r.x === `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);

                result.push({
                    x: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    y: found ? found.y : 0
                });
            }
        } else {
            throw new InvalidCredentialsError('invalid filter data')
        }
        return result
    }
}