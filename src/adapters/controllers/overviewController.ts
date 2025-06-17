import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IOverviewInteractor } from "../../interfaces/interactors/IOverviewInteractor";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../../dtos/authRequestDto";
import { HttpStatusCode } from "../../utils/statusCode";

@injectable()
export class overviewController {
    constructor(@inject(INTERFACE_TYPE.overviewInteractor) private overviewInteractor: IOverviewInteractor) { }

    onGetUnreadCounts = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req._id

            if (!userId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'user id not found' })
                return
            }

            const counts = await this.overviewInteractor.getUnreadCounts(userId)
            console.log('result ', counts)

            res.status(HttpStatusCode.OK).json({ message: 'success', counts })
        } catch (error) {
            next(error)
        }
    }
}




