
import { Response, Request, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IUserManagmentInteractor } from "../../interfaces/interactors/IUserManagmentInteractor";
import { AuthRequest } from "../../dtos/authRequestDto";
import { IUserInteractor } from "../../interfaces/interactors/IUserInteractor";

@injectable()
export class userController {
    constructor(@inject(INTERFACE_TYPE.userManagmentInteractor) private userManagmentInteratcor: IUserManagmentInteractor,
        @inject(INTERFACE_TYPE.userInteractor) private userInteractor: IUserInteractor) { }

    onFetchUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {

            const userId = req._id
            console.log('user id ', userId)
            const user = await this.userManagmentInteratcor.fetchUserDetail(userId as string)
            console.log('backend success', user)
            res.status(200).json({ message: 'success', user })
        } catch (error) {
            console.error('error from fetch user ', error)
            next(error)
        }
    }

    onEditUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req._id
            const data = req.body
            const userData = {_id: userId, ...data}
            const user = await this.userInteractor.editUserProfile(userData, req.file)
            res.status(200).json({ message: 'success', user })
        } catch (error) {
            console.log('error edit profile ', error)
            next(error)
        }
    }
}