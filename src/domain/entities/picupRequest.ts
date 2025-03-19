
export interface BasePickupRequest  {
    // _id?: string,
    userId: string,
    name: string,
    mobile: string,
    type: 'on-demand' | 'subscription',
    status: string,
    address: {
        street: string
        houseNo: string
        district: string
        city: string
        pincode: number
        location: {
            type: 'Point';
            coordinates: [number, number]
        };
    },
    collectorId?: string,
    collectorName?: string,
    paymentStatus: string,
    price: string,
    assignedAt?: Date,
    completedAt?: Date, 
    createdAt?: Date
}

export interface OnDemandPickupRequest extends BasePickupRequest {
    type: 'on-demand',
    wasteTypes: string [],
    weight: string
}

export interface SubscriptionPickupRequest extends BasePickupRequest {
    type: 'subscription',
    subscriptionPlanId: string,
    subscriptionPlanName: string
}

export type PickupRequest = OnDemandPickupRequest | SubscriptionPickupRequest