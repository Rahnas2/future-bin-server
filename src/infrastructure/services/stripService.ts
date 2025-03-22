import { injectable } from "inversify";
import { IStripService } from "../../interfaces/services/IStripService";
import Stripe from "stripe";
import { notFound } from "../../domain/errors";

@injectable()
export class stripeService implements IStripService {

    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET as string);
    }

    async createPaymentIntent(amount: number): Promise<{ clientSecret: string; }> {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency: 'INR',
            payment_method_types: ['card'],
        })

        if (!paymentIntent.client_secret) {
            throw new notFound('Client secret not found for the created payment intent')
        }

        return { clientSecret: paymentIntent.client_secret }
    }
}