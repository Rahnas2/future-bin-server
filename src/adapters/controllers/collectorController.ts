import { Response, Request, NextFunction } from "express";
import { id, inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IUserManagmentInteractor } from "../../interfaces/interactors/IUserManagmentInteractor";
import { AuthRequest } from "../../dtos/authRequestDto";
import { ICollectorInteractor } from "../../interfaces/interactors/ICollectorInteractor";

@injectable()
export class collectorController {
    constructor(@inject(INTERFACE_TYPE.userManagmentInteractor) private userManagementInteractor: IUserManagmentInteractor,
        @inject(INTERFACE_TYPE.collectorInteractor) private collectorInteractor: ICollectorInteractor) { }

    //fetch collector
    onFetchCollector = async (req: AuthRequest, res: Response, next: NextFunction) => {
        console.log('start fetching ')
        try {
            const userId = req._id
            const collector = await this.userManagementInteractor.fetchCollectorDetails(userId as string)
            console.log('fetghing completed ', collector)
            res.status(200).json({ message: 'success', collector })
        } catch (error) {
            next(error)
        }
    }

    //update collector
    onPatchUpdates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { _id, ...data } = req.body

            if (!_id) {
                res.status(400).json({ message: 'id is missing' })
                return
            }

            const updatedCollector = await this.collectorInteractor.patchUpdate(_id, data)
            res.status(200).json({message: 'success', updatedCollector})
        } catch (error) {
            next(error)
        }
    }
}