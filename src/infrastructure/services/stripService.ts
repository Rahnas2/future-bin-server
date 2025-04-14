import { inject, injectable } from "inversify";
import { IStripService } from "../../interfaces/services/IStripService";
import Stripe from "stripe";
import { notFound } from "../../domain/errors";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { INotificationRepository } from "../../interfaces/repositories/INotificationRepository";
import { ISocketService } from "../../interfaces/services/ISocketService";
import { IPickupRequestRepository } from "../../interfaces/repositories/IPickupRequestRepository";
import { ISubscriptionRepository } from "../../interfaces/repositories/ISubscriptionRepository";
import { IScheduledPickupRepository } from "../../interfaces/repositories/IScheduledRepository";

import { addDays, addWeeks, addMonths } from 'date-fns';

@injectable()
export class stripeService implements IStripService {

    private stripe: Stripe;

    constructor(@inject(INTERFACE_TYPE.notificationRepository) private notificationRepository: INotificationRepository,
        @inject(INTERFACE_TYPE.SocketService) private SocketService: ISocketService,
        @inject(INTERFACE_TYPE.pickupRequestRepository) private pickupRequestRepository: IPickupRequestRepository,
        @inject(INTERFACE_TYPE.subscriptionRepositoy) private subscriptionRepositoy: ISubscriptionRepository,
        @inject(INTERFACE_TYPE.scheduledPickupRepository) private scheduledPickupRepository: IScheduledPickupRepository
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET as string);
    }


    //create payment intent
    async createPaymentIntent(amount: number, userId: string): Promise<{ id: string, clientSecret: string }> {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency: 'INR',
            payment_method_types: ['card'],
            metadata: {
                userId
            },
        })

        if (!paymentIntent.client_secret) {
            throw new notFound('Client secret not found for the created payment intent')
        }

        console.log('payment intent ', paymentIntent)
        return { id: paymentIntent.id, clientSecret: paymentIntent.client_secret }
    }


    //create payment id
    async createPaymentSession(amount: number, userId: string) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'INR',
                    product_data: { name: 'payment' },
                    unit_amount: amount
                },
                quantity: 1,

            }],
            metadata: {
                userId
            },
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment-status?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-status?success=false&session_id={CHECKOUT_SESSION_ID}`,
        });

        if (!session.url || !session.amount_total) {
            throw new notFound('url or amount not found')
        }
        console.log('payment session ', session)
        return { url: session.url, amount: session.amount_total };
    }


    //create refund 
    async createRefund(paymentIntentId: string, amount: number): Promise<Stripe.Refund> {
        return this.stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: Math.round(amount * 100),
        });
    }

    async handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void> {
        const event = this.stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        console.log('webhook event ', event)
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutCompleted(event.data.object);
                break;
            case 'payment_intent.succeeded':
                await this.handlePaymentIntentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentFailed(event.data.object);
                break;
            case 'refund.updated':
                await this.handleRefundSuccess(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }

    private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {

        const userId = session.metadata?.userId
        if (!userId) throw new Error("User ID not found in metadata");

        // Determine payment status
        const isPaymentSuccess = session.payment_status === 'paid';
        const amount = session.amount_total ? session.amount_total / 100 : 0;

        // Create notification
        const notificationType = isPaymentSuccess ? 'payment_success' : 'payment_failed';
        const message = isPaymentSuccess
            ? `Payment of ₹${amount} completed successfully`
            : `Payment of ₹${amount} failed. Please try again`;

        const notification = await this.notificationRepository.create({
            userId,
            type: notificationType,
            message
        });

        // Send real-time notification
        this.SocketService.sentNotification(
            userId,
            isPaymentSuccess ? 'payment_success' : 'payment_failed',
            notification
        );

    }

    private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
        const userId = paymentIntent.metadata.userId
        if (!userId) throw new Error("User ID not found in metadata");

        console.log('payment success ', paymentIntent)
        // Create notification
        const notification = await this.notificationRepository.create({
            userId,
            type: 'payment_success',
            message: `Payment of ₹${paymentIntent.amount / 100} completed successfully`,
        })

        // Send real-time notification
        this.SocketService.sentNotification(userId, 'new_notification', notification)

        // Check if the payment is for a pickup request
        const pickupRequest = await this.pickupRequestRepository.findOne({ paymentIntentId: paymentIntent.id });
        if (!pickupRequest) return;

        // Update pickup request status to confirmed
        await this.pickupRequestRepository.findByIdAndUpdate(pickupRequest._id, {status: 'confirmed'})

        // If the request is a subscription, create scheduled pickups
        if (pickupRequest.type === 'subscription' && pickupRequest.subscriptionPlanId) {
            const subscription = await this.subscriptionRepositoy.findById(pickupRequest.subscriptionPlanId);
            if (!subscription) throw new Error("Subscription not found");

            const frequency = subscription.frequency;
            const totalPickups = subscription.totalPickups;
            const startDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)

            // Generate scheduled pickup dates based on frequency
            const scheduledPickups = Array.from({ length: totalPickups }, (_, index) => {
                let scheduledDate: Date;
                switch (frequency) {
                    case 'daily':
                        scheduledDate = addDays(startDate, index);
                        break;
                    case 'weekly': 
                        scheduledDate = addWeeks(startDate, index);     
                        break;
                    case 'monthly':
                        scheduledDate = addMonths(startDate, index);
                        break;
                    default:
                        throw new Error(`Invalid frequency: ${frequency}`);
                }

                return {
                    pickupRequestId: pickupRequest._id,
                    scheduledDate,
                    status: 'pending',
                }
            })
            console.log('scheduledPickups array ', scheduledPickups)
            const response = await this.scheduledPickupRepository.createMany(scheduledPickups)
            console.log('response insert many ', response)
        }
    }

    private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
        // Handle failed payments
        const userId = paymentIntent.metadata.userId
        if (!userId) throw new Error("User ID not found in metadata");

        // Create notification
        const notification = await this.notificationRepository.create({
            userId,
            type: 'payment_failure',
            message: `Payment of ₹${paymentIntent.amount / 100} failed`,
        })

        // Send real-time notification
        this.SocketService.sentNotification(userId, 'new_notification', notification)
    }

    private async handleRefundSuccess(refund: Stripe.Refund) {
        const request = await this.pickupRequestRepository.findOne({ paymentIntentId: refund.payment_intent });

        if (request) {
            const data = {
                refunded: true,
                refundedAmount: refund.amount / 100,
                refundId: refund.id,
                refundedAt: new Date(refund.created * 1000)
            }
            await this.pickupRequestRepository.findByIdAndUpdate(request._id, { refund: data });
        }
    }

}