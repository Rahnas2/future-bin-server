import Stripe from "stripe"

export interface IStripService {
    createPaymentIntent(amount: number, userId: string): Promise<{id: string, clientSecret: string}>
    retrievePaymentIntent(paymentIntent: string): Promise<Stripe.PaymentIntent>

    createPaymentSession(amount: number, userId: string, pickupRequestId: string): Promise<{url: string, amount: number}>


    createRefund(paymentIntentId: string, amount: number): Promise<Stripe.Refund>
    handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void>

    createConnectedAccount(collectorId: string, email: string): Promise<string>

    createOnboardingLink(stripeAccountId: string): Promise<string>    
    
    createTransfer(data: { amount: number; currency: string; destination: string; transfer_group?: string }): Promise<Stripe.Transfer>

    checkBalance(stripeAccountId: string): Promise<Stripe.Balance>

    createPayout(stripeAccountId: string, amount: number): Promise<Stripe.Payout>
}     