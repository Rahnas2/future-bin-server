import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IScheduledPickupInteractor } from "../../interfaces/interactors/IScheduledPickupInteractor";
import { AuthRequest } from "../../dtos/authRequestDto";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../utils/statusCode";

@injectable()
export class scheduledPickupController {
    constructor(@inject(INTERFACE_TYPE.scheduledPickupInteractor) private scheduledPickupInteractor: IScheduledPickupInteractor) { }

    onGetCollectorScheduledPickups = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const collectorId = req._id;
            if (!collectorId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Collector ID missing' });
                return
            }

            const scheduledPickups = await this.scheduledPickupInteractor.getCollectorScheduledPickups(collectorId);
            res.status(HttpStatusCode.OK).json({ message: 'Success', scheduledPickups });
        } catch (error) {
            next(error);
        }
    }

    onCompleteScheduledPickup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const scheduledPickupId = req.params.id;

            if (!scheduledPickupId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Collector ID or Pickup ID missing' });
                return
            }

            await this.scheduledPickupInteractor.completeScheduledPickup(scheduledPickupId);

            res.status(HttpStatusCode.OK).json({ message: 'Scheduled pickup completed successfully' });
        } catch (error) {
            next(error)
        }
    }


    onGetScheduledPickupsForTheRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { pickupRequestId } = req.params

            if (!pickupRequestId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'pickup request ID missing' })
                return
            }

            const scheduledPickups = await this.scheduledPickupInteractor.getScheduledPickupsForTheRequest(pickupRequestId)

            res.status(HttpStatusCode.OK).json({ message: 'success', scheduledPickups })

        } catch (error) {
            next(error)
        }
    }
}