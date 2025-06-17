import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { ITransactionInteractor } from "../../interfaces/interactors/ITransactionInteractor";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../../dtos/authRequestDto";
import { HttpStatusCode } from "../../utils/statusCode";

@injectable()
export class transactionController {
    constructor(@inject(INTERFACE_TYPE.transactionInteractor) private transactionInteractor: ITransactionInteractor) { }

    onTransactionHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req._id
            const role = req.role

            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const { transactions, total } = await this.transactionInteractor.transactionHistory(userId as string, role as string, page, limit)
            res.status(HttpStatusCode.OK).json({ message: 'success', transactions, totalPages: Math.ceil(total / limit) })
        } catch (error) {
            next(error)
        }
    }


    onAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const filter = req.query.filter as string;
            const type = (req.query.type as string) || 'credited'

            let startDate: string | undefined;
            let endDate: string | undefined;

            if (filter === 'custom') {
                startDate = req.query.startDate as string;
                endDate = req.query.endDate as string;

                if (!startDate || !endDate) {
                    res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Start date and end date are required for custom filter.' });
                    return
                }
            }

            const analytics = await this.transactionInteractor.analytics(filter, type, startDate, endDate)

            res.status(HttpStatusCode.OK).json({ message: 'success', analytics })

        } catch (error) {
            next(error)
        }
    }

}