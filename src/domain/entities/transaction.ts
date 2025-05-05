export interface transaction {
    paymentId: string,
    pickupRequestId?: string,
    userId: string,
    amount: number,
    currency: string,
    type: 'credited' | 'refunded' | 'transfered' | 'withdrawal',
    paymentStatus: 'pending' | 'succeeded' | 'failed'
    createdAt: Date
}