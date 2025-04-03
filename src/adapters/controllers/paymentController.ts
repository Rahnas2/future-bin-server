import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IPaymentInteractor } from "../../interfaces/interactors/IPaymentInteractor";
import { IPickupRequestInteractor } from "../../interfaces/interactors/IPickupRequestInteractor";

@injectable()
export class paymentController {

    constructor(@inject(INTERFACE_TYPE.paymentInteractor) private paymentInteractor: IPaymentInteractor,
        @inject(INTERFACE_TYPE.pickupRequestInteractor) private pickupRequestInteractor: IPickupRequestInteractor) { }


    onConfirmPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { requestId, paymentStatus } = req.body

            await this.pickupRequestInteractor.updatePaymentStatus(requestId, paymentStatus)

            res.status(200).json({ message: 'success' })
        } catch (error) {
            next(error)
        }
    }
}