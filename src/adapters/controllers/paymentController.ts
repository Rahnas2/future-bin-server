import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IPaymentInteractor } from "../../interfaces/interactors/IPaymentInteractor";
import { IPickupRequestInteractor } from "../../interfaces/interactors/IPickupRequestInteractor";
import { IStripService } from "../../interfaces/services/IStripService";
import { emailService } from "../../infrastructure/services/emailService";

@injectable()
export class paymentController {

    constructor(@inject(INTERFACE_TYPE.paymentInteractor) private paymentInteractor: IPaymentInteractor,
        @inject(INTERFACE_TYPE.pickupRequestInteractor) private pickupRequestInteractor: IPickupRequestInteractor,
        @inject(INTERFACE_TYPE.stripeService) private stripeService: IStripService) { }


    onConfirmPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { requestId, paymentStatus } = req.body

            await this.pickupRequestInteractor.updatePaymentStatus(requestId, paymentStatus)

            res.status(200).json({ message: 'success' })
        } catch (error) {
            next(error)
        }
    }

    OncreatePaymentSession = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { amount, userId, pickupRequestId } = req.body
            console.log('amount ', amount)
            const session = await this.stripeService.createPaymentSession(amount * 100, userId, pickupRequestId)
            res.status(200).json({message: 'success', session})
        } catch (error) {
            next(error)
        }
    }

    onRefund = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { paymentIntentId, amount } = req.body

            const refund = await this.stripeService.createRefund(paymentIntentId, amount)
            console.log('refund ', refund)
            res.status(200).json({message: 'success', refundId: refund.id, amount: refund.amount / 100})
        } catch (error) {
            next(error)
        }
    }

    onGetClientSecret = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { requestId } = req.params

            const clientSecret = await this.paymentInteractor.getClientSecret(requestId)
            
            res.status(200).json({message: 'success', clientSecret})
        } catch (error) {
            next(error)
        }
        
    }
}