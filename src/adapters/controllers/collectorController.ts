import { Response, Request, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IUserManagmentInteractor } from "../../interfaces/interactors/IUserManagmentInteractor";
import { AuthRequest } from "../../dtos/authRequestDto";

@injectable()
export class collectorController { 
    constructor(@inject(INTERFACE_TYPE.userManagmentInteractor) private userManagementInteractor: IUserManagmentInteractor) {}

    onFetchCollector = async(req: AuthRequest, res: Response, next: NextFunction) => {
        console.log('start fetching ')
        try {
            const userId = req._id
            const collector = await this.userManagementInteractor.fetchCollectorDetails(userId as string)
            console.log('fetghing completed ', collector)
            res.status(200).json({message: 'success', collector})
        } catch (error) {
            next(error)
        }
    } 
}