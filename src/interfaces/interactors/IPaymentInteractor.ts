
export interface IPaymentInteractor {
    confirmPayment(payment: string, request?: string): Promise<void>
}