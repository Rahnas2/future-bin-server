import { NextFunction, Response, Request } from "express";
import { AuthRequest } from "../../dtos/authRequestDto";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { INotificationInteractor } from "../../interfaces/interactors/INotificationInteractor";
import { notFound } from "../../domain/errors";


@injectable()
export class notificationController {

    constructor(@inject(INTERFACE_TYPE.notificationInteractor) private notificationInteractor: INotificationInteractor) {}

    onFetchAllNotificationOfUser = async(req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req._id

            if(!userId){
                throw new notFound('user id not found')
            }

            const notifications = await this.notificationInteractor.fetchAllNotificationOfUser(userId)

            res.status(200).json({message: 'success', notifications})
        } catch (error) {
            next(error)
        }
    }

    onDeleteNotifiation = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.query

            if(!id){
                res.status(400).json({message: 'id is missing'})
            }

            await this.notificationInteractor.deleteNotification(id as string)

            res.status(200).json({message: 'success'})
        } catch (error) {
            next(error)
        }
    }
}