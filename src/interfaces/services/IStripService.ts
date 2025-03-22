export interface IStripService {
    createPaymentIntent(amount: number): Promise<{clientSecret: string}>
}