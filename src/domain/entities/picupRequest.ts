import { onDemandWasteTypeDto } from "../../dtos/onDemandWasteTypeDto";
import { requestCancellationDto } from "../../dtos/requestCancellationDto";

export interface BasePickupRequest<T extends 'on-demand' | 'subscription'> {
    userId: string;
    name: string;
    mobile: string;
    email: string;
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
    cancellation?: requestCancellationDto
    paymentStatus: string;
    totalAmount: number;
    paidAmount: number;
    paymentIntentId?: string;
    assignedAt?: Date;
    completedAt?: Date;
    createdAt?: Date;
}

export interface OnDemandPickupRequest extends BasePickupRequest<'on-demand'> {
    wasteTypes: onDemandWasteTypeDto[];
    totalWeight: number;
}

export interface SubscriptionPickupRequest extends BasePickupRequest<'subscription'> {
    subscriptionPlanId: string;
    subscriptionPlanName: string;
}

export type PickupRequest = OnDemandPickupRequest | SubscriptionPickupRequest;
