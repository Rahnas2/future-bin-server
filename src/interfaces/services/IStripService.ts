import Stripe from "stripe"

export interface IStripService {
    createPaymentIntent(amount: number, userId: string): Promise<{id: string, clientSecret: string}>
    createPaymentSession(amount: number, userId: string): Promise<{url: string, amount: number}>
    createRefund(paymentIntentId: string, amount: number): Promise<Stripe.Refund>
    handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void>
}     