export interface BasePickupRequest<T extends 'on-demand' | 'subscription'> {
    userId: string;
    name: string;
    mobile: string;
    type: T;
    status: string;
    address: {
        street: string;
        houseNo: string;
        district: string;
        city: string;
        pincode: number;
        location: {
            type: 'Point';
            coordinates: [number, number];
        };
    };
    collectorId?: string;
    collectorName?: string;
    paymentStatus: string;
    price: number;
    assignedAt?: Date;
    completedAt?: Date;
    createdAt?: Date;
}

export interface OnDemandPickupRequest extends BasePickupRequest<'on-demand'> {
    wasteTypes: string[];
    weight: string;
}

export interface SubscriptionPickupRequest extends BasePickupRequest<'subscription'> {
    subscriptionPlanId: string;
    subscriptionPlanName: string;
}

export type PickupRequest = OnDemandPickupRequest | SubscriptionPickupRequest;
