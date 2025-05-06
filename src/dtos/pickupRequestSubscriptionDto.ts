export interface pickupRequestSubscriptionDto {
    planId: string;
    name: string;
    features: string[]
    totalPickups: number;
    completedPickups: number;
    startDate?: Date;
    endDate?: Date;
}