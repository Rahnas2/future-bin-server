export interface transaction {
    paymentId: string,
    pickupRequestId: string,
    userId: string,
    amount: number,
    currency: string,
    type: 'credit'| 'debit'
    paymentStatus: 'succeeded' | 'failed'
    createdAt: Date
}