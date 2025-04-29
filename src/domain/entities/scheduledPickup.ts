export interface scheduledPickup {
    _id: string,
    pickupRequestId: string,
    scheduledDate: Date,
    status: string,
    completedAt: Date
}