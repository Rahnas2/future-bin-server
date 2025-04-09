import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IStripService } from "../../interfaces/services/IStripService";


@injectable()
export class webhookController {
    constructor(
        @inject(INTERFACE_TYPE.stripeService) private stripeService: IStripService
    ){ }

    onHandleStripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const sig = req.headers['stripe-signature'] as string;
                await this.stripeService.handleWebhookEvent(req.body, sig);
                res.status(200).send()
            } catch (err: any) {
                console.error(`Webhook Error: ${err.message}`);
                next()
            }
    }
}