import { NextFunction, Response, Request } from "express";
import { AuthRequest } from "../../dtos/authRequestDto";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { INotificationInteractor } from "../../interfaces/interactors/INotificationInteractor";
import { notFound } from "../../domain/errors";
import { HttpStatusCode } from "../../utils/statusCode";


@injectable()
export class notificationController {

    constructor(@inject(INTERFACE_TYPE.notificationInteractor) private notificationInteractor: INotificationInteractor) {}

    onFetchAllNotificationOfReceiver= async(req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const receiverId = req._id

            if(!receiverId){
                throw new notFound('user id not found')
            }

            const notifications = await this.notificationInteractor.fetchAllNotificationOfReceiver(receiverId)

            res.status(HttpStatusCode.OK).json({message: 'success', notifications})
        } catch (error) {
            next(error)
        }
    }

    onDeleteNotifiation = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.query

            if(!id){
                res.status(HttpStatusCode.BAD_REQUEST).json({message: 'id is missing'})
            }

            await this.notificationInteractor.deleteNotification(id as string)

            res.status(HttpStatusCode.OK).json({message: 'success'})
        } catch (error) {
            next(error)
        }
    }
}