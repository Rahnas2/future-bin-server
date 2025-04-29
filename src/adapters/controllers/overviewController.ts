import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IOverviewInteractor } from "../../interfaces/interactors/IOverviewInteractor";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../../dtos/authRequestDto";

@injectable()
export class overviewController {
    constructor(@inject(INTERFACE_TYPE.overviewInteractor) private overviewInteractor: IOverviewInteractor){}

    onGetUnreadCounts = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req._id

            if(!userId){
                res.status(400).json({message: 'user id not found'})
                return 
            }

            const counts = await this.overviewInteractor.getUnreadCounts(userId)
            console.log('result ', counts)

            res.status(200).json({message: 'success', counts})
        } catch (error) {
            next(error)
        }
    }
}




