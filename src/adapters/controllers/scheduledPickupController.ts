import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IScheduledPickupInteractor } from "../../interfaces/interactors/IScheduledPickupInteractor";
import { AuthRequest } from "../../dtos/authRequestDto";
import { NextFunction, Request, Response } from "express";

@injectable()
export class scheduledPickupController {
    constructor(@inject(INTERFACE_TYPE.scheduledPickupInteractor) private scheduledPickupInteractor: IScheduledPickupInteractor) { }

    onGetCollectorScheduledPickups = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const collectorId = req._id;
            if (!collectorId) {
                res.status(400).json({ message: 'Collector ID missing' });
                return
            }

            const scheduledPickups = await this.scheduledPickupInteractor.getCollectorScheduledPickups(collectorId);
            res.status(200).json({ message: 'Success', scheduledPickups });
        } catch (error) {
            next(error);
        }
    }

    onCompleteScheduledPickup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const scheduledPickupId = req.params.id;

            if (!scheduledPickupId) {
                res.status(400).json({ message: 'Collector ID or Pickup ID missing' });
                return
            }

            await this.scheduledPickupInteractor.completeScheduledPickup(scheduledPickupId);

            res.status(200).json({ message: 'Scheduled pickup completed successfully' });
        } catch (error) {

        }
    }
}